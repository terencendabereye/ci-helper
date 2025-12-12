/**
 * Storage utilities for calculating size and clearing data
 */

export async function calculateStorageSize(): Promise<{ used: number; quota: number }> {
  if (!navigator.storage?.estimate) {
    return { used: 0, quota: 0 };
  }
  const estimate = await navigator.storage.estimate();
  return { used: estimate.usage || 0, quota: estimate.quota || 0 };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function clearAllStorage(): void {
  // Clear localStorage (keeping only essential app data)
  const essentialKeys = ['app_build_number', 'app_last_update', 'app_theme'];
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (!essentialKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  // Note: IndexedDB (used by PWA cache) should be cleared separately via cache API
}

export function clearAllData(): void {
  // Clear everything including essential data
  localStorage.clear();
  // Clear service worker cache
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => caches.delete(cacheName));
    });
  }
}
