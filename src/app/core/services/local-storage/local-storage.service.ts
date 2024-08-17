import { Injectable, signal } from '@angular/core';

import STORE_KEYS from '../../constants/store';
import LocalStorageData from '../../models/store.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storage: LocalStorageData = {};

  public isLoggedIn$$ = signal(this.isTokenInLocalStorage());
  // TBD: uncomment when we have users logged in
  // public isAdmin$$ = signal(this.isAdminInLocalStorage());

  public getValueByKey(key: string): unknown {
    if (key in this.storage) {
      const data = this.storage[key];
      const result: unknown = JSON.parse(data);
      return result;
    }
    return null;
  }

  public isTokenInLocalStorage(): boolean {
    return STORE_KEYS.TOKEN in this.storage;
  }

  // TBD: uncomment when we have users logged in
  // public isAdminInLocalStorage(): boolean {
  //   return 'email' in this.storage && ADMIN_CREDENTIALS.email === this.storage['email'];
  // }

  public addValueByKey(key: string, value: unknown): void {
    this.storage[key] = JSON.stringify(value);
    this.save(this.storage);
  }

  public removeValueByKey(key: string): void {
    delete this.storage[key];
    this.save(this.storage);
  }

  public clear(): void {
    localStorage.clear();
    this.init();
  }

  public save(data: LocalStorageData): void {
    localStorage.setItem(STORE_KEYS.LS_NAME, JSON.stringify(data));
    this.storage = this.init();
  }

  public init(): LocalStorageData {
    const storedData = localStorage.getItem(STORE_KEYS.LS_NAME);

    const isLocalStorageData = (data: unknown): data is LocalStorageData => {
      if (typeof data === 'object' && data !== null) {
        return true;
      }
      return false;
    };

    if (storedData) {
      const parsedData: unknown = JSON.parse(storedData);
      if (isLocalStorageData(parsedData)) {
        this.storage = parsedData;
      }
    } else {
      localStorage.setItem(STORE_KEYS.LS_NAME, '{}');
      this.storage = this.init();
    }

    return this.storage;
  }
}
