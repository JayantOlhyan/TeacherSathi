export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl = 'https://teachersathi.in') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  async request<T = unknown>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
      body?: unknown;
      headers?: Record<string, string>;
      idempotencyKey?: string;
      timeoutMs?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const method = options.method || 'GET';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (options.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeout = setTimeout(() => controller?.abort(), options.timeoutMs || 15000);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller?.signal,
      });

      clearTimeout(timeout);

      const status = response.status;
      let json: unknown = null;
      try {
        json = await response.json();
      } catch {
        json = null;
      }

      if (!response.ok) {
        const errorMsg =
          (json as { error?: string })?.error ||
          (json as { message?: string })?.message ||
          `HTTP Error ${status}`;
        return { ok: false, status, error: errorMsg };
      }

      const data = (json as { data?: T })?.data ?? (json as T);
      return { ok: true, status, data };
    } catch (err: unknown) {
      clearTimeout(timeout);
      const isAbort = (err as { name?: string })?.name === 'AbortError';
      const message = isAbort ? 'Network request timed out' : (err instanceof Error ? err.message : 'Network error');
      return { ok: false, status: 0, error: message };
    }
  }

  get<T = unknown>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  post<T = unknown>(endpoint: string, body?: unknown, idempotencyKey?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, idempotencyKey });
  }

  patch<T = unknown>(endpoint: string, body?: unknown, idempotencyKey?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, idempotencyKey });
  }

  delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
