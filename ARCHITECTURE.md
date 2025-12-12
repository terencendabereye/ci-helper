# CI Helper - Control & Instrumentation Calculator

A Progressive Web App (PWA) for field instrumentation and calibration work. Designed for offline use, mobile-first experience, and easy extensibility.

## 🎯 Project Goals

- ✅ **Offline-First**: Works completely offline without network connectivity
- ✅ **Mobile-First Design**: Optimized for mobile devices, responsive on desktop
- ✅ **Cross-Platform**: Works on iOS, Android, Windows, and web browsers
- ✅ **Easy Distribution**: Deploy via GitHub Pages, installable as PWA
- ✅ **Modular Architecture**: Easy to add new calculation modules

## 📱 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with PWA support

### Installation

```bash
# Install dependencies
npm install

# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🏗️ Project Architecture

```
src/
├── modules/                    # Feature modules (independent, reusable)
│   ├── linear-interpolation/  # First module - linear interpolation
│   │   ├── LinearInterpolation.tsx  # React component
│   │   ├── interpolation.ts         # Core logic (pure functions)
│   │   ├── hooks.ts                 # Custom hooks (state + logic)
│   │   ├── types.ts                 # Module-specific types
│   │   └── index.ts                 # Module export & metadata
│   └── [future-modules]/
├── shared/                     # Shared utilities and components
│   ├── components/            # Reusable UI components
│   │   └── ModuleHeader.tsx   # Consistent header for modules
│   ├── hooks/                 # Shared custom hooks
│   ├── utils/                 # Helper functions
│   │   └── storage.ts        # localStorage wrapper (offline data)
│   ├── types/                # Global TypeScript types
│   │   └── module.ts         # CIModule interface
│   └── ...
├── App.tsx                    # Main app with module router
├── main.tsx                   # React entry point
└── index.css                  # Global styles
```

## 🧩 Module System

### Creating a New Module

1. **Create module directory**:
   ```bash
   mkdir src/modules/your-module-name
   ```

2. **Create core logic** (`interpolation.ts` or similar):
   ```typescript
   // Pure functions with no React dependencies
   export function calculate(input: number): number {
     return input * 2;
   }
   ```

3. **Create custom hook** (`hooks.ts`):
   ```typescript
   import { useState } from 'react';
   import { getFromStorage, saveToStorage } from '../../shared/utils/storage';
   
   export function useMyModule() {
     const [state, setState] = useState(() => 
       getFromStorage('module_key', initialValue)
     );
     
     // ... module logic
     
     return { /* exposed state and functions */ };
   }
   ```

4. **Create React component** (`MyModule.tsx`):
   ```typescript
   import { useMyModule } from './hooks';
   import { ModuleHeader } from '../../shared/components/ModuleHeader';
   
   export default function MyModule({ onBack }) {
     const { /* state */ } = useMyModule();
     
     return (
       <>
         <ModuleHeader title="My Module" onBack={onBack} />
         {/* UI here */}
       </>
     );
   }
   ```

5. **Export module metadata** (`index.ts`):
   ```typescript
   import { CIModule } from '../../shared/types/module';
   import MyModuleComponent from './MyModule';
   import MyIcon from '@mui/icons-material/MyIcon';
   
   export const MyModule: CIModule = {
     id: 'my-module',
     name: 'My Module',
     description: 'What it does',
     icon: MyIcon.displayName || 'MyIcon',
     component: MyModuleComponent,
     category: 'calculation',
   };
   ```

6. **Register in App.tsx**:
   ```typescript
   import { MyModule } from './modules/my-module';
   
   const modules: ModuleRegistry = {
     [MyModule.id]: MyModule,
     // ... other modules
   };
   ```

## 💾 Offline Data Persistence

Use the `storage.ts` utility for localStorage with JSON serialization:

```typescript
import { getFromStorage, saveToStorage, StorageKey } from '../shared/utils/storage';

// Reading data
const savedData = getFromStorage('my_key', defaultValue);

// Saving data
saveToStorage('my_key', dataToSave);

// Use predefined keys
saveToStorage(StorageKey.MODULE_SETTINGS, settings);
```

## 🎨 Styling with Material-UI

The app uses Material-UI (MUI) v7 for consistent, professional styling. Customize the theme in `App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#4B0082' },
    secondary: { main: '#FF69B4' },
  },
});
```

Key MUI components for field work interfaces:
- `TextField` - input fields
- `Button` - actions
- `Paper` - content containers
- `Card` - module cards
- `AppBar` - headers
- `Container` - responsive layout

## 📦 PWA Configuration

The app is configured as a PWA with:
- Service worker for offline caching (Vite PWA plugin)
- Web manifest for app metadata
- Auto-update capability

Key files:
- `vite.config.ts` - PWA plugin configuration
- `public/` - PWA icons (add 192x192 and 512x512 PNGs)
- `index.html` - Meta tags for PWA

## 🚀 Deployment

### GitHub Pages

1. Update `vite.config.ts` for base path:
   ```typescript
   export default defineConfig({
     base: '/repo-name/',
     // ...
   });
   ```

2. Build and deploy:
   ```bash
   npm run build
   # Deploy dist/ to GitHub Pages
   ```

### Installation as App

Users can:
- **Mobile**: Add to home screen (prompts automatically)
- **Desktop**: Install as app (Chrome, Edge, etc.)
- Works offline once installed

## 📋 Code Style & TypeScript

- **Strict TypeScript**: Enabled for type safety
- **ESLint**: Run `npm run lint` to check code quality
- **Naming**: camelCase for functions/variables, PascalCase for components/types

## 🔍 Module Development Tips

### ✅ DO

- Keep modules independent - no cross-module imports
- Use custom hooks to separate logic from UI
- Store calculations as pure functions
- Test with localStorage directly
- Use TypeScript interfaces for module types
- Store user inputs in localStorage for persistence

### ❌ DON'T

- Don't couple modules together
- Don't mix business logic with React components
- Don't fetch from network (offline-first principle)
- Don't hardcode values - make them configurable
- Don't forget error handling and input validation

## 🧪 Testing Your Module

1. Add test inputs that represent real field scenarios
2. Verify calculations are mathematically correct
3. Test offline functionality:
   - Open DevTools → Application → Service Workers
   - Check "Offline" mode
   - Verify module still works and saves data
4. Test on actual mobile device if possible

## 📱 Mobile Optimization Tips

1. Use mobile-appropriate button sizes (tap targets ~44-48px)
2. Test with actual mobile viewport sizes
3. Keep forms simple with minimal scrolling
4. Use full-width inputs on mobile
5. Consider landscape orientation
6. Test performance on lower-end devices

## 🔐 Data Privacy

- All data stays on the user's device
- No cloud sync or network calls (unless explicitly added)
- Users have full control via browser DevTools
- Data persists across PWA updates

## 📚 Useful Resources

- [Material-UI Documentation](https://mui.com/)
- [React Hooks Guide](https://react.dev/reference/react)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [localStorage Guide](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎯 Next Steps

1. ✅ Linear Interpolation module (complete)
2. Add more calculation modules:
   - Pressure conversions
   - Temperature conversions
   - Unit conversions
   - Logarithmic calculations
   - Calibration curve fitting
3. Add data export/import features
4. Build calibration history tracking
5. Add measurement unit presets

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines]

---

**Built for underground work where connectivity is sparse and reliability is essential.** 🪨⚙️
