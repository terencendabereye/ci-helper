import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ModuleHeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function ModuleHeader({ title, onBack, actions }: ModuleHeaderProps) {
  return (
    <AppBar position="static">
      <Toolbar>
        {onBack && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {actions && <Box>{actions}</Box>}
      </Toolbar>
    </AppBar>
  );
}
