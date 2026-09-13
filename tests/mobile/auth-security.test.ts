import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService, SecureStorageDriver } from '../../mobile/src/services/authService';
import { DatabaseManager } from '../../mobile/src/database/databaseManager';
import { ApiClient } from '../../mobile/src/services/apiClient';
import { MobileUserProfile } from '../../mobile/src/types';

class MockSecureStorage implements SecureStorageDriver {
  public store = new Map<string, string>();

  async getItemAsync(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }
  async setItemAsync(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }
  async deleteItemAsync(key: string): Promise<void> {
    this.store.delete(key);
  }
}

describe('Phase 9: Mobile Auth Security & Shared Device Cleanliness', () => {
  let storage: MockSecureStorage;
  let api: ApiClient;
  let db: DatabaseManager;
  let authService: AuthService;

  const mockUser: MobileUserProfile = {
    id: 'usr-teacher-101',
    email: 'teacher@school.gov.in',
    full_name: 'Priya Sharma',
    role: 'TEACHER',
    school_id: 'sch-delhi-01',
  };

  beforeEach(async () => {
    storage = new MockSecureStorage();
    api = new ApiClient('https://mock.teachersathi.in');
    db = new DatabaseManager();
    await db.initialize();
    authService = new AuthService(storage, api, db);
  });

  it('should securely store auth token and user profile on successful session establishment', async () => {
    const token = 'jwt-secure-session-token-xyz';
    await authService.setSession(token, mockUser);

    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getCurrentUser()?.id).toBe('usr-teacher-101');
    expect(api.getAuthToken()).toBe(token);

    // Verify written to secure hardware storage abstraction
    expect(await storage.getItemAsync('teachersathi_secure_auth_token')).toBe(token);
    expect(await storage.getItemAsync('teachersathi_secure_user_profile')).toContain('Priya Sharma');
  });

  it('should restore session from secure storage during app initialization', async () => {
    const token = 'restored-jwt-token';
    await storage.setItemAsync('teachersathi_secure_auth_token', token);
    await storage.setItemAsync('teachersathi_secure_user_profile', JSON.stringify(mockUser));

    const restored = await authService.initialize();
    expect(restored).not.toBeNull();
    expect(restored?.email).toBe('teacher@school.gov.in');
    expect(authService.isAuthenticated()).toBe(true);
    expect(api.getAuthToken()).toBe(token);
  });

  it('should purge all user credentials and private answers on logout to protect shared devices', async () => {
    await authService.setSession('token-to-delete', mockUser);

    // Record some user answers in local db
    await db.recordOfflineAnswer({
      attempt_id: 'att-student-shared',
      question_id: 'q1',
      selected_option_key: 'A',
      is_answered: true,
      client_mutation_id: 'mut-shared-1',
    });

    expect((await db.getAnswersForAttempt('att-student-shared')).length).toBe(1);
    expect((await db.getPendingOutboxItems()).length).toBe(1);

    // Perform logout
    await authService.logout();

    // Verify session terminated
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBeNull();
    expect(api.getAuthToken()).toBeNull();

    // Verify secure storage cleared
    expect(await storage.getItemAsync('teachersathi_secure_auth_token')).toBeNull();
    expect(await storage.getItemAsync('teachersathi_secure_user_profile')).toBeNull();

    // Verify private answers and outbox wiped from shared device
    expect((await db.getAnswersForAttempt('att-student-shared')).length).toBe(0);
    expect((await db.getPendingOutboxItems()).length).toBe(0);
  });
});
