/**
 * Online/Offline Status Indicator
 */

import { useEffect, useState } from 'react';
import { Chip, Box } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudOffIcon from '@mui/icons-material/CloudOff';

export default function OnlineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      <Chip
        icon={isOnline ? <CloudIcon /> : <CloudOffIcon />}
        label={isOnline ? 'Online' : 'Offline'}
        color={isOnline ? 'success' : 'error'}
        variant="outlined"
        size="small"
        sx={{ fontWeight: 500 }}
      />
    </Box>
  );
}
