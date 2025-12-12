/**
 * Build version tracking
 * Generate a build number from git commit or timestamp
 */

const BUILD_NUMBER_KEY = 'app_build_number';
const LAST_UPDATE_KEY = 'app_last_update';

export function getBuildNumber(): string {
  let buildNumber = localStorage.getItem(BUILD_NUMBER_KEY);
  if (!buildNumber) {
    // Generate a new build number based on timestamp
    buildNumber = Math.floor(Date.now() / 1000).toString();
    localStorage.setItem(BUILD_NUMBER_KEY, buildNumber);
  }
  return buildNumber;
}

export function getLastUpdateTime(): number {
  const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
  return lastUpdate ? parseInt(lastUpdate, 10) : 0;
}

export function resetBuildNumber(): void {
  // Called on app update to reset build number
  const buildNumber = Math.floor(Date.now() / 1000).toString();
  localStorage.setItem(BUILD_NUMBER_KEY, buildNumber);
  localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleString();
}
