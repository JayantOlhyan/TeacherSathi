"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  AuthoritativeClassroomState,
  ClassroomEventRecord,
  ClassroomEventType,
  ClassroomDeviceRole,
} from './types';

export type RealtimeConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';

interface UseClassroomRealtimeOptions {
  sessionId: string;
  deviceId?: string;
  deviceName?: string;
  role?: ClassroomDeviceRole;
  onEvent?: (event: ClassroomEventRecord) => void;
  onStateChange?: (state: AuthoritativeClassroomState) => void;
}

export function useClassroomRealtime({
  sessionId,
  deviceId,
  deviceName = 'Classroom Device',
  role = 'DISPLAY',
  onEvent,
  onStateChange,
}: UseClassroomRealtimeOptions) {
  const [state, setState] = useState<AuthoritativeClassroomState | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<RealtimeConnectionStatus>('connecting');
  const [lastSequence, setLastSequence] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const lastSeqRef = useRef<number>(0);
  const isFetchingStateRef = useRef<boolean>(false);

  // Fetch full authoritative state from server
  const fetchAuthoritativeState = useCallback(async () => {
    if (!sessionId || isFetchingStateRef.current) return null;
    isFetchingStateRef.current = true;

    try {
      const res = await fetch(`/api/classroom/sessions/${sessionId}/state`);
      if (!res.ok) {
        throw new Error(`Failed to fetch state: ${res.statusText}`);
      }
      const json = await res.json();
      const authoritative = json.data as AuthoritativeClassroomState;

      setState(authoritative);
      setLastSequence(authoritative.sequenceNumber);
      lastSeqRef.current = authoritative.sequenceNumber;

      if (onStateChange) onStateChange(authoritative);
      return authoritative;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'State sync failed';
      setError(msg);
      return null;
    } finally {
      isFetchingStateRef.current = false;
    }
  }, [sessionId, onStateChange]);

  // Initial authoritative state load
  useEffect(() => {
    if (sessionId) {
      fetchAuthoritativeState();
    }
  }, [sessionId, fetchAuthoritativeState]);

  // Subscribe to Supabase Realtime channel
  useEffect(() => {
    if (!sessionId) return;

    setConnectionStatus('connecting');
    const channelName = `classroom:session:${sessionId}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { ack: true },
        presence: { key: deviceId || `anon_${Math.random().toString(36).substring(2, 7)}` },
      },
    });

    channel
      .on('broadcast', { event: 'classroom_event' }, async ({ payload }) => {
        const event = payload as ClassroomEventRecord;
        const currentSeq = lastSeqRef.current;

        // Sequence Gap Detection (Section 12 & 21)
        if (event.sequence_number > currentSeq + 1 && currentSeq > 0) {
          // Detected gap! Recover authoritative state
          await fetchAuthoritativeState();
        } else {
          lastSeqRef.current = Math.max(lastSeqRef.current, event.sequence_number);
          setLastSequence(lastSeqRef.current);
          if (onEvent) onEvent(event);

          // Update local view of authoritative state
          await fetchAuthoritativeState();
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          setError(null);
          // Track device presence
          await channel.track({
            deviceId: deviceId || 'anonymous',
            deviceName,
            role,
            onlineAt: new Date().toISOString(),
          });
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setConnectionStatus('reconnecting');
        } else if (status === 'TIMED_OUT') {
          setConnectionStatus('disconnected');
        }
      });

    // Window online/offline listener for auto-reconnect
    const handleOnline = () => {
      setConnectionStatus('reconnecting');
      fetchAuthoritativeState().then(() => setConnectionStatus('connected'));
    };

    const handleOffline = () => {
      setConnectionStatus('disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      channel.unsubscribe();
    };
  }, [sessionId, deviceId, deviceName, role, onEvent, fetchAuthoritativeState]);

  // Command dispatcher: sends sequence-numbered events through validated server API
  const sendCommand = useCallback(
    async (eventType: ClassroomEventType, payload: Record<string, unknown> = {}, idempotencyKey?: string) => {
      try {
        const idKey = idempotencyKey || `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const res = await fetch(`/api/classroom/sessions/${sessionId}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType,
            payload,
            deviceId,
            idempotencyKey: idKey,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Command failed: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data as ClassroomEventRecord;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Command dispatch failed';
        setError(msg);
        throw err;
      }
    },
    [sessionId, deviceId]
  );

  return {
    state,
    connectionStatus,
    lastSequence,
    error,
    refreshState: fetchAuthoritativeState,
    sendCommand,
  };
}
