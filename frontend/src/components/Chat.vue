<template>
  <div class="chat-container">
    <!-- Two Column Layout -->
    <div class="chat-layout">
      <!-- Left Sidebar: Name Input -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">Your Name</h2>
        </div>
        <div class="sidebar-content">
          <input
            v-model="userName"
            type="text"
            class="name-input"
            placeholder="Enter your name"
            maxlength="255"
            required
          />
          <p class="sidebar-hint">Choose any name you like</p>
        </div>
      </div>

      <!-- Right Side: Chat Area -->
      <div class="chat-main">
        <!-- Header -->
        <div class="chat-header">
          <div class="header-content">
            <h1 class="header-title">Live Chat</h1>
            <span class="header-status">
              <span class="status-dot"></span>
              <span class="status-text">Online</span>
            </span>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="messages-container" ref="messagesContainer">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading messages...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error && messages.length === 0" class="error-state">
            <p class="error-text">{{ error }}</p>
            <button @click="loadMessages" class="retry-button">Retry</button>
          </div>
          
          <!-- Error Banner -->
          <div v-if="error && messages.length > 0" class="error-banner" @click="error = null">
            <p class="error-banner-text">{{ error }}</p>
            <button @click.stop="error = null" class="error-close">×</button>
          </div>

          <!-- Messages List -->
          <div v-else class="messages-list">
            <div 
              v-for="message in messages" 
              :key="message.id"
              class="message-item"
              :class="{ 'message-own': isOwnMessage(message) }"
            >
              <div class="message-avatar">
                <div class="avatar-circle" :style="{ backgroundColor: getAvatarColor(message) }">
                  {{ getAvatarInitial(message) }}
                </div>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-name">{{ getMessageDisplayName(message) }}</span>
                  <span class="message-time">{{ formatTime(message.created_at) }}</span>
                </div>
                <div class="message-text">{{ message.message }}</div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="messages.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p class="empty-text">No messages yet. Start the conversation!</p>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="input-container">
          <div class="input-wrapper">
            <input
              v-model="messageInput"
              type="text"
              class="message-input"
              placeholder="Type your message..."
              @keyup.enter="handleSendMessage"
              @input="handleInput"
            />
            <button 
              class="send-button"
              :class="{ 'send-button-active': messageInput.trim().length > 0 && userName.trim().length > 0 && !sending }"
              @click="handleSendMessage"
              :disabled="messageInput.trim().length === 0 || userName.trim().length === 0 || sending"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div class="input-footer">
            <span class="char-count">{{ messageInput.length }}/10000</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChat } from '../composables/useChat'

// Use the chat composable for all chat functionality
const {
  messageInput,
  userName,
  messagesContainer,
  messages,
  loading,
  error,
  sending,
  formatTime,
  getAvatarColor,
  getAvatarInitial,
  getMessageDisplayName,
  isOwnMessage,
  handleInput,
  handleSendMessage,
  loadMessages
} = useChat()
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.chat-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Left Sidebar */
.sidebar {
  width: 280px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e9ecef;
  background: #ffffff;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.sidebar-content {
  padding: 24px 20px;
  flex: 1;
}

.name-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  background: #ffffff;
  box-sizing: border-box;
}

.name-input:focus {
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.sidebar-hint {
  margin-top: 12px;
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 0;
}

/* Right Side: Chat Main */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  min-width: 0;
}

/* Header */
.chat-header {
  background: #0066cc;
  color: white;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #28a745;
  border-radius: 50%;
}

.status-text {
  font-weight: 500;
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f8f9fa;
  position: relative;
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: #e9ecef;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #adb5bd;
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #868e96;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Message Item */
.message-item {
  display: flex;
  gap: 12px;
}

.message-own {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-content {
  flex: 1;
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-own .message-content {
  align-items: flex-end;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.message-own .message-header {
  flex-direction: row-reverse;
}

.message-name {
  font-size: 13px;
  font-weight: 600;
  color: #495057;
}

.message-own .message-name {
  color: #ffffff;
}

.message-time {
  font-size: 11px;
  color: #6c757d;
}

.message-own .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.message-text {
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.5;
  color: #212529;
  border: 1px solid #e9ecef;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-own .message-text {
  background: #0066cc;
  color: white;
  border-color: #0052a3;
}

/* Input Container */
.input-container {
  background: #ffffff;
  border-top: 1px solid #e9ecef;
  padding: 16px 24px;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  background: #ffffff;
}

.message-input:focus {
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.send-button {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: none;
  background: #dee2e6;
  color: #6c757d;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-button-active {
  background: #0066cc;
  color: white;
  cursor: pointer;
}

.send-button-active:hover {
  background: #0052a3;
}

.send-button-active:active {
  background: #004085;
}

.input-footer {
  display: flex;
  justify-content: flex-end;
}

.char-count {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-top-color: #0066cc;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #dc3545;
}

.error-text {
  font-size: 16px;
  margin-bottom: 16px;
  text-align: center;
}

.retry-button {
  padding: 10px 20px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.retry-button:hover {
  background: #0052a3;
}

/* Error Banner */
.error-banner {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 90%;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-banner-text {
  color: #856404;
  font-size: 14px;
  margin: 0;
  flex: 1;
}

.error-close {
  background: transparent;
  border: none;
  color: #856404;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.error-close:hover {
  background: rgba(133, 100, 4, 0.1);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.4;
}

.empty-text {
  font-size: 16px;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }

  .message-content {
    max-width: 85%;
  }
}
</style>
