// lib/authShim.ts
// After adding AuthProvider in App.tsx, we now assume @convex-dev/auth/react is available.
// This shim re-exports the real hooks. If the package is missing, we still provide
// minimal fallbacks to avoid runtime crashes during development.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('@convex-dev/auth/react');
  // Directly export the real hooks
  module.exports.useAuthStateShim = mod.useAuthState;
  module.exports.useAuthActionsShim = mod.useAuthActions;
} catch (e) {
  // Minimal fallbacks
  const React = require('react');
  module.exports.useAuthStateShim = function useAuthStateShim() {
    const [user] = React.useState(null);
    React.useEffect(() => {}, []);
    return { user };
  };
  module.exports.useAuthActionsShim = function useAuthActionsShim() {
    return {
      signIn: async () => { throw new Error('Auth provider not configured'); },
      signOut: async () => {},
    };
  };
}
