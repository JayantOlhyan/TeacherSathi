import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import {
  ClassroomSessionRecord,
  ClassroomSessionDeviceRecord,
  ClassroomEventRecord,
  ClassroomPairingRecord,
  ClassroomSessionStatus,
  ClassroomEventType,
  AuthoritativeClassroomState,
  PresentationState,
  QuizState,
  TimerState,
  WhiteboardState,
} from '../classroom/types';
import { validateEventPayload } from '../classroom/schemas';
import { assertValidSessionTransition } from '../classroom/stateMachine';
import { isTokenExpired } from '../classroom/pairing';

export const classroomRepository = {
  // ===========================================================================
  // SESSION LIFECYCLE
  // ===========================================================================

  async createSession(
    sessionData: {
      id?: string;
      school_id?: string | null;
      class_id?: string | null;
      teacher_id?: string | null;
      title: string;
      grade_id?: string | null;
      subject_id?: string | null;
      book_id?: string | null;
      chapter_id?: string | null;
      active_resource_id?: string | null;
      status?: ClassroomSessionStatus;
    },
    client: SupabaseClient = defaultClient
  ): Promise<ClassroomSessionRecord> {
    const sessionId = sessionData.id || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const record = {
      id: sessionId,
      school_id: sessionData.school_id || null,
      class_id: sessionData.class_id || null,
      teacher_id: sessionData.teacher_id || null,
      title: sessionData.title,
      grade_id: sessionData.grade_id || null,
      subject_id: sessionData.subject_id || null,
      book_id: sessionData.book_id || null,
      chapter_id: sessionData.chapter_id || null,
      active_resource_id: sessionData.active_resource_id || null,
      status: sessionData.status || 'WAITING',
      session_token_hash: 'initial',
      expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4-hour max period
      last_activity_at: now,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await client
      .from('classroom_sessions')
      .insert([record])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create classroom session: ${error.message}`);
    }

    return data as ClassroomSessionRecord;
  },

  async getSessionById(
    sessionId: string,
    client: SupabaseClient = defaultClient
  ): Promise<ClassroomSessionRecord | null> {
    const { data, error } = await client
      .from('classroom_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch classroom session: ${error.message}`);
    }

    return data as ClassroomSessionRecord;
  },

  async updateSessionStatus(
    sessionId: string,
    targetStatus: ClassroomSessionStatus,
    client: SupabaseClient = defaultClient
  ): Promise<ClassroomSessionRecord> {
    const current = await this.getSessionById(sessionId, client);
    if (!current) {
      throw new Error(`Classroom session not found: ${sessionId}`);
    }

    // State machine check
    assertValidSessionTransition(current.status, targetStatus);

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {
      status: targetStatus,
      last_activity_at: now,
      updated_at: now,
    };

    if (targetStatus === 'ACTIVE' && !current.started_at) {
      updates.started_at = now;
    } else if (targetStatus === 'PAUSED') {
      updates.paused_at = now;
    } else if (targetStatus === 'ENDED') {
      updates.ended_at = now;
    }

    const { data, error } = await client
      .from('classroom_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update classroom session status: ${error.message}`);
    }

    // If session ended, invalidate pairings and disconnect active devices
    if (targetStatus === 'ENDED') {
      await client
        .from('classroom_session_devices')
        .update({ status: 'DISCONNECTED', disconnected_at: now, updated_at: now })
        .eq('session_id', sessionId)
        .eq('status', 'CONNECTED');
    }

    return data as ClassroomSessionRecord;
  },

  // ===========================================================================
  // PAIRING HANDSHAKE & DEVICE REGISTRATION
  // ===========================================================================

  async createPairingToken(
    sessionId: string,
    tokenHash: string,
    expiresAt: string,
    client: SupabaseClient = defaultClient
  ): Promise<ClassroomPairingRecord> {
    const session = await this.getSessionById(sessionId, client);
    if (!session) {
      throw new Error(`Classroom session not found: ${sessionId}`);
    }

    if (session.status === 'ENDED') {
      throw new Error('Cannot generate pairing token for an ENDED session.');
    }

    // Insert pairing record
    const { data, error } = await client
      .from('classroom_pairings')
      .insert([
        {
          session_id: sessionId,
          pairing_token_hash: tokenHash,
          expires_at: expiresAt,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to store pairing token: ${error.message}`);
    }

    // Move session to PAIRING status if it was WAITING
    if (session.status === 'WAITING') {
      await client
        .from('classroom_sessions')
        .update({
          status: 'PAIRING',
          pairing_code_hash: tokenHash,
          pairing_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
    }

    return data as ClassroomPairingRecord;
  },

  async consumePairingToken(
    sessionId: string,
    tokenHash: string,
    deviceData: {
      deviceType?: 'TEACHER' | 'SMARTBOARD' | 'STUDENT' | 'OBSERVER';
      deviceName: string;
      deviceFingerprint?: string | null;
      role?: 'CONTROLLER' | 'DISPLAY' | 'PARTICIPANT' | 'AUDITOR';
      userId?: string | null;
    },
    client: SupabaseClient = defaultClient
  ): Promise<{ session: ClassroomSessionRecord; device: ClassroomSessionDeviceRecord }> {
    const session = await this.getSessionById(sessionId, client);
    if (!session) {
      throw new Error(`Classroom session not found: ${sessionId}`);
    }

    if (session.status === 'ENDED') {
      throw new Error('Cannot pair device with an ENDED classroom session.');
    }

    // Verify pairing record
    const { data: pairing, error: pError } = await client
      .from('classroom_pairings')
      .select('*')
      .eq('session_id', sessionId)
      .eq('pairing_token_hash', tokenHash)
      .is('used_at', null)
      .single();

    if (pError || !pairing) {
      throw new Error('Invalid or already used pairing token.');
    }

    if (isTokenExpired(pairing.expires_at)) {
      throw new Error('Pairing token has expired.');
    }

    const now = new Date().toISOString();

    // Mark pairing used immediately
    await client
      .from('classroom_pairings')
      .update({ used_at: now })
      .eq('id', pairing.id);

    // Register device in classroom_session_devices
    const deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const { data: device, error: dError } = await client
      .from('classroom_session_devices')
      .insert([
        {
          id: deviceId,
          session_id: sessionId,
          user_id: deviceData.userId || null,
          device_type: deviceData.deviceType || 'SMARTBOARD',
          device_name: deviceData.deviceName,
          device_fingerprint_hash: deviceData.deviceFingerprint || null,
          role: deviceData.role || 'DISPLAY',
          status: 'CONNECTED',
          paired_at: now,
          last_seen_at: now,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (dError) {
      throw new Error(`Failed to register paired device: ${dError.message}`);
    }

    // Transition session to ACTIVE if in WAITING or PAIRING
    let updatedSession = session;
    if (session.status === 'WAITING' || session.status === 'PAIRING') {
      updatedSession = await this.updateSessionStatus(sessionId, 'ACTIVE', client);
    }

    // Record DEVICE_CONNECTED event
    await this.recordEvent(
      sessionId,
      deviceId,
      deviceData.userId || null,
      'DEVICE_CONNECTED',
      {
        deviceId,
        deviceName: deviceData.deviceName,
        deviceType: deviceData.deviceType || 'SMARTBOARD',
      },
      `pairing_${pairing.id}`,
      client
    );

    return {
      session: updatedSession,
      device: device as ClassroomSessionDeviceRecord,
    };
  },

  // ===========================================================================
  // DEVICES & REVOCATION
  // ===========================================================================

  async getDevices(
    sessionId: string,
    client: SupabaseClient = defaultClient
  ): Promise<ClassroomSessionDeviceRecord[]> {
    const { data, error } = await client
      .from('classroom_session_devices')
      .select('*')
      .eq('session_id', sessionId)
      .order('paired_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch classroom devices: ${error.message}`);
    }

    return (data || []) as ClassroomSessionDeviceRecord[];
  },

  async getDeviceById(
    sessionIdOrDeviceId: string,
    deviceIdOrClient?: string | SupabaseClient,
    client: SupabaseClient = defaultClient
  ): Promise<ClassroomSessionDeviceRecord | null> {
    if (typeof deviceIdOrClient === 'string') {
      // (sessionId, deviceId, client)
      const sessionId = sessionIdOrDeviceId;
      const deviceId = deviceIdOrClient;
      const { data, error } = await client
        .from('classroom_session_devices')
        .select('*')
        .eq('session_id', sessionId)
        .eq('id', deviceId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Failed to fetch device: ${error.message}`);
      }

      return data as ClassroomSessionDeviceRecord;
    } else {
      // (deviceId, client) fallback for Phase 1 legacy hardware registry
      const actualClient = (deviceIdOrClient as SupabaseClient) || client;
      const deviceId = sessionIdOrDeviceId;
      const { data, error } = await actualClient
        .from('classroom_devices')
        .select('*')
        .eq('id', deviceId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Failed to fetch device: ${error.message}`);
      }

      return data as unknown as ClassroomSessionDeviceRecord;
    }
  },

  async recordRemoteAction(
    actionData: {
      session_id: string;
      actor_id?: string | null;
      action_type: string;
      payload?: Record<string, unknown>;
    },
    client: SupabaseClient = defaultClient
  ) {
    return this.recordEvent(
      actionData.session_id,
      null,
      actionData.actor_id || null,
      actionData.action_type as ClassroomEventType,
      actionData.payload || {},
      undefined,
      client
    );
  },

  async revokeDevice(
    sessionId: string,
    deviceId: string,
    actorUserId?: string | null,
    client: SupabaseClient = defaultClient
  ): Promise<ClassroomSessionDeviceRecord> {
    const now = new Date().toISOString();

    const { data, error } = await client
      .from('classroom_session_devices')
      .update({
        status: 'REVOKED',
        disconnected_at: now,
        updated_at: now,
      })
      .eq('session_id', sessionId)
      .eq('id', deviceId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to revoke device: ${error.message}`);
    }

    // Record DEVICE_REVOKED event
    await this.recordEvent(
      sessionId,
      deviceId,
      actorUserId || null,
      'DEVICE_REVOKED',
      { deviceId, reason: 'Revoked by teacher' },
      undefined,
      client
    );

    return data as ClassroomSessionDeviceRecord;
  },

  // ===========================================================================
  // AUTHORITATIVE EVENT STREAMING & IDEMPOTENCY
  // ===========================================================================

  async recordEvent(
    sessionId: string,
    deviceId: string | null,
    actorUserId: string | null,
    eventType: ClassroomEventType,
    payload: unknown,
    idempotencyKey?: string,
    client: SupabaseClient = defaultClient
  ): Promise<ClassroomEventRecord> {
    // 1. Session verification
    const session = await this.getSessionById(sessionId, client);
    if (!session) {
      throw new Error(`Classroom session not found: ${sessionId}`);
    }

    if (session.status === 'ENDED') {
      throw new Error('Classroom session is ENDED. No further commands or events are accepted.');
    }

    // 2. Device verification (if deviceId provided)
    if (deviceId) {
      const device = await this.getDeviceById(sessionId, deviceId, client);
      if (device && device.status === 'REVOKED') {
        throw new Error('Revoked devices are prohibited from sending classroom events.');
      }
    }

    // 3. Payload validation
    const sanitizedPayload = validateEventPayload(eventType, payload);

    // 4. Idempotency check
    if (idempotencyKey) {
      const { data: existingEvent } = await client
        .from('classroom_events')
        .select('*')
        .eq('session_id', sessionId)
        .eq('idempotency_key', idempotencyKey)
        .single();

      if (existingEvent) {
        return existingEvent as ClassroomEventRecord;
      }
    }

    // 5. Monotonically increasing sequence number assignment
    const { data: lastSeqRow } = await client
      .from('classroom_events')
      .select('sequence_number')
      .eq('session_id', sessionId)
      .order('sequence_number', { ascending: false })
      .limit(1)
      .single();

    const nextSeq = lastSeqRow && lastSeqRow.sequence_number ? Number(lastSeqRow.sequence_number) + 1 : 1001;

    const now = new Date().toISOString();
    const eventRecord = {
      session_id: sessionId,
      device_id: deviceId || null,
      actor_user_id: actorUserId || null,
      event_type: eventType,
      event_payload: sanitizedPayload,
      sequence_number: nextSeq,
      idempotency_key: idempotencyKey || null,
      created_at: now,
    };

    const { data, error } = await client
      .from('classroom_events')
      .insert([eventRecord])
      .select()
      .single();

    if (error) {
      // Handle race condition on idempotency key
      if (idempotencyKey && error.code === '23505') {
        const { data: retryEvent } = await client
          .from('classroom_events')
          .select('*')
          .eq('session_id', sessionId)
          .eq('idempotency_key', idempotencyKey)
          .single();
        if (retryEvent) return retryEvent as ClassroomEventRecord;
      }
      throw new Error(`Failed to record classroom event: ${error.message}`);
    }

    // 6. Update session state updates based on event type
    const sessionUpdates: Record<string, unknown> = {
      last_activity_at: now,
      updated_at: now,
    };

    if (eventType === 'PUSH_RESOURCE' && sanitizedPayload.resourceId) {
      sessionUpdates.active_resource_id = sanitizedPayload.resourceId;
    }

    await client
      .from('classroom_sessions')
      .update(sessionUpdates)
      .eq('id', sessionId);

    // 7. Supabase Realtime broadcast
    try {
      const channel = client.channel(`classroom:session:${sessionId}`);
      channel.send({
        type: 'broadcast',
        event: 'classroom_event',
        payload: data,
      });
    } catch {
      // Non-blocking in serverless/isolated test environments
    }

    return data as ClassroomEventRecord;
  },

  async getEventsSince(
    sessionId: string,
    sinceSequenceNumber: number = 0,
    client: SupabaseClient = defaultClient
  ): Promise<ClassroomEventRecord[]> {
    const { data, error } = await client
      .from('classroom_events')
      .select('*')
      .eq('session_id', sessionId)
      .gt('sequence_number', sinceSequenceNumber)
      .order('sequence_number', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    return (data || []) as ClassroomEventRecord[];
  },

  // ===========================================================================
  // AUTHORITATIVE STATE RECOVERY
  // ===========================================================================

  async getAuthoritativeState(
    sessionId: string,
    client: SupabaseClient = defaultClient
  ): Promise<AuthoritativeClassroomState> {
    const session = await this.getSessionById(sessionId, client);
    if (!session) {
      throw new Error(`Classroom session not found: ${sessionId}`);
    }

    const devices = await this.getDevices(sessionId, client);

    // Fetch all events for sequence number and state reconstruction
    const { data: events } = await client
      .from('classroom_events')
      .select('*')
      .eq('session_id', sessionId)
      .order('sequence_number', { ascending: true });

    const allEvents = (events || []) as ClassroomEventRecord[];
    const lastSeq = allEvents.length > 0 ? allEvents[allEvents.length - 1].sequence_number : 1000;

    // Default states
    const presentation: PresentationState = {
      presentationId: null,
      slideIndex: 0,
      totalSlides: 0,
      isActive: false,
    };

    const quiz: QuizState = {
      quizResourceId: null,
      isActive: false,
    };

    const timer: TimerState = {
      isRunning: false,
      durationSeconds: 0,
      startedAt: null,
      endsAt: null,
      remainingSeconds: 0,
    };

    const whiteboard: WhiteboardState = {
      isLocked: false,
      sceneData: null,
    };

    // Replay events forward to build latest authoritative state
    for (const ev of allEvents) {
      const p = ev.event_payload;
      switch (ev.event_type) {
        case 'START_PRESENTATION':
          presentation.presentationId = (p.presentationId as string) || null;
          presentation.title = (p.title as string) || undefined;
          presentation.slideIndex = typeof p.slideIndex === 'number' ? p.slideIndex : 0;
          presentation.totalSlides = (p.totalSlides as number) || 0;
          presentation.isActive = true;
          break;

        case 'NEXT_SLIDE':
        case 'PREVIOUS_SLIDE':
        case 'GOTO_SLIDE':
          if (typeof p.slideIndex === 'number') {
            presentation.slideIndex = p.slideIndex;
          }
          break;

        case 'START_QUIZ':
          quiz.quizResourceId = (p.quizResourceId as string) || null;
          quiz.isActive = true;
          quiz.totalQuestions = (p.totalQuestions as number) || undefined;
          break;

        case 'END_QUIZ':
          quiz.isActive = false;
          break;

        case 'START_TIMER':
          timer.isRunning = true;
          timer.durationSeconds = (p.durationSeconds as number) || 0;
          timer.startedAt = (p.startedAt as string) || null;
          timer.endsAt = (p.endsAt as string) || null;
          if (timer.endsAt) {
            const msRemaining = Math.max(0, new Date(timer.endsAt).getTime() - Date.now());
            timer.remainingSeconds = Math.ceil(msRemaining / 1000);
            if (timer.remainingSeconds === 0) timer.isRunning = false;
          }
          break;

        case 'STOP_TIMER':
          timer.isRunning = false;
          timer.remainingSeconds = (p.remainingSeconds as number) || 0;
          break;

        case 'LOCK_BOARD':
          whiteboard.isLocked = true;
          break;

        case 'UNLOCK_BOARD':
          whiteboard.isLocked = false;
          break;

        case 'WHITEBOARD_UPDATE':
          whiteboard.sceneData = p;
          whiteboard.lastUpdatedBy = ev.actor_user_id || ev.device_id;
          break;

        case 'CLEAR_WHITEBOARD':
          whiteboard.sceneData = null;
          break;
      }
    }

    return {
      session,
      devices,
      activeResourceId: session.active_resource_id || null,
      presentation,
      quiz,
      timer,
      whiteboard,
      sequenceNumber: lastSeq,
      lastActivityAt: session.last_activity_at,
    };
  },
};
