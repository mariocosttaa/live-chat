import Echo from 'laravel-echo/dist/echo.js'
import Pusher from 'pusher-js'
import { WS_HOST, WS_PORT, WS_KEY, WS_SCHEME } from '../config/api'

// Configure Pusher
window.Pusher = Pusher

// Create Echo instance
export const echo = new Echo({
    broadcaster: 'reverb',
    key: WS_KEY,
    wsHost: WS_HOST,
    wsPort: WS_PORT,
    wssPort: WS_PORT,
    forceTLS: WS_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
})

export default echo