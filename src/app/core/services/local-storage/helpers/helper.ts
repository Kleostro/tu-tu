import LocalStorageData from '@/app/core/models/store.model';

export const isLocalStorageData = (data: unknown): data is LocalStorageData =>
  typeof data === 'object' && data !== null;
