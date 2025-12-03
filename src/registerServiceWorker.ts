// Register service worker in production builds
if ('serviceWorker' in navigator) {
  // Vite exposes import.meta.env.PROD
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available; you may notify the user here.
              console.log('New content available; please refresh.');
            }
          });
        });
      }).catch(err => {
        console.error('Service worker registration failed:', err);
      });
    });
  }
}