// Minimal auth stub to prevent module loading errors
export function initAuth() {
  // no-op for now
}

// Auto-initialize if needed
if (typeof window !== 'undefined') {
  window.initAuth = initAuth;
}
