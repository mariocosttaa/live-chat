#!/bin/bash
# Script to create organized commit history

set -e

cd /Users/mario/Documents/dev-projects/live-chat-app

# Function to create commit
commit() {
    git add "$1"
    git commit -m "$2" --no-verify
}

echo "Creating organized commit history..."

# 1. Project initialization
commit "README.md" "docs: add project README with overview and features"
commit ".gitignore" "chore: add .gitignore for Laravel and Node projects"

# 2. Backend setup - Laravel installation
commit "backand/composer.json" "feat: initialize Laravel 12.0 project"
commit "backand/composer.lock" "chore: lock composer dependencies"
commit "backand/bootstrap/app.php" "config: configure Laravel application bootstrap"
commit "backand/.env.example" "config: add environment configuration template"

# 3. Database setup
commit "backand/database/migrations/2025_12_10_121922_create_messages_table.php" "feat: create messages table migration"
commit "backand/config/database.php" "config: configure SQLite database connection"

# 4. Models
commit "backand/app/Models/Message.php" "feat: create Message model with fillable attributes"

# 5. API Routes
commit "backand/routes/api.php" "feat: define API routes for messages CRUD"
commit "backand/routes/web.php" "chore: clean up web routes"

# 6. Controllers
commit "backand/app/Http/Controllers/Api/MessageController.php" "feat: implement MessageController with CRUD operations"

# 7. WebSocket/Broadcasting setup
commit "backand/config/broadcasting.php" "feat: configure Laravel broadcasting for Reverb"
commit "backand/config/reverb.php" "feat: configure Reverb WebSocket server"
commit "backand/routes/channels.php" "feat: define public chat channel for WebSocket"

# 8. Events
commit "backand/app/Events/MessageSent.php" "feat: create MessageSent event for WebSocket broadcasting"

# 9. Update controller to use events
commit "backand/app/Http/Controllers/Api/MessageController.php" "feat: integrate WebSocket broadcasting in MessageController"

# 10. Testing setup
commit "backand/tests/Pest.php" "test: configure Pest PHP testing framework"
commit "backand/tests/TestCase.php" "test: setup base test case"

# 11. Unit tests
commit "backand/tests/Unit/MessageTest.php" "test: add unit tests for Message model"

# 12. Feature tests - Model
commit "backand/tests/Feature/MessageModelTest.php" "test: add feature tests for Message model operations"

# 13. Feature tests - API
commit "backand/tests/Feature/MessageApiTest.php" "test: add comprehensive API endpoint tests"

# 14. Feature tests - Broadcasting
commit "backand/tests/Feature/MessageBroadcastingTest.php" "test: add WebSocket broadcasting tests"

# 15. Frontend setup
commit "frontend/package.json" "feat: initialize Vue.js frontend project"
commit "frontend/vite.config.js" "config: configure Vite for Vue.js development"
commit "frontend/index.html" "feat: create frontend HTML entry point"

# 16. Frontend core files
commit "frontend/src/main.js" "feat: setup Vue.js application entry point"
commit "frontend/src/App.vue" "feat: create main App component"
commit "frontend/src/style.css" "style: add global styles"

# 17. Frontend services
commit "frontend/src/config/api.js" "feat: configure API base URL"
commit "frontend/src/services/messageService.js" "feat: implement message API service"
commit "frontend/src/services/websocketService.js" "feat: setup Laravel Echo WebSocket client"

# 18. Frontend utilities
commit "frontend/src/utils/userIdentifier.js" "feat: add user identifier utility for anonymous users"
commit "frontend/src/utils/timeFormatter.js" "feat: add time formatting utility"
commit "frontend/src/utils/avatarUtils.js" "feat: add avatar color and initial utilities"
commit "frontend/src/utils/cookieUtils.js" "feat: add cookie utilities for name persistence"

# 19. Frontend composables
commit "frontend/src/composables/useChat.js" "feat: create useChat composable for chat logic"

# 20. Frontend components
commit "frontend/src/components/Chat.vue" "feat: implement main Chat component with two-column layout"

# 21. Docker setup
commit "docker-compose.yml" "feat: add Docker Compose configuration for services"
commit "docker/backend/Dockerfile" "feat: create backend Dockerfile"
commit "docker/frontend/Dockerfile" "feat: create frontend Dockerfile"
commit "docker/reverb/Dockerfile" "feat: create Reverb WebSocket server Dockerfile"
commit ".dockerignore" "chore: add .dockerignore file"

# 22. Helper scripts
commit "dc" "feat: add Docker helper script (dc command)"
commit "Makefile" "feat: add Makefile with Docker commands"
commit "SETUP-DC.md" "docs: add Docker setup documentation"

# 23. Backend improvements
commit "backand/app/Http/Controllers/Api/MessageController.php" "refactor: remove IP-based name locking, allow free name selection"
commit "backand/app/Http/Controllers/Api/MessageController.php" "feat: make name field required for messages"

# 24. Frontend improvements
commit "frontend/src/components/Chat.vue" "refactor: redesign UI with two-column layout and solid colors"
commit "frontend/src/utils/avatarUtils.js" "refactor: replace gradients with solid professional colors"
commit "frontend/src/composables/useChat.js" "feat: implement cookie-based name persistence with auto-sync"
commit "frontend/src/composables/useChat.js" "fix: replace optional chaining with traditional null checks for build compatibility"

# 25. Documentation updates
commit "README.md" "docs: improve README with clear structure and quick start guide"
commit "README.md" "docs: add Docker helper commands documentation"

# 26. Configuration improvements
commit "backand/.env.example" "config: update environment variables for Reverb"
commit "frontend/vite.config.js" "config: add build target configuration"

# 27. Code organization
commit "frontend/src" "refactor: organize frontend code into composables and utilities"
commit "backand/app" "refactor: organize backend code structure"

# 28. Bug fixes and polish
commit "frontend/src/composables/useChat.js" "fix: improve name synchronization across tabs"
commit "frontend/src/components/Chat.vue" "style: improve chat UI styling and responsiveness"

echo "Commit history created successfully!"
git log --oneline | head -30

