/**
 * Handles authentication errors coming from Django REST Framework / SimpleJWT
 * @param {string|object} errorData - error.response.data (could be object or JSON string)
 * @returns {string} - Clean, user-friendly error message
 */
function handleAuthError(errorData: string): string {
  let parsed;

  // Step 1: Try parsing if it's a stringified JSON
  try {
    parsed = typeof errorData === 'string' ? JSON.parse(errorData) : errorData;
  } catch (e) {
    parsed = errorData; // If not JSON, leave as-is
  }

  // Step 2: Extract useful message
  if (!parsed) return 'Something went wrong. Please try again.';

  // Handle DRF "detail" key (common in SimpleJWT and auth errors)
  if (parsed.detail) {
    const msg = parsed.detail.toString().toLowerCase();

    // Customize common JWT/Django auth messages
    if (msg.includes('no active account')) return 'Invalid username or password.';
    if (msg.includes('token is invalid')) return 'Your session has expired. Please log in again.';
    if (msg.includes('token has expired')) return 'Your session has expired. Please log in again.';
    if (msg.includes('not authenticated')) return 'You must be logged in to access this resource.';
    if (msg.includes('invalid token')) return 'Authentication failed. Please log in again.';
    if (msg.includes('user is inactive')) return 'Your account is inactive. Please contact support.';

    // Fallback
    return parsed.detail;
  }

  // Step 3: Handle field validation errors (from /register)
  if (typeof parsed === 'object') {

    // show only first error 
      let firstErrorMsg= Object.values(parsed)[0]
      let firstError=firstErrorMsg.join('\n')
      if(firstError){
        return firstError
      }
  }

  // Step 4: Fallback generic message
  return 'An unexpected error occurred. Please try again later.';
}

export default handleAuthError;
