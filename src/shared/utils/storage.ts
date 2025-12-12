/**
 * Wrapper for localStorage with JSON serialization
 * Useful for offline data persistence
 */

export const StorageKey = {
  MODULE_SETTINGS: 'ci_helper_module_settings',
  USER_DATA: 'ci_helper_user_data',
  CALIBRATION_HISTORY: 'ci_helper_calibration_history',
} as const;

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to read from storage: ${key}`, error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to save to storage: ${key}`, error);
    return false;
  }
}

export function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove from storage: ${key}`, error);
    return false;
  }
}

export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.warn('Failed to clear storage', error);
    return false;
  }
}
