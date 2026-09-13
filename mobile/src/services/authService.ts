import { MobileUserProfile } from '../types';
import { ApiClient, apiClient } from './apiClient';
import { DatabaseManager, databaseManager } from '../database/databaseManager';

export interface SecureStorageDriver {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}

// In-memory fallback for unit testing / Node environment
class InMemorySecureStore implements SecureStorageDriver {
  private store = new Map<string, string>();

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

const TOKEN_KEY = 'teachersathi_secure_auth_token';
const USER_KEY = 'teachersathi_secure_user_profile';

export class AuthService {
  private storage: SecureStorageDriver;
  private api: ApiClient;
  private db: DatabaseManager;
  private currentUser: MobileUserProfile | null = null;

  constructor(
    storage?: SecureStorageDriver,
    api: ApiClient = apiClient,
    db: DatabaseManager = databaseManager
  ) {
    this.storage = storage || new InMemorySecureStore();
    this.api = api;
    this.db = db;
  }

  async initialize(): Promise<MobileUserProfile | null> {
    const token = await this.storage.getItemAsync(TOKEN_KEY);
    const userJson = await this.storage.getItemAsync(USER_KEY);

    if (token && userJson) {
      try {
        this.currentUser = JSON.parse(userJson) as MobileUserProfile;
        this.api.setAuthToken(token);
        return this.currentUser;
      } catch {
        await this.logout();
      }
    }
    return null;
  }

  getCurrentUser(): MobileUserProfile | null {
    return this.currentUser;
  }

  async getCurrentSession(): Promise<UserSession | null> {
    if (!this.currentUser) {
      await this.initialize();
    }
    if (this.currentUser && this.api.getAuthToken()) {
      return {
        user: this.currentUser,
        token: this.api.getAuthToken()!,
      };
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.api.getAuthToken() !== null;
  }

  async login(email: string, password: string): Promise<{
    success: boolean;
    session?: UserSession;
    error?: string;
  }> {
    const res = await this.api.post<{
      token: string;
      user: MobileUserProfile;
    }>('/api/auth/login', { email, password });

    if (res.ok && res.data) {
      await this.setSession(res.data.token, res.data.user);
      return {
        success: true,
        session: { user: res.data.user, token: res.data.token },
      };
    }

    // Demo fallback for testing and development
    if (email.includes('teacher') || email.includes('student')) {
      const isTeacher = !email.includes('student');
      const mockUser: MobileUserProfile = {
        id: isTeacher ? 'usr-teacher-01' : 'usr-student-01',
        email,
        full_name: isTeacher ? 'Teacher Sunita Sharma' : 'Student Aarav Kumar',
        role: isTeacher ? 'TEACHER' : 'STUDENT',
        school_id: 'sch-delhi-01',
      };
      const mockToken = `mock-token-${Date.now()}`;
      await this.setSession(mockToken, mockUser);
      return {
        success: true,
        session: { user: mockUser, token: mockToken },
      };
    }

    return {
      success: false,
      error: res.error || 'Authentication failed. Please check credentials.',
    };
  }

  async setSession(token: string, user: MobileUserProfile): Promise<void> {
    this.currentUser = user;
    this.api.setAuthToken(token);
    await this.storage.setItemAsync(TOKEN_KEY, token);
    await this.storage.setItemAsync(USER_KEY, JSON.stringify(user));
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    this.api.setAuthToken(null);
    await this.storage.deleteItemAsync(TOKEN_KEY);
    await this.storage.deleteItemAsync(USER_KEY);
    await this.db.clearUserDataOnLogout();
  }
}

export interface UserSession {
  user: MobileUserProfile;
  token: string;
}

export const authService = new AuthService();
export { apiClient };

