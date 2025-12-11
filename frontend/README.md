# Live Chat Frontend

Vue.js frontend for the Live Chat Application with real-time WebSocket support.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Edit `.env` with your backend configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# WebSocket Configuration
VITE_WS_HOST=localhost
VITE_WS_PORT=8080
VITE_WS_KEY=your-reverb-app-key
VITE_WS_SCHEME=http
```

**Important:** Get your `VITE_WS_KEY` from the Laravel backend `.env` file (`REVERB_APP_KEY`).

### 3. Start Development Server

```bash
npm run dev
```

The development server runs on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Features

- ✅ Real-time message updates via WebSocket
- ✅ Send and receive messages
- ✅ Message history loading
- ✅ User name support (optional)
- ✅ Automatic IP tracking
- ✅ Loading and error states
- ✅ Responsive design

## Components

- **App.vue** - Main application component
- **Chat.vue** - Chat interface component with API integration

## Services

- **messageService.js** - API service for message CRUD operations
- **websocketService.js** - WebSocket connection using Laravel Echo

## API Integration

The frontend connects to:
- **API Base URL**: `http://localhost:8000/api`
- **WebSocket Server**: `ws://localhost:8080`
- **Channel**: `chat`
- **Event**: `message.sent`

## Troubleshooting

### WebSocket Connection Issues

1. Ensure the Laravel backend and Reverb server are running
2. Check that `VITE_WS_KEY` matches `REVERB_APP_KEY` in backend `.env`
3. Verify ports 8000 (API) and 8080 (WebSocket) are accessible

### CORS Issues

If you encounter CORS errors, ensure the backend allows requests from `http://localhost:5173`

