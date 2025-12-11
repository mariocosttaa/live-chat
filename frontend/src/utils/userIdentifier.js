/**
 * User Identifier Utilities
 * Generates consistent identifiers for anonymous users based on IP address
 */

/**
 * Generate a short, readable identifier from IP address
 * @param {string} ipAddress - The IP address
 * @returns {string} - A short identifier like "User-ABC123"
 */
export function generateUserIdentifier(ipAddress) {
  if (!ipAddress) return 'Anonymous'
  
  // Create a hash from the IP address
  let hash = 0
  for (let i = 0; i < ipAddress.length; i++) {
    const char = ipAddress.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Convert hash to a positive number and create a short code
  const code = Math.abs(hash).toString(36).toUpperCase().substring(0, 6)
  
  return `User-${code}`
}

/**
 * Get display name for a message
 * @param {Object} message - Message object with name and ip_address
 * @returns {string} - Display name
 */
export function getDisplayName(message) {
  if (message.name) {
    return message.name
  }
  
  if (message.ip_address) {
    return generateUserIdentifier(message.ip_address)
  }
  
  return 'Anonymous'
}

