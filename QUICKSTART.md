# 🚀 Quick Start Guide

## Project Setup Complete ✅

Your CI Helper project is now fully set up as a PWA with the first module (Linear Interpolation) ready to use!

## What's Included

### ✨ Features Already Implemented

1. **Progressive Web App (PWA)**
   - Offline-first architecture
   - Service worker with auto-update
   - Installable on mobile and desktop
   - Works without network connection

2. **Modular Architecture**
   - Easy-to-extend module system
   - Each module is self-contained
   - Shared utilities and components for consistency

3. **Linear Interpolation Module**
   - Configure input/output ranges
   - Forward interpolation (input → output)
   - Reverse interpolation (output → input)
   - Data persists locally using localStorage
   - Validation and error handling

4. **Material-UI Design**
   - Professional, clean interface
   - Mobile-first responsive design
   - Consistent theming across the app
   - Accessible components

## 🏃 Getting Started

### 1. Start Development Server

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

### 2. Test the Linear Interpolation Module

1. Click the "Linear Interpolation" card on the home page
2. Set your input and output ranges:
   - Example: Input 0-100, Output 0-1000
3. Enter an input value and calculate
4. Try the reverse interpolation too
5. Close and reopen - your ranges are saved!

### 3. Test Offline Functionality

1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Check the "Offline" checkbox
4. The app continues to work!
5. Your data is still there when you go back online

## 📋 Key Files to Understand

### Core Application
- `src/App.tsx` - Main app with module router
- `src/main.tsx` - React entry point
- `vite.config.ts` - Vite and PWA configuration
- `index.html` - HTML template with PWA meta tags

### Module System
- `src/modules/linear-interpolation/` - Example module
  - `LinearInterpolation.tsx` - React component (UI)
  - `interpolation.ts` - Pure functions (logic)
  - `hooks.ts` - Custom hook (state management)
  - `index.ts` - Module metadata and export

### Shared Utilities
- `src/shared/types/module.ts` - Module interface
- `src/shared/utils/storage.ts` - localStorage wrapper
- `src/shared/components/ModuleHeader.tsx` - Reusable header

## 🧩 Adding Your Next Module

Quick reference (see ARCHITECTURE.md for detailed guide):

```bash
# 1. Create directory
mkdir src/modules/unit-converter

# 2. Create these files:
# - UnitConverter.tsx (React component)
# - converter.ts (pure calculation functions)
# - hooks.ts (custom hook with state)
# - index.ts (module metadata)

# 3. Register in App.tsx:
import { UnitConverterModule } from './modules/unit-converter';

const modules: ModuleRegistry = {
  [LinearInterpolationModule.id]: LinearInterpolationModule,
  [UnitConverterModule.id]: UnitConverterModule,  // Add here
};
```

## 💡 Pro Tips

### Development
```bash
npm run dev      # Start with hot reload
npm run build    # Production build
npm run lint     # Check code quality
npm run preview  # Test production build locally
```

### Module Development Pattern

```typescript
// 1. Pure Functions (no React)
export function calculate(input: number): number {
  return input * someFormula;
}

// 2. Custom Hook (state + logic)
export function useMyModule() {
  const [state, setState] = useState(() => 
    getFromStorage('my_module_key', defaultValue)
  );
  return { state, updateState };
}

// 3. React Component (UI only)
export default function MyModule({ onBack }) {
  const { state } = useMyModule();
  return <ModuleHeader title="..." onBack={onBack} />;
}

// 4. Module Metadata
export const MyModule: CIModule = {
  id: 'my-module',
  name: 'My Module',
  description: '...',
  icon: 'IconName',
  component: MyModuleComponent,
  category: 'calculation',
};
```

## 📱 Mobile Testing

### Browser DevTools
```
Chrome: F12 → Device Toolbar (Ctrl+Shift+M)
Firefox: Ctrl+Shift+M
Safari: Develop → Enter Responsive Design Mode
```

### On Actual Device
1. Build: `npm run build`
2. Preview: `npm run preview`
3. Share localhost over network
4. Visit from mobile phone
5. Install as app (+ button or menu)

## 🔧 TypeScript Tips

The project uses strict TypeScript for reliability:

```typescript
// ✅ DO: Use type imports
import type { CIModule } from './types/module';

// ❌ DON'T: Default imports for types
import { CIModule } from './types/module';
```

## 📦 Build Output

When you run `npm run build`, the output includes:

```
dist/
├── index.html          # PWA entry point
├── manifest.webmanifest # PWA metadata
├── sw.js              # Service worker
├── registerSW.js      # Service worker registration
└── assets/            # JS, CSS, images
```

This is ready to deploy to GitHub Pages or any static host!

## 🎯 Common Tasks

### Add a new module
1. Create folder under `src/modules/`
2. Implement module following the pattern
3. Register in `App.tsx`
4. Run `npm run build` to verify

### Change theme colors
Edit `App.tsx`:
```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#YourColor' },
    secondary: { main: '#YourColor' },
  },
});
```

### Deploy to GitHub Pages
1. Update `vite.config.ts`: `base: '/your-repo-name/'`
2. Run `npm run build`
3. Push `dist/` folder to GitHub Pages

## ❓ Troubleshooting

### Module not showing up
- Check module is registered in `App.tsx` `modules` object
- Verify export in `src/modules/[name]/index.ts`
- Run `npm run build` to check for TypeScript errors

### Offline not working
- Check DevTools → Application → Service Workers
- Make sure app is served over HTTPS (except localhost)
- Clear cache if needed

### Data not persisting
- Check `storage.ts` is being used correctly
- Use predefined `StorageKey` constants
- Check browser localStorage isn't disabled

### TypeScript errors
- Use `type` keyword for type imports
- Run `npm run lint` to see all issues
- Don't import React components as types

## 📚 Next Steps

1. ✅ Understand the project structure
2. ✅ Test Linear Interpolation module
3. ✅ Read ARCHITECTURE.md for detailed guidelines
4. 📝 Plan your next modules
5. 🏗️ Start building!

## 🎓 Learning Resources

- **React Hooks**: https://react.dev/reference/react
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Material-UI**: https://mui.com/
- **PWA**: https://web.dev/progressive-web-apps/
- **Vite**: https://vitejs.dev/

---

**You're all set! Happy building! 🚀**

Questions? Check ARCHITECTURE.md for detailed module development guidelines.
