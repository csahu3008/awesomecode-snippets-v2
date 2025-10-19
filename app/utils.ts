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
    if (msg.includes('user is inactive'))
      return 'Your account is inactive. Please contact support.';

    // Fallback
    return parsed.detail;
  }

  // Step 3: Handle field validation errors (from /register)
  if (typeof parsed === 'object') {
    // show only first error
    let firstErrorMsg = Object.values(parsed)[0];
    let firstError = firstErrorMsg.join('\n');
    if (firstError) {
      return firstError;
    }
  }

  // Step 4: Fallback generic message
  return 'An unexpected error occurred. Please try again later.';
}
export default handleAuthError;
const modernColors = [
  '#33991A',
  '#FF1A66',
  '#00B3E6',
  '#FF6633',
  '#3366E6',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#E6B333',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
  '#2E8B57',
  '#D2691E',
  '#FF7F50',
  '#6495ED',
  '#DC143C',
  '#00008B',
  '#008B8B',
  '#B8860B',
  '#A9A9A9',
  '#006400',
  '#BDB76B',
  '#8B008B',
  '#556B2F',
  '#FF8C00',
  '#9932CC',
  '#8B0000',
  '#E9967A',
  '#8FBC8F',
  '#483D8B',
  '#2F4F4F',
  '#00CED1',
  '#9400D3',
  '#FF1493',
  '#00BFFF',
  '#696969',
  '#1E90FF',
  '#B22222',
  '#FFFAF0',
  '#228B22',
  '#FF00FF',
  '#DCDCDC',
  '#F8F8FF',
  '#FFD700',
  '#DAA520',
  '#808080',
  '#008000',
  '#ADFF2F',
  '#F0FFF0',
  '#FF69B4',
  '#CD5C5C',
  '#4B0082',
  '#FFFFF0',
  '#F0E68C',
  '#E6E6FA',
  '#FFF0F5',
  '#7CFC00',
  '#FFFACD',
  '#ADD8E6',
  '#F08080',
  '#E0FFFF',
];

export function getColorByIndex(index) {
  const totalColors = modernColors.length;
  const colorIndex = index % totalColors;
  return modernColors[colorIndex];
}
