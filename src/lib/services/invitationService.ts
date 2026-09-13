import crypto from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import {
  CreateInvitationInput,
  InstitutionalInvitationRecord,
  InstitutionalScope,
} from '../validations/institution';

export interface GeneratedInvitationResult {
  invitation: InstitutionalInvitationRecord;
  rawToken: string; // Plaintext token returned ONLY once to the creator
  inviteUrl: string;
}

export const invitationService = {
  /**
   * Generates a cryptographically random invitation token, stores its SHA-256 hash,
   * and returns the plaintext token to be delivered via email or copyable link.
   */
  async createInvitation(
    input: CreateInvitationInput,
    actorProfileId?: string,
    baseUrl = 'https://teachersathi.in',
    client: SupabaseClient = defaultClient
  ): Promise<GeneratedInvitationResult> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (input.expires_in_days || 7));

    const { data, error } = await client
      .from('institutional_invitations')
      .insert([
        {
          email: input.email.toLowerCase().trim(),
          role: input.role,
          target_type: input.target_type,
          target_id: input.target_id,
          invited_by: actorProfileId || null,
          token_hash: tokenHash,
          status: 'CREATED',
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create institutional invitation: ${error.message}`);
    }

    const inviteUrl = `${baseUrl}/auth/invite?token=${rawToken}`;

    return {
      invitation: data as InstitutionalInvitationRecord,
      rawToken,
      inviteUrl,
    };
  },

  /**
   * List pending or active invitations for a target entity.
   */
  async listInvitations(
    targetType?: InstitutionalScope,
    targetId?: string,
    client: SupabaseClient = defaultClient
  ): Promise<InstitutionalInvitationRecord[]> {
    let query = client
      .from('institutional_invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (targetType) query = query.eq('target_type', targetType);
    if (targetId) query = query.eq('target_id', targetId);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to list invitations: ${error.message}`);
    return (data || []) as InstitutionalInvitationRecord[];
  },

  /**
   * Revoke an active invitation.
   */
  async revokeInvitation(
    invitationId: string,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    const { error } = await client
      .from('institutional_invitations')
      .update({
        status: 'REVOKED',
        updated_at: new Date().toISOString(),
      })
      .eq('id', invitationId);

    if (error) throw new Error(`Failed to revoke invitation: ${error.message}`);
  },

  /**
   * Verify an invitation token against its SHA-256 hash.
   */
  async verifyToken(
    rawToken: string,
    client: SupabaseClient = defaultClient
  ): Promise<{ valid: boolean; reason?: string; invitation?: InstitutionalInvitationRecord }> {
    if (!rawToken || rawToken.length < 16) {
      return { valid: false, reason: 'Invalid token format' };
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const { data, error } = await client
      .from('institutional_invitations')
      .select('*')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (error || !data) {
      return { valid: false, reason: 'Invitation not found' };
    }

    const inv = data as InstitutionalInvitationRecord;

    if (inv.status === 'REVOKED') {
      return { valid: false, reason: 'This invitation has been revoked' };
    }

    if (inv.status === 'ACCEPTED') {
      return { valid: false, reason: 'This invitation has already been accepted' };
    }

    if (new Date(inv.expires_at) < new Date()) {
      await client
        .from('institutional_invitations')
        .update({ status: 'EXPIRED' })
        .eq('id', inv.id);
      return { valid: false, reason: 'This invitation has expired' };
    }

    return { valid: true, invitation: inv };
  },

  /**
   * Accept an invitation and provision the user role and administrative membership.
   */
  async acceptInvitation(
    rawToken: string,
    acceptingProfileId: string,
    client: SupabaseClient = defaultClient
  ): Promise<{ success: boolean; role: string; targetType: string; targetId: string }> {
    const verification = await this.verifyToken(rawToken, client);
    if (!verification.valid || !verification.invitation) {
      throw new Error(verification.reason || 'Invalid or expired invitation token');
    }

    const inv = verification.invitation;

    // 1. Mark invitation as accepted
    const { error: acceptError } = await client
      .from('institutional_invitations')
      .update({
        status: 'ACCEPTED',
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', inv.id);

    if (acceptError) throw new Error(`Failed to accept invitation: ${acceptError.message}`);

    // 2. Provision administrative membership based on scope
    if (inv.target_type === 'STATE') {
      await client.from('state_members').upsert([
        {
          state_id: inv.target_id,
          profile_id: acceptingProfileId,
          role: 'STATE_ADMIN',
          status: 'ACTIVE',
        },
      ]);
      await client.from('profiles').update({ role: 'STATE_ADMIN' }).eq('id', acceptingProfileId);
    } else if (inv.target_type === 'DISTRICT') {
      await client.from('district_members').upsert([
        {
          district_id: inv.target_id,
          profile_id: acceptingProfileId,
          role: 'DISTRICT_ADMIN',
          status: 'ACTIVE',
        },
      ]);
      await client.from('profiles').update({ role: 'DISTRICT_ADMIN' }).eq('id', acceptingProfileId);
    } else if (inv.target_type === 'ORGANIZATION') {
      await client.from('organization_members').upsert([
        {
          organization_id: inv.target_id,
          profile_id: acceptingProfileId,
          role: 'ORG_ADMIN',
          status: 'ACTIVE',
        },
      ]);
      await client.from('profiles').update({ role: 'ORG_ADMIN' }).eq('id', acceptingProfileId);
    } else if (inv.target_type === 'SCHOOL') {
      await client.from('school_members').upsert([
        {
          school_id: inv.target_id,
          profile_id: acceptingProfileId,
          membership_role: inv.role === 'TEACHER' ? 'TEACHER' : 'SCHOOL_ADMIN',
          status: 'ACTIVE',
        },
      ]);
      await client
        .from('profiles')
        .update({
          school_id: inv.target_id,
          role: inv.role,
        })
        .eq('id', acceptingProfileId);
    }

    return {
      success: true,
      role: inv.role,
      targetType: inv.target_type,
      targetId: inv.target_id,
    };
  },
};
