# 📚 CI Helper Documentation Index

Welcome! Here's a map to all the documentation to help you get started and build awesome instrumentation modules.

## 🚀 **Start Here** (Choose Your Path)

### 👤 **I'm New - Just Want to Get Started**
→ Read: **[QUICKSTART.md](QUICKSTART.md)**
- How to run the dev server
- Test the linear interpolation module
- Basic how-to for next steps

### 🏗️ **I Want to Build a New Module**
→ Read: **[ARCHITECTURE.md](ARCHITECTURE.md)**
- Complete module development guide
- Step-by-step code examples
- Best practices and patterns
- Module registration walkthrough

### 🔧 **I'm Building Instrumentation Modules**
→ Read: **[INSTRUMENTATION_GUIDE.md](INSTRUMENTATION_GUIDE.md)**
- Common instrumentation modules
- Calculation patterns for sensors
- Real-world examples
- Measurement data structures

### 📖 **I Want a Full Project Overview**
→ Read: **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**
- What's been built
- Project structure
- Design decisions
- Key technologies

### 💻 **I'm a Developer - Show Me the Code**
→ Look at: **src/modules/linear-interpolation/**
- LinearInterpolation.tsx (UI component)
- interpolation.ts (pure logic)
- hooks.ts (state management)
- index.ts (module export)
- Follow this exact pattern for your modules

---

## 📑 All Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| **QUICKSTART.md** | Get started in 5 minutes | 10 min |
| **ARCHITECTURE.md** | Deep dive into design and patterns | 30 min |
| **INSTRUMENTATION_GUIDE.md** | Build sensor/instrument modules | 20 min |
| **PROJECT_SUMMARY.md** | Complete project overview | 15 min |
| **README.md** | General project info | 5 min |
| **This file** | Navigation and reference | 5 min |

---

## 🗺️ **Quick Navigation by Task**

### 🔌 Setup & Installation
```
1. npm install
2. npm run dev
3. Open http://localhost:5173
4. See QUICKSTART.md for details
```

### ➕ Build Your First Module
```
1. Read: ARCHITECTURE.md → "Creating a New Module"
2. Copy the linear-interpolation pattern
3. Implement your module
4. Register in App.tsx
5. Test with: npm run build
```

### 🔧 Build Instrumentation Modules
```
1. Read: INSTRUMENTATION_GUIDE.md
2. Choose module type (converter, calculator, etc.)
3. Follow template provided
4. Use patterns for your calculation type
5. Test with real sensor data
```

### 📦 Deploy to GitHub Pages
```
1. See ARCHITECTURE.md → "Deployment" section
2. Update vite.config.ts with base path
3. npm run build
4. Push to GitHub Pages
```

### 🐛 Troubleshoot Issues
```
1. Check QUICKSTART.md → "Troubleshooting"
2. Check ARCHITECTURE.md → "Best Practices"
3. Verify TypeScript: npm run lint
4. Check browser console: F12
```

---

## 🧩 **Module Development Quick Reference**

### File Structure for New Module
```
src/modules/your-module/
├── YourModule.tsx           ← React component (UI)
├── calculations.ts          ← Pure functions (logic)
├── hooks.ts                 ← Custom hook (state)
├── index.ts                 ← Module metadata & export
└── types.ts                 ← TypeScript types (optional)
```

### Three-Part Pattern
```typescript
// 1. LOGIC (pure functions, no React)
export function calculate(input) { return result; }

// 2. STATE (custom hook)
export function useMyModule() {
  const [state, setState] = useState(...);
  return { state, setState };
}

// 3. UI (React component)
export default function MyModule({ onBack }) {
  const { state } = useMyModule();
  return <ModuleHeader ... />;
}
```

### Register Module
```typescript
// In App.tsx
import { YourModule } from './modules/your-module';

const modules: ModuleRegistry = {
  [YourModule.id]: YourModule,
  // ... other modules
};
```

---

## 💡 **Common Questions**

### Q: How do I save data offline?
**A:** Use the `storage.ts` utility:
```typescript
import { getFromStorage, saveToStorage } from '../shared/utils/storage';

// Save
saveToStorage('my_key', dataToSave);

// Load
const data = getFromStorage('my_key', defaultValue);
```
See ARCHITECTURE.md → "Offline Data Persistence"

### Q: How do I add a new calculation module?
**A:** Follow the exact pattern in `src/modules/linear-interpolation/`
See ARCHITECTURE.md → "Creating a New Module" (step-by-step)

### Q: What modules should I build first?
**A:** Check INSTRUMENTATION_GUIDE.md → "Recommended Module Progression"
Suggestion: Pressure Converter next

### Q: Can I use this for iOS/Android?
**A:** Yes! PWA works on all modern phones.
- iPhone: Add to home screen (share → add to home screen)
- Android: Install app (three dots → install)

### Q: How do I deploy?
**A:** See ARCHITECTURE.md → "Deployment"
- Build: `npm run build`
- Deploy `dist/` folder to GitHub Pages
- Works online and offline automatically

### Q: How do I style components?
**A:** Use Material-UI (already set up)
```typescript
<Box sx={{ display: 'flex', gap: 2 }}>
  <Typography variant="h6">Title</Typography>
  <Button>Click Me</Button>
</Box>
```
See ARCHITECTURE.md → "Styling with Material-UI"

### Q: Can I add more fonts or custom CSS?
**A:** Yes, edit `src/index.css` for global styles
Or use Material-UI's `sx` prop for component-level styling

### Q: How do I test the app works offline?
**A:** See QUICKSTART.md → "Test Offline Functionality"
1. DevTools (F12)
2. Application → Service Workers
3. Check "Offline"
4. App still works!

---

## 🎯 **Development Roadmap Example**

Here's a suggested order for building modules:

### Week 1-2: Foundation
- ✅ Linear Interpolation (done!)
- Pressure Unit Converter

### Week 3-4: Core Tools
- Temperature Converter
- 4-20mA Signal Scaler
- Decibel Calculator

### Week 5-6: Sensor Specific
- RTD Temperature Calculator
- Thermocouple Converter
- Calibration Point Manager

### Week 7-8: Analysis & Export
- Measurement History
- Calibration Report
- CSV Export
- Data Import

---

## 🎓 **Learning Resources**

### React & TypeScript
- https://react.dev/ - Official React docs
- https://www.typescriptlang.org/docs/ - TypeScript handbook
- https://react.dev/reference/react/hooks - Hooks reference

### Material-UI (MUI)
- https://mui.com/ - Component library
- https://mui.com/api/ - Component API reference
- https://mui.com/material-ui/guides/ - Guides and patterns

### Web Technologies
- https://web.dev/progressive-web-apps/ - PWA guide
- https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage - localStorage API
- https://vitejs.dev/ - Vite build tool

### Instrumentation & Sensors
- NIST Special Publication 330 (SI units)
- NIST Special Publication 811 (Unit conversion)
- GUM (Uncertainty guide)
- Sensor manufacturer datasheets

---

## 🚀 **Next Steps**

### Right Now
1. ✅ Run: `npm run dev`
2. ✅ Visit: http://localhost:5173
3. ✅ Try the Linear Interpolation module

### Today
1. ✅ Read QUICKSTART.md (10 min)
2. ✅ Read ARCHITECTURE.md (30 min)
3. ✅ Study linear-interpolation module code (15 min)

### This Week
1. ✅ Plan your first new module
2. ✅ Read INSTRUMENTATION_GUIDE.md
3. ✅ Start implementing next module

### This Month
1. ✅ Build 2-3 modules
2. ✅ Test offline functionality
3. ✅ Deploy to GitHub Pages
4. ✅ Share with team

---

## 📞 **Quick Command Reference**

```bash
# Development
npm run dev       # Start dev server with hot reload

# Building
npm run build     # Production build
npm run preview   # Test production build locally

# Quality
npm run lint      # Check code quality

# Installation
npm install       # Install dependencies (first time)
npm update        # Update dependencies
```

---

## 🎨 **File Organization Reminder**

```
ci-helper/
├── src/
│   ├── modules/           ← Your calculation modules go here
│   ├── shared/            ← Reusable utilities and components
│   ├── App.tsx            ← Main app (register modules here)
│   └── ...
├── public/                ← Static assets
├── dist/                  ← Build output (generated)
├── [Documentation]        ← You are here!
└── package.json
```

---

## ✨ **You're All Set!**

You now have:
- ✅ A complete PWA template
- ✅ A working calculation module
- ✅ Offline data persistence
- ✅ Mobile-first design
- ✅ Comprehensive documentation
- ✅ Clear patterns to follow

### Choose Your Next Step:

**Fastest to results:**
```
Read QUICKSTART.md (5 min)
→ Run npm run dev
→ Test the app
→ You're done!
```

**Ready to build:**
```
Read ARCHITECTURE.md (30 min)
→ Plan next module
→ Copy linear-interpolation pattern
→ Start coding!
```

**Building for instruments:**
```
Read INSTRUMENTATION_GUIDE.md (20 min)
→ Pick a module type
→ Use calculation patterns
→ Build with confidence!
```

---

**Happy building! You're creating tools that matter.** 🔧⚙️📊

*Last updated: December 2025*
*Project: CI Helper - Control & Instrumentation Calculator*
