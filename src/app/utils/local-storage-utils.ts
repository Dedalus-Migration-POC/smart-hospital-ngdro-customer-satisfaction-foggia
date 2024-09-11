export enum LocalStorageKey {
  localeId = 'localeId',
}

export const LocalStorageUtils = {
  getItem: (key: LocalStorageKey): string | null => localStorage.getItem(key),
  setItem: (key: LocalStorageKey, value: string): void =>
    localStorage.setItem(key, value),
  removeItem: (key: LocalStorageKey): void => localStorage.removeItem(key),
}
