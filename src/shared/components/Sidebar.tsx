// React import not required with new JSX transform
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FunctionsIcon from '@mui/icons-material/Functions';
import type { ModuleRegistry } from '../types/module';

interface SidebarProps {
  open: boolean;
  variant: 'permanent' | 'temporary';
  onClose: () => void;
  modules: ModuleRegistry;
  onSelectModule: (id: string) => void;
}

export default function Sidebar({ open, variant, onClose, modules, onSelectModule }: SidebarProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant={variant}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flex: 1 }}>
          CI Helper
        </Typography>
        {variant === 'temporary' && (
          <IconButton onClick={onClose} size="small">
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {Object.values(modules).map((m) => (
            <ListItemButton key={m.id} onClick={() => { onSelectModule(m.id); if (variant === 'temporary') onClose(); }}>
              <ListItemIcon>
                {m.icon === 'Functions' ? <FunctionsIcon /> : <FunctionsIcon />}
              </ListItemIcon>
              <ListItemText primary={m.name} secondary={m.category} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Modular platform — add modules under `src/modules`.
        </Typography>
      </Box>
    </Drawer>
  );
}
