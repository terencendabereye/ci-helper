# 🌐 Network-First PWA Strategy Guide

## What Changed

Your CI Helper PWA has been updated from **offline-first** to **network-first** strategy. This means:

### Network-First Flow
```
1. User requests a resource
   ↓
2. App tries to fetch from NETWORK (latest version)
   ├─ If online and successful → Cache it + Use it
   └─ If offline or fails → Use cached version
   ↓
3. Falls back to CACHE if network unavailable
```

### Benefits
- ✅ **Always gets latest content** when online
- ✅ **Still works offline** with cached data
- ✅ **Automatic updates** whenever connection available
- ✅ **Better for production** where updates matter

---

## Configuration Explained

### vite.config.ts - Workbox Settings

```typescript
workbox: {
  runtimeCaching: [
    {
      // Match assets (JS, CSS, images, fonts, etc.)
      urlPattern: /^https:\/\/.*\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/,
      
      // Strategy: Try network first, fall back to cache
      handler: 'NetworkFirst',
      
      options: {
        cacheName: 'assets-cache',
        expiration: {
          maxEntries: 60,           // Keep max 60 items
          maxAgeSeconds: 30 * 24 * 60 * 60, // Keep 30 days
        },
      },
    },
    {
      // Match API calls (update this with your API domain)
      urlPattern: /^https:\/\/api\.example\.com\/.*/i,
      handler: 'NetworkFirst',
      
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // Only cache API responses for 5 min
        },
      },
    },
  ],
  
  // Immediately activate new service worker
  skipWaiting: true,
  
  // New service worker takes over all clients immediately
  clientsClaim: true,
}
```

---

## How It Works for Your App

### Scenario 1: Online with Updates Available
```
1. User opens app
2. Service worker fetches latest version from network
3. Caches new version
4. Shows latest content to user
5. ✅ User always sees newest features
```

### Scenario 2: Goes Offline
```
1. User is working (online)
2. Internet disconnects
3. Service worker tries network → fails
4. Falls back to cached version
5. App continues working with last known data
6. ✅ No interruption to user experience
```

### Scenario 3: Low/Spotty Connectivity
```
1. Network is slow
2. Service worker attempts network request
3. If timeout → uses cache immediately
4. When connection improves → caches new version
5. ✅ Better UX with fallback
```

---

## Customizing for Your Needs

### Update API URL

Find this line in `vite.config.ts`:
```typescript
urlPattern: /^https:\/\/api\.example\.com\/.*/i,
```

Change it to your actual API domain:
```typescript
// Example: Your backend API
urlPattern: /^https:\/\/api\.myapp\.com\/.*/i,

// Or multiple APIs
urlPattern: /^https:\/\/(api\.myapp\.com|data\.myapp\.com)\/.*/i,
```

### Adjust Cache Expiration

For assets that change frequently:
```typescript
{
  urlPattern: /^https:\/\/.*\.js$/, // Only JS files
  handler: 'NetworkFirst',
  options: {
    cacheName: 'js-cache',
    expiration: {
      maxEntries: 20,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    },
  },
}
```

For API data that needs constant updates:
```typescript
{
  urlPattern: /^https:\/\/api\.myapp\.com\/data\/.*/i,
  handler: 'NetworkFirst',
  options: {
    cacheName: 'live-data',
    expiration: {
      maxEntries: 30,
      maxAgeSeconds: 1 * 60, // Only 1 minute
    },
  },
}
```

### Add More Strategies

You can have different strategies for different resources:

```typescript
runtimeCaching: [
  // Dynamic content: Network first (try network)
  {
    urlPattern: /^https:\/\/api\.myapp\.com\/.*/,
    handler: 'NetworkFirst',
    options: { cacheName: 'api-cache' },
  },
  
  // Static assets: Cache first (use cache, update in background)
  {
    urlPattern: /^https:\/\/cdn\.example\.com\/.*/,
    handler: 'CacheFirst',
    options: { cacheName: 'cdn-cache' },
  },
  
  // Images: Stale while revalidate (use cache, update in background)
  {
    urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
    handler: 'StaleWhileRevalidate',
    options: { cacheName: 'images' },
  },
]
```

---

## Available Cache Strategies

### 1. **NetworkFirst** (Current Choice)
Best for: API data, app shell, dynamic content
```
Try network → Fall back to cache
```

### 2. **CacheFirst**
Best for: Static assets, CDN content
```
Use cache → Fall back to network
```

### 3. **StaleWhileRevalidate**
Best for: Images, non-critical updates
```
Use cache immediately → Update in background
```

---

## Testing Network-First Behavior

### Test 1: Verify It Works Online
```
1. npm run dev
2. Open http://localhost:5173
3. DevTools → Network tab
4. See requests going to network
5. Open DevTools → Application → Service Workers
6. Verify service worker is active
```

### Test 2: Test Offline Fallback
```
1. App running on localhost
2. DevTools → Application → Service Workers
3. Check "Offline" checkbox
4. Refresh page or navigate
5. App should still work with cached data
6. Check cache in: Application → Cache Storage
```

### Test 3: Verify Cache Invalidation
```
1. Make a code change
2. npm run build
3. Deploy (or test locally)
4. Open app in new incognito window
5. Service worker fetches new version
6. Cache updated with new assets
```

---

## Automatic Updates

With your current settings:

### When Service Worker Updates
```typescript
skipWaiting: true,    // Don't wait for all clients to unload
clientsClaim: true,   // Take over existing clients immediately
```

**Effect:**
- New service worker activates immediately
- Next page load gets fresh version
- No waiting for user to close all tabs
- Updates available on next refresh

### User Experience
```
1. User has app open
2. New version deployed
3. Service worker detects update
4. Next time user refreshes → gets latest
5. Or just wait a bit → automatic in background
```

---

## Important Notes for GitHub Pages Deployment

If using GitHub Pages with custom domain:

```typescript
// In vite.config.ts, update base if needed:
export default defineConfig({
  base: '/repo-name/', // Only if on GitHub Pages subpath
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // ... rest of PWA config
    })
  ]
});
```

---

## Monitoring Caches

### In Browser DevTools
```
F12 → Application → Cache Storage
├── assets-cache
│   ├── https://myapp.com/app.js
│   ├── https://myapp.com/style.css
│   └── ... more assets
├── api-cache
│   ├── https://api.myapp.com/data
│   └── ... more API responses
└── Other caches
```

### Clear Cache When Needed
```javascript
// In browser console
await caches.delete('assets-cache');
await caches.delete('api-cache');
// Then refresh
```

---

## Troubleshooting

### "App not updating"
1. Check DevTools → Application → Service Workers
2. Verify new version is registered
3. Try hard refresh: Ctrl+Shift+R
4. Clear cache manually if needed

### "Getting stale data"
1. Check cache expiration times (too long?)
2. Reduce `maxAgeSeconds` for that resource
3. Verify API URL pattern is correct

### "Offline not working"
1. Check DevTools → Application → Cache Storage
2. Verify resources are cached
3. Check DevTools → Service Workers active
4. May need to visit page once while online first

### "Can't update after deployment"
1. Verify service worker file (dist/sw.js) deployed
2. Check service worker has no errors
3. May need to delete old service worker registration
4. Users can manually clear cache in storage

---

## Best Practices

✅ **DO**
- Set appropriate `maxAgeSeconds` per resource type
- Update API URL patterns for your actual APIs
- Test offline mode before deploying
- Monitor bundle size with caches
- Document your cache strategy

❌ **DON'T**
- Cache authentication tokens indefinitely
- Cache sensitive user data without encryption
- Use same cache for all resources
- Set cache expiration too long
- Forget to test offline mode

---

## Example: Add New API Endpoint

When you add a new API, update the cache config:

```typescript
// In vite.config.ts
runtimeCaching: [
  // ... existing rules
  
  // Add new API endpoint
  {
    urlPattern: /^https:\/\/api\.myapp\.com\/sensors\/.*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'sensor-data',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 10 * 60, // 10 minutes
      },
    },
  },
],
```

Then rebuild:
```bash
npm run build
```

---

## Summary

Your app now uses **network-first** strategy:
- ✅ Gets updates when online
- ✅ Works offline with cached data  
- ✅ Automatically updates on next connection
- ✅ Perfect for field instruments that need fresh data

This is ideal for:
- Instrumentation tools that need latest calculations
- Apps deployed to GitHub Pages
- Professional field tools that require updates
- Users with intermittent connectivity

Happy deploying! 🚀
