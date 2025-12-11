# Live Chat Application

A real-time chat application with WebSocket support, built with Laravel backend and Vue.js frontend.

## Tech Stack

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Pest](https://img.shields.io/badge/Pest-000000?style=for-the-badge&logo=pest&logoColor=white)
![Composer](https://img.shields.io/badge/Composer-885630?style=for-the-badge&logo=composer&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)

**Backend:**
- **Laravel 12.0** - PHP web framework
- **PHP 8.2** - Server-side programming language
- **Laravel Reverb** - WebSocket server for real-time communication
- **SQLite** - Lightweight, file-based database
- **Pest PHP** - Modern PHP testing framework
- **Composer** - PHP dependency manager

**Frontend:**
- **Vue.js 3** - Progressive JavaScript framework
- **Laravel Echo** - WebSocket client library
- **Axios** - HTTP client for API requests
- **Vite** - Fast frontend build tool
- **NPM** - Node package manager

**DevOps:**
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **Helper Scripts** - `dc` command and Makefile for easy management

## Features

- ✅ Real-time messaging via WebSocket
- ✅ Persistent message storage
- ✅ User name management with cookie persistence
- ✅ Multi-tab synchronization
- ✅ RESTful API for message management
- ✅ Docker containerization

## Tech Stack

**Backend:**
- Laravel 12.0 (PHP 8.2)
- Laravel Reverb (WebSocket server)
- SQLite database
- Pest PHP (testing)

**Frontend:**
- Vue.js 3
- Laravel Echo (WebSocket client)
- Axios (HTTP client)

**DevOps:**
- Docker & Docker Compose
- Helper scripts (`dc` command, Makefile)

## Quick Start

### Using Docker (Recommended)

```bash
# Build and start services
dc build
dc up

# Or using make
make build
make up

# View logs
dc logs

# Stop services
dc down
```

**Services:**
- Backend API: `http://localhost:8000`
- WebSocket Server: `ws://localhost:8080`
- Frontend: `http://localhost:5173`

### Manual Setup

**Backend:**
```bash
cd backand
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**WebSocket Server:**
```bash
cd backand
php artisan reverb:start --host=0.0.0.0 --port=8080
```

## Project Structure

```
live-chat-app/
├── backand/              # Laravel backend
│   ├── app/
│   │   ├── Events/       # WebSocket events
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── routes/          # API & WebSocket routes
│   └── tests/           # Test suite
├── frontend/            # Vue.js frontend
│   ├── src/
│   │   ├── components/  # Vue components
│   │   ├── composables/ # Vue composables
│   │   ├── services/    # API & WebSocket services
│   │   └── utils/       # Utility functions
│   └── dist/           # Build output
├── docker/             # Docker configurations
├── docker-compose.yml  # Service orchestration
├── dc                  # Docker helper script
└── Makefile           # Build commands
```

## API Endpoints

**Base URL:** `http://localhost:8000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/messages` | Get all messages |
| POST | `/messages` | Create new message |
| GET | `/messages/{id}` | Get single message |
| PUT | `/messages/{id}` | Update message |
| DELETE | `/messages/{id}` | Delete message |

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "message": "Hello!"}'
```

## WebSocket

**Connection:** `ws://localhost:8080`

**Channel:** `chat`

**Event:** `message.sent`

Messages are automatically broadcasted to all connected clients when created or updated.

## Development Commands

### Docker Commands

```bash
dc up              # Start services
dc down            # Stop services
dc logs            # View logs
dc shell-backend   # Access backend container
dc test            # Run tests
dc migrate         # Run migrations
```

### Backend Commands

```bash
php artisan test              # Run all tests
php artisan migrate           # Run migrations
php artisan reverb:start      # Start WebSocket server
php artisan cache:clear       # Clear cache
```

### Frontend Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview build
```

## Testing

```bash
# Run all tests
cd backand && php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run specific test file
php artisan test tests/Feature/MessageApiTest.php
```

**Test Coverage:**
- 20 API endpoint tests
- 8 WebSocket broadcasting tests
- 8 Model tests
- 3 Unit tests

## Configuration

### Environment Variables

**Backend (`.env`):**
```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

BROADCAST_CONNECTION=reverb
REVERB_APP_ID=live-chat-app
REVERB_APP_KEY=base64:...
REVERB_APP_SECRET=...
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8080
```

## Troubleshooting

**WebSocket not connecting:**
- Verify Reverb server is running: `dc ps`
- Check port 8080 is available
- Verify `.env` REVERB_* variables are set

**Database errors:**
- Ensure SQLite file has correct permissions
- Run migrations: `dc migrate`

**Build errors:**
- Clear node modules: `rm -rf node_modules && npm install`
- Clear cache: `npm run build -- --force`

## License

MIT License
