/**
 * Time Formatting Utilities
 * Formats timestamps for display in chat messages
 */

/**
 * Format a date for display in chat
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted time string
 */
export function formatChatTime(date) {
  if (!date) return ''
  
  const messageDate = new Date(date)
  const now = new Date()
  const diffMs = now - messageDate
  
  // Less than 1 minute
  if (diffMs < 60000) {
    return 'Just now'
  }
  
  // Less than 1 hour
  if (diffMs < 3600000) {
    const minutes = Math.floor(diffMs / 60000)
    return `${minutes}m ago`
  }
  
  // Less than 24 hours
  if (diffMs < 86400000) {
    const hours = Math.floor(diffMs / 3600000)
    return `${hours}h ago`
  }
  
  // More than 24 hours - show time
  return messageDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

