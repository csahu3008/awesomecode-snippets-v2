'server only';
export function getAuthHeadersFromSession(serverSession?: any) {
  const token = serverSession
    ? serverSession?.accessToken || serverSession?.access_token || ''
    : '';
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}
