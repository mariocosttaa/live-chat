/**
 * Avatar Utilities
 * Handles avatar color generation and initial extraction
 */

// Solid professional colors (no purple, no gradients)
const AVATAR_COLORS = [
    '#0066cc', // Blue
    '#28a745', // Green
    '#ffc107', // Yellow
    '#dc3545', // Red
    '#17a2b8', // Cyan
    '#6f42c1', // Indigo
    '#fd7e14', // Orange
    '#20c997', // Teal
    '#e83e8c', // Pink
    '#343a40' // Dark gray
]

/**
 * Generate a hash from a string
 * @param {string} str - String to hash
 * @returns {number} - Hash value
 */
function hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash
}

/**
 * Get avatar solid color based on identifier
 * @param {string} identifier - Name or IP address
 * @returns {string} - CSS color string
 */
export function getAvatarGradient(identifier) {
    if (!identifier) return AVATAR_COLORS[0]

    const hash = Math.abs(hashString(identifier))
    return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

/**
 * Get avatar initial from name or identifier
 * @param {Object} message - Message object
 * @returns {string} - Single character for avatar
 */
export function getAvatarInitial(message) {
    if (message.name) {
        return message.name.charAt(0).toUpperCase()
    }

    if (message.ip_address) {
        // Use first character of the generated identifier
        const hash = Math.abs(hashString(message.ip_address))
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        return chars[hash % chars.length]
    }

    return '?'
}