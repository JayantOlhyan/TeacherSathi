import { NetworkConnectivityStatus } from '../types';

export type NetworkStatusListener = (status: NetworkConnectivityStatus) => void;

export class NetworkMonitor {
  private currentStatus: NetworkConnectivityStatus = 'ONLINE';
  private listeners: Set<NetworkStatusListener> = new Set();
  private isSimulated = false;

  constructor() {
    // In React Native runtime, this will integrate NetInfo.
    // In Node.js / headless runtime, defaults to ONLINE with simulation support.
  }

  getStatus(): NetworkConnectivityStatus {
    return this.currentStatus;
  }

  getCurrentStatus(): { status: NetworkConnectivityStatus } {
    return { status: this.currentStatus };
  }

  isOnline(): boolean {
    return this.currentStatus === 'ONLINE' || this.currentStatus === 'SYNCING';
  }

  setStatus(status: NetworkConnectivityStatus): void {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.notifyListeners();
    }
  }

  /**
   * For testing, offline mode toggling, and network throttling simulation.
   */
  setSimulatedOffline(offline: boolean): void {
    this.isSimulated = true;
    this.setStatus(offline ? 'OFFLINE' : 'ONLINE');
  }

  addListener(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    // Immediately notify current status
    listener(this.currentStatus);
    return () => this.removeListener(listener);
  }

  subscribe(listener: (state: { status: NetworkConnectivityStatus }) => void): () => void {
    const wrapped: NetworkStatusListener = (status) => listener({ status });
    this.listeners.add(wrapped);
    listener({ status: this.currentStatus });
    return () => this.removeListener(wrapped);
  }

  removeListener(listener: NetworkStatusListener): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentStatus);
      } catch {
        // Suppress listener error
      }
    });
  }
}

export const networkMonitor = new NetworkMonitor();
