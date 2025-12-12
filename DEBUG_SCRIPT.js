// 🔍 DEBUGGING SCRIPT - Run in Browser Console
// Visit: https://terencendabereye.github.io/ci-helper/
// Open: DevTools (F12)
// Paste this entire script and press Enter

console.log('🔍 CI Helper Diagnostics...\n');

// 1. Check service worker
console.log('1️⃣  SERVICE WORKER STATUS:');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log(`   Found ${registrations.length} service worker(s)`);
    registrations.forEach((reg, i) => {
      console.log(`   SW ${i}: ${reg.scope}`);
      console.log(`   - Active: ${reg.active ? 'Yes' : 'No'}`);
      console.log(`   - Installing: ${reg.installing ? 'Yes' : 'No'}`);
      console.log(`   - Waiting: ${reg.waiting ? 'Yes' : 'No'}`);
    });
  });
} else {
  console.log('   ❌ Service Workers NOT supported');
}

// 2. Check cache storage
console.log('\n2️⃣  CACHE STORAGE:');
if ('caches' in window) {
  caches.keys().then(names => {
    console.log(`   Found ${names.length} cache(s): ${names.join(', ')}`);
  });
} else {
  console.log('   ❌ Cache Storage NOT supported');
}

// 3. Check manifest
console.log('\n3️⃣  MANIFEST:');
fetch('https://terencendabereye.github.io/ci-helper/manifest.webmanifest')
  .then(r => r.json())
  .then(manifest => console.log('   ✅ Manifest loads:', manifest.name))
  .catch(e => console.log('   ❌ Manifest error:', e.message));

// 4. Check main JS file
console.log('\n4️⃣  MAIN JS FILE:');
fetch('https://terencendabereye.github.io/ci-helper/assets/index-BaUNcPd3.js', { method: 'HEAD' })
  .then(r => {
    if (r.ok) {
      console.log(`   ✅ JS file found (${r.headers.get('content-length')} bytes)`);
    } else {
      console.log(`   ❌ JS file error: ${r.status}`);
    }
  })
  .catch(e => console.log('   ❌ JS fetch error:', e.message));

// 5. Check CSS file
console.log('\n5️⃣  CSS FILE:');
fetch('https://terencendabereye.github.io/ci-helper/assets/index-COcDBgFa.css', { method: 'HEAD' })
  .then(r => {
    if (r.ok) {
      console.log(`   ✅ CSS file found (${r.headers.get('content-length')} bytes)`);
    } else {
      console.log(`   ❌ CSS file error: ${r.status}`);
    }
  })
  .catch(e => console.log('   ❌ CSS fetch error:', e.message));

// 6. Check React app root
console.log('\n6️⃣  REACT APP ROOT:');
const root = document.getElementById('root');
console.log(`   Root element: ${root ? '✅ Found' : '❌ Missing'}`);
console.log(`   Root has children: ${root && root.children.length > 0 ? '✅ Yes' : '❌ No'}`);

// 7. Check for console errors
console.log('\n7️⃣  CONSOLE ERRORS:');
console.log('   (Check above for any red errors)');

// 8. Suggested fixes
console.log('\n🔧 SUGGESTED FIXES:');
console.log(`
Option 1: Clear Service Worker Cache
  - Go to DevTools → Application → Service Workers
  - Click "Unregister" on all service workers
  - Then refresh the page

Option 2: Clear All Caches
  - Go to DevTools → Application → Cache Storage
  - Right-click each cache → Delete
  - Then refresh the page

Option 3: Hard Refresh
  - Ctrl+Shift+R (Windows/Linux)
  - Cmd+Shift+R (Mac)
  - This clears browser cache for this page

Option 4: Incognito Window
  - Open in new incognito/private window
  - No cache = fresh load
  - Good way to test if it's a cache issue
`);

console.log('\n✅ Diagnostics complete. Check results above.');
