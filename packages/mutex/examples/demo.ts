import { Mutex } from '../src/index.js';

class TokenStore {
  private token?: string;
  private readonly mutex = new Mutex(void 0);

  public async getToken(): Promise<string> {
    console.log('Requesting token');
    await using lock = this.mutex.lock();
    await lock; // Wait for the lock to be acquired
    if (this.token) {
      console.log('Reusing existing token', this.token);
      return this.token;
    }
    const token = await new Promise<string>((resolve) => {
      queueMicrotask(() => {
        resolve('token-123');
      });
    });
    console.log('Fetched new token', token);
    this.token = token; // Update the shared token
    return token;
  }
}

const store = new TokenStore();

store.getToken();
store.getToken();
store.getToken();
