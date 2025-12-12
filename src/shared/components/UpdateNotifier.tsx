import { useEffect, useState } from 'react';
import { Snackbar, Button, Alert } from '@mui/material';
import { registerSW } from 'virtual:pwa-register';

export default function UpdateNotifier() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [registration, setRegistration] = useState<any>(null);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      }
    });
    // save the update function so we can call it when user accepts
    setRegistration(() => updateSW);
  }, []);

  const handleRefresh = async () => {
    if (registration) {
      try {
        await registration(true);
      } catch (e) {
        console.error('Failed to apply update', e);
      }
    }
  };

  return (
    <>
      <Snackbar open={offlineReady} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info">App ready to work offline</Alert>
      </Snackbar>

      <Snackbar open={needRefresh} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Refresh
            </Button>
          }
          severity="info"
        >
          A new version is available
        </Alert>
      </Snackbar>
    </>
  );
}
