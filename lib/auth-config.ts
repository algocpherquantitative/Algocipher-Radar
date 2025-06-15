// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id',
  redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback/google',
  scope: 'openid email profile',
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent'
};

// GitHub OAuth Configuration
export const GITHUB_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'your-github-client-id',
  redirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/callback/github',
  scope: 'user:email'
};

// Apple OAuth Configuration
export const APPLE_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || 'your-apple-client-id',
  redirectUri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || 'http://localhost:3000/auth/callback/apple',
  scope: 'name email',
  responseType: 'code',
  responseMode: 'form_post'
};

// OAuth Helper Functions
export const buildGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    scope: GOOGLE_OAUTH_CONFIG.scope,
    response_type: GOOGLE_OAUTH_CONFIG.responseType,
    access_type: GOOGLE_OAUTH_CONFIG.accessType,
    prompt: GOOGLE_OAUTH_CONFIG.prompt,
    state: generateRandomState()
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const buildGitHubAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GITHUB_OAUTH_CONFIG.clientId,
    redirect_uri: GITHUB_OAUTH_CONFIG.redirectUri,
    scope: GITHUB_OAUTH_CONFIG.scope,
    state: generateRandomState()
  });
  
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

export const buildAppleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: APPLE_OAUTH_CONFIG.clientId,
    redirect_uri: APPLE_OAUTH_CONFIG.redirectUri,
    scope: APPLE_OAUTH_CONFIG.scope,
    response_type: APPLE_OAUTH_CONFIG.responseType,
    response_mode: APPLE_OAUTH_CONFIG.responseMode,
    state: generateRandomState()
  });
  
  return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
};

// Generate random state for OAuth security
export const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Store and verify OAuth state
export const storeOAuthState = (state: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('oauth_state', state);
  }
};

export const verifyOAuthState = (state: string) => {
  if (typeof window !== 'undefined') {
    const storedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');
    return storedState === state;
  }
  return false;
};