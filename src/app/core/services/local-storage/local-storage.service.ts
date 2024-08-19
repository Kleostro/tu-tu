import { Injectable } from '@angular/core';

import STORE_KEYS from '../../constants/store';
import LocalStorageData from '../../models/store.model';
import { isLocalStorageData } from './helpers/helper';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storage: LocalStorageData = {};

  public getValueByKey(key: string): unknown {
    if (key in this.storage) {
      return JSON.parse(this.storage[key]);
    }
    return null;
  }

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

  public saveCurrentUser(email: string, token: string | null, name?: string): void {
    this.addValueByKey(STORE_KEYS.EMAIL, email);
    this.addValueByKey(STORE_KEYS.TOKEN, token);
    if (name) {
      this.addValueByKey(STORE_KEYS.NAME, name);
    }
  }

  public updateCurrentUser(email: string, name: string): void {
    this.addValueByKey(STORE_KEYS.EMAIL, email);
    this.addValueByKey(STORE_KEYS.NAME, name);
  }

  public init(): LocalStorageData {
    const storedData = localStorage.getItem(STORE_KEYS.LS_NAME);

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
