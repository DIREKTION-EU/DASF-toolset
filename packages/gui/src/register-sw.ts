/**
 * Service Worker Registration
 *
 * Handles registration, updates, and offline support for the PWA.
 */

// Track service worker registration
let swRegistration: ServiceWorkerRegistration | null = null;

// DOM elements for update UI
let updateBanner: HTMLElement | null = null;

/**
 * Register the service worker
 */
export async function registerServiceWorker() {
  // Skip service worker in development - HMR needs fresh fetches
  if (import.meta.env.DEV) {
    console.log('[SW] Service worker disabled in development mode');
    return;
  }

  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported in this browser');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw-precache.js', {
      type: 'module',
    });

    swRegistration = registration;
    console.log('[SW] Service worker registered with scope:', registration.scope);

    // Check for updates after active
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('[SW] Installing new service worker...');

      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available, notify user
          console.log('[SW] New service worker available');
          showUpdateBanner();
        }
      });
    });

    // Auto-update on next load
    if (registration.active && registration.waiting) {
      console.log('[SW] Service worker already installed, ready to update');
    }
  } catch (error) {
    console.error('[SW] Service worker registration failed:', error);
  }
}

/**
 * Show a banner when a new version is available
 */
function showUpdateBanner() {
  // Create update banner if not exists
  if (!updateBanner) {
    updateBanner = document.createElement('div');
    updateBanner.id = 'pwa-update-banner';
    updateBanner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #1976d2;
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      z-index: 9999;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const message = document.createElement('span');
    message.textContent = 'New version available';
    message.style.flex = '1';

    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update Now';
    updateBtn.style.cssText = `
      background: white;
      color: #1976d2;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    `;
    updateBtn.addEventListener('click', () => {
      forceUpdate();
    });

    const dismissBtn = document.createElement('button');
    dismissBtn.textContent = 'Later';
    dismissBtn.style.cssText = `
      background: transparent;
      color: white;
      border: 1px solid rgba(255,255,255,0.5);
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    `;
    dismissBtn.addEventListener('click', () => {
      updateBanner?.remove();
      updateBanner = null;
    });

    updateBanner.appendChild(message);
    updateBanner.appendChild(updateBtn);
    updateBanner.appendChild(dismissBtn);
    document.body.appendChild(updateBanner);
  }
}

/**
 * Force update to new service worker
 */
export async function forceUpdate() {
  if (swRegistration?.waiting) {
    console.log('[SW] Skipping waiting, installing new service worker');
    swRegistration.waiting?.postMessage({ type: 'SKIP_WAITING' });
  }

  updateBanner?.remove();
  updateBanner = null;

  // Reload after a short delay to ensure SW takes over
  window.location.reload();
}

/**
 * Check for updates manually
 */
export async function checkForUpdates() {
  if (swRegistration) {
    console.log('[SW] Checking for updates...');
    await swRegistration.update();
  }
}

/**
 * Get the current service worker registration
 */
export function getSWRegistration() {
  return swRegistration;
}

/**
 * Check if service workers are supported
 */
export function supportsServiceWorkers() {
  return 'serviceWorker' in navigator;
}
