/**
 * Chat Composable
 * Main logic for chat functionality
 */

import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { messageService } from '../services/messageService'
import echo from '../services/websocketService'
import { getDisplayName } from '../utils/userIdentifier'
import { formatChatTime } from '../utils/timeFormatter'
import { getAvatarGradient, getAvatarInitial } from '../utils/avatarUtils'
import { getUserNameFromCookie, saveUserNameToCookie } from '../utils/cookieUtils'

export function useChat() {
    // State
    const messageInput = ref('')
    const userName = ref('')
    const messagesContainer = ref(null)
    const messages = ref([])
    const loading = ref(true)
    const error = ref(null)
    const sending = ref(false)
    const currentUserIP = ref(null)

    // Error timeout management
    let errorTimeout = null

    /**
     * Load messages from API
     */
    const loadMessages = async() => {
        try {
            loading.value = true
            error.value = null

            const data = await messageService.getMessages()
            messages.value = data.map(msg => ({
                ...msg,
                created_at: new Date(msg.created_at)
            }))

            // After loading messages, try to sync name from most recent message
            syncNameFromRecentMessage()

            scrollToBottom()
        } catch (err) {
            error.value = 'Failed to load messages. Please check your connection.'
            console.error('Error loading messages:', err)
        } finally {
            loading.value = false
        }
    }

    /**
     * Sync name from most recent message sent by this IP
     * This ensures that if user has multiple tabs with different names,
     * refreshing will sync to the last name used
     */
    const syncNameFromRecentMessage = () => {
        // First, try to get IP from cookie or find it in messages
        if (!currentUserIP.value && messages.value.length > 0) {
            // Try to detect IP from messages (if we have a cookie name, find matching IP)
            const cookieName = getUserNameFromCookie()
            if (cookieName) {
                const messageWithName = messages.value
                    .filter(msg => msg.name === cookieName && msg.ip_address)
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]

                if (messageWithName && messageWithName.ip_address) {
                    currentUserIP.value = messageWithName.ip_address
                }
            }
        }

        if (!currentUserIP.value || messages.value.length === 0) {
            return
        }

        // Find the most recent message from this IP
        const recentMessage = messages.value
            .filter(msg => msg.ip_address === currentUserIP.value && msg.name)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]

        if (recentMessage && recentMessage.name) {
            // Update name if different from current (this syncs across tabs on refresh)
            if (userName.value !== recentMessage.name) {
                userName.value = recentMessage.name
                saveUserNameToCookie(recentMessage.name)
            }
        }
    }

    /**
     * Format time for display
     */
    const formatTime = (date) => formatChatTime(date)

    /**
     * Get avatar color gradient
     */
    const getAvatarColor = (message) => {
        const identifier = message.name || message.ip_address || 'default'
        return getAvatarGradient(identifier)
    }

    /**
     * Get avatar initial
     */
    const getAvatarInitialChar = (message) => getAvatarInitial(message)

    /**
     * Get display name for message
     */
    const getMessageDisplayName = (message) => getDisplayName(message)

    /**
     * Check if message is from current user
     * Compares by name - user can change name anytime
     */
    const isOwnMessage = (message) => {
        if (!userName.value || !message.name) {
            return false
        }
        return message.name === userName.value
    }

    /**
     * Handle message input
     */
    const handleInput = () => {
        const MAX_LENGTH = 10000
        if (messageInput.value.length > MAX_LENGTH) {
            messageInput.value = messageInput.value.substring(0, MAX_LENGTH)
        }
    }

    /**
     * Send a new message
     */
    const handleSendMessage = async() => {
        if (messageInput.value.trim().length === 0 || sending.value) {
            return
        }

        const messageText = messageInput.value.trim()
        const messageName = userName.value.trim()

        // Validate name is required
        if (!messageName || messageName.length === 0) {
            error.value = 'Name is required to send messages.'
            return
        }

        // Clear input immediately for better UX
        messageInput.value = ''

        try {
            sending.value = true
            error.value = null

            const newMessage = await messageService.createMessage({
                name: messageName,
                message: messageText
            })

            // Store IP for reference
            if (newMessage.ip_address && !currentUserIP.value) {
                currentUserIP.value = newMessage.ip_address
            }

            // Save name to cookie when message is sent (syncs across tabs)
            saveUserNameToCookie(messageName)

            error.value = null
            scrollToBottom()
        } catch (err) {
            // Restore input on error
            messageInput.value = messageText

            // Handle validation errors
            if (err.response && err.response.status === 422) {
                const errorData = err.response.data
                if (errorData.errors && errorData.errors.name) {
                    error.value = errorData.errors.name[0] || errorData.message || 'Name validation failed.'
                } else {
                    error.value = errorData.message || 'Validation failed. Please check your input.'
                }
            } else {
                error.value = 'Failed to send message. Please try again.'
            }

            console.error('Error sending message:', err)
        } finally {
            sending.value = false
        }
    }

    /**
     * Scroll messages container to bottom
     */
    const scrollToBottom = () => {
        nextTick(() => {
            if (messagesContainer.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
            }
        })
    }

    /**
     * Setup WebSocket listener for real-time messages
     */
    const setupWebSocket = () => {
        echo.channel('chat')
            .listen('.message.sent', (event) => {
                const newMessage = {
                    ...event.message,
                    created_at: new Date(event.message.created_at)
                }

                // Check if message already exists (avoid duplicates)
                const exists = messages.value.some(msg =>
                    msg.id === newMessage.id ||
                    (msg.id && newMessage.id && msg.id.toString() === newMessage.id.toString())
                )

                if (!exists) {
                    messages.value.push(newMessage)

                    // If this message is from current IP, sync the name
                    if (currentUserIP.value && newMessage.ip_address === currentUserIP.value && newMessage.name) {
                        if (userName.value !== newMessage.name) {
                            userName.value = newMessage.name
                            saveUserNameToCookie(newMessage.name)
                        }
                    }

                    scrollToBottom()
                }
            })
    }

    /**
     * Cleanup WebSocket connection
     */
    const cleanupWebSocket = () => {
        echo.leave('chat')
    }

    /**
     * Initialize chat on mount
     */
    const initializeChat = async() => {
        // Load saved user name from cookie (works across tabs)
        const savedName = getUserNameFromCookie()
        if (savedName) {
            userName.value = savedName
        }

        await loadMessages()
        setupWebSocket()
        scrollToBottom()
    }

    // Save name to cookie when it changes (syncs across tabs)
    watch(userName, (newName) => {
        if (newName && newName.trim()) {
            saveUserNameToCookie(newName.trim())
        }
    })

    /**
     * Auto-clear error messages after 5 seconds
     */
    watch(error, (newError) => {
        if (errorTimeout) {
            clearTimeout(errorTimeout)
            errorTimeout = null
        }

        if (newError) {
            errorTimeout = setTimeout(() => {
                error.value = null
                errorTimeout = null
            }, 5000)
        }
    })

    // Lifecycle hooks
    onMounted(() => {
        initializeChat()
    })

    onUnmounted(() => {
        cleanupWebSocket()
        if (errorTimeout) {
            clearTimeout(errorTimeout)
        }
    })

    return {
        // State
        messageInput,
        userName,
        messagesContainer,
        messages,
        loading,
        error,
        sending,

        // Methods
        formatTime,
        getAvatarColor,
        getAvatarInitial: getAvatarInitialChar,
        getMessageDisplayName,
        isOwnMessage,
        handleInput,
        handleSendMessage,
        loadMessages
    }
}