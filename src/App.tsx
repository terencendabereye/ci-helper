import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  CardActionArea,
  ThemeProvider,
  createTheme,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';
import './App.css';
import UpdateNotifier from './shared/components/UpdateNotifier';
import OnlineIndicator from './shared/components/OnlineIndicator';
import Sidebar from './shared/components/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

// Import modules
import { LinearInterpolationModule } from './modules/linear-interpolation';
import { PressureGaugeCalibrationModule } from './modules/pressure-gauge-calibration';
import type { ModuleRegistry } from './shared/types/module';

// Module registry - add new modules here
const modules: ModuleRegistry = {
  [LinearInterpolationModule.id]: LinearInterpolationModule,
  [PressureGaugeCalibrationModule.id]: PressureGaugeCalibrationModule,
};

// Create theme (can be customized)
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4B0082', // dark purple
    },
    secondary: {
      main: '#FF69B4', // hot pink
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#cfcfcf'
    }
  },
});

interface AppState {
  view: 'home' | 'module';
  activeModuleId?: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>({ view: 'home' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const themeHook = useTheme();
  const isDesktop = useMediaQuery(themeHook.breakpoints.up('md'));

  const handleModuleSelect = (moduleId: string) => {
    setAppState({ view: 'module', activeModuleId: moduleId });
  };

  const handleBackToHome = () => {
    setAppState({ view: 'home' });
  };

  if (appState.view === 'module' && appState.activeModuleId) {
    const module = modules[appState.activeModuleId];
    if (!module) {
      return <Typography>Module not found</Typography>;
    }

    const ModuleComponent = module.component;
    return (
      <ThemeProvider theme={theme}>
        <ModuleComponent onBack={handleBackToHome} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <UpdateNotifier />
      <OnlineIndicator />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          open={isDesktop ? true : drawerOpen}
          variant={isDesktop ? 'permanent' : 'temporary'}
          onClose={() => setDrawerOpen(false)}
          modules={modules}
          onSelectModule={(id: string) => setAppState({ view: 'module', activeModuleId: id })}
        />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            {!isDesktop && (
              <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              CI Helper
            </Typography>
            <Typography variant="caption">v0.1.0</Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Control & Instrumentation Helper
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Select a module to begin. This app works offline and data is saved locally on your device.
            </Typography>
          </Box>

          {/* Module Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {Object.values(modules).map((module) => (
              <Card
                key={module.id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleModuleSelect(module.id)}
                  sx={{ flex: 1 }}
                >
                  <CardContent sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ fontSize: 48, mb: 2 }}>
                      {module.icon === 'Functions' && <FunctionsIcon sx={{ fontSize: 48 }} />}
                    </Box>
                    <Typography gutterBottom variant="h6" component="div">
                      {module.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {module.description}
                    </Typography>
                    {module.category && (
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          display: 'inline-block',
                          bgcolor: 'primary.light',
                          color: 'primary.dark',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        {module.category}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>

          {/* Info Section */}
          <Box sx={{ mt: 6, p: 3, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              ℹ️ About CI Helper
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              • <strong>Online-First:</strong> Always fetches the latest data. Falls back to local cache if offline.
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              • <strong>Local Storage:</strong> All your calibration data is stored locally on your device.
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              • <strong>Modular Design:</strong> Easy to add new calculation modules in the future.
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              • <strong>Mobile Friendly:</strong> Designed for mobile devices but works great on desktop too.
            </Typography>
            <Typography variant="body2">
              • <strong>Progressive Web App:</strong> Can be installed as an app on your device.
            </Typography>
          </Box>
        </Container>

        {/* Footer */}
        <Box component="footer" sx={{ py: 3, textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="caption" color="textSecondary">
            CI Helper • Built for underground work • v0.1.0
          </Typography>
        </Box>
      </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
