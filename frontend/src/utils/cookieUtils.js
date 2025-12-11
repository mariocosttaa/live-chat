/**
 * Cookie Utilities
 * Handles cookie operations for name persistence across tabs
 */

const COOKIE_NAME = 'chat_user_name'
const COOKIE_EXPIRY_DAYS = 365

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiry
 */
export function setCookie(name, value, days = COOKIE_EXPIRY_DAYS) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = `expires=${date.toUTCString()}`
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`
}

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null
 */
export function getCookie(name) {
    const nameEQ = `${name}=`
    const ca = document.cookie.split(';')

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length)
        }
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length))
        }
    }
    return null
}

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 */
export function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

/**
 * Get the saved user name from cookie
 * @returns {string|null} - User name or null
 */
export function getUserNameFromCookie() {
    return getCookie(COOKIE_NAME)
}

/**
 * Save user name to cookie
 * @param {string} name - User name to save
 */
export function saveUserNameToCookie(name) {
    if (name && name.trim()) {
        setCookie(COOKIE_NAME, encodeURIComponent(name.trim()), COOKIE_EXPIRY_DAYS)
    }
}