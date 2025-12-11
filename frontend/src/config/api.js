// API Configuration
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
export const WS_HOST =
    import.meta.env.VITE_WS_HOST || 'localhost'
export const WS_PORT =
    import.meta.env.VITE_WS_PORT || '8080'
export const WS_KEY =
    import.meta.env.VITE_WS_KEY || 'your-app-key-here'
export const WS_SCHEME =
    import.meta.env.VITE_WS_SCHEME || 'http'