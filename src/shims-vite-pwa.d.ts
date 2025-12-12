declare module 'virtual:pwa-register' {
  export function registerSW(opts?: {
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }): (reloadPage?: boolean) => Promise<void> | void;
  export default registerSW;
}
