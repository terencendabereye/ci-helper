/**
 * Settings Page - About, Storage, Theme, Version Info
 */

import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getBuildNumber, formatDate, getLastUpdateTime } from '../utils/build';
import { calculateStorageSize, formatBytes, clearAllStorage, clearAllData } from '../utils/settings';

interface SettingsProps {
  onThemeChange?: (isDark: boolean) => void;
  onThemeColorChange?: (color: string) => void;
}

export default function Settings({ onThemeChange, onThemeColorChange }: SettingsProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageQuota, setStorageQuota] = useState(0);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [themeColor, setThemeColor] = useState(theme.palette.primary.main);

  useEffect(() => {
    calculateStorageSize().then(({ used, quota }) => {
      setStorageUsed(used);
      setStorageQuota(quota);
    });
  }, []);

  const handleThemeToggle = (checked: boolean) => {
    if (onThemeChange) onThemeChange(checked);
  };

  const handleThemeColorChange = (color: string) => {
    setThemeColor(color);
    if (onThemeColorChange) onThemeColorChange(color);
  };

  const handleForceUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => reg.unregister());
      });
      window.location.reload();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* About Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          📱 About App
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant="caption" color="textSecondary">App Version</Typography>
            <Typography variant="body2">v0.1.0</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Build Number</Typography>
            <Typography variant="body2">{getBuildNumber()}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Last Updated</Typography>
            <Typography variant="body2">{formatDate(getLastUpdateTime())}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">App Type</Typography>
            <Typography variant="body2">Progressive Web App</Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleForceUpdate}
            fullWidth
          >
            Force Update
          </Button>
        </Box>
      </Paper>

      {/* Storage Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          💾 Storage
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="textSecondary">Storage Used</Typography>
          <Typography variant="body2">
            {formatBytes(storageUsed)} / {formatBytes(storageQuota)}
          </Typography>
          <Box sx={{ width: '100%', height: 8, bgcolor: 'action.hover', borderRadius: 1, mt: 1, overflow: 'hidden' }}>
            <Box
              sx={{
                height: '100%',
                width: `${storageQuota ? (storageUsed / storageQuota) * 100 : 0}%`,
                bgcolor: 'primary.main',
                transition: 'width 0.3s',
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => setClearDialogOpen(true)}
          >
            Clear Cache
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => setClearAllDialogOpen(true)}
          >
            Clear All Data
          </Button>
        </Box>
      </Paper>

      {/* Appearance Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          🎨 Appearance
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={<Switch checked={isDark} onChange={(e) => handleThemeToggle(e.target.checked)} />}
            label={isDark ? 'Dark Mode' : 'Light Mode'}
          />
          <Box>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
              Theme Color
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['#4B0082', '#1976d2', '#d32f2f', '#f57c00', '#388e3c'].map(color => (
                <Box
                  key={color}
                  onClick={() => handleThemeColorChange(color)}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: color,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: themeColor === color ? '3px solid white' : 'none',
                    boxShadow: 2,
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Clear Cache Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear Cache?</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 2 }}>
            This will remove temporary data but keep your jobs and settings.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              clearAllStorage();
              setClearDialogOpen(false);
              window.location.reload();
            }}
            color="error"
            variant="contained"
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Dialog */}
      <Dialog open={clearAllDialogOpen} onClose={() => setClearAllDialogOpen(false)}>
        <DialogTitle>Clear All Data?</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mt: 2 }}>
            ⚠️ This will delete ALL your jobs, settings, and cached data. This cannot be undone!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearAllDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              clearAllData();
              setClearAllDialogOpen(false);
              setTimeout(() => window.location.reload(), 500);
            }}
            color="error"
            variant="contained"
          >
            Delete Everything
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
