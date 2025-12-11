import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

export const messageService = {
    // Get all messages
    async getMessages() {
        try {
            const response = await api.get('/messages')
            return response.data
        } catch (error) {
            console.error('Error fetching messages:', error)
            throw error
        }
    },

    // Create a new message
    async createMessage(data) {
        try {
            const response = await api.post('/messages', {
                name: data.name || null,
                message: data.message,
            })
            return response.data
        } catch (error) {
            console.error('Error creating message:', error)
            throw error
        }
    },

    // Get a single message
    async getMessage(id) {
        try {
            const response = await api.get(`/messages/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching message:', error)
            throw error
        }
    },

    // Update a message
    async updateMessage(id, data) {
        try {
            const response = await api.put(`/messages/${id}`, {
                name: data.name || null,
                message: data.message,
            })
            return response.data
        } catch (error) {
            console.error('Error updating message:', error)
            throw error
        }
    },

    // Delete a message
    async deleteMessage(id) {
        try {
            await api.delete(`/messages/${id}`)
            return true
        } catch (error) {
            console.error('Error deleting message:', error)
            throw error
        }
    },
}