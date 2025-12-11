# DC Command Setup

The `dc` script provides convenient Docker commands. 

## Quick Setup

I've already created a symlink and added it to your PATH. **Reload your shell** to use `dc`:

```bash
source ~/.zshrc
```

Or open a new terminal window.

## Verify It Works

After reloading, test with:
```bash
cd /Users/mario/Documents/dev-projects/live-chat-app
dc help
```

## If It Still Doesn't Work

You might have a `dc` function already defined. Check with:
```bash
type dc
```

If it shows a function, you can either:
1. **Unset the function** (temporary):
   ```bash
   unset -f dc
   ```

2. **Use the full path**:
   ```bash
   ~/.local/bin/dc help
   ```

3. **Or use from project directory**:
   ```bash
   ./dc help
   ```

## Available Commands

Once working, you can use:
- `dc build` - Build all images
- `dc up` - Start services
- `dc down` - Stop services
- `dc migrate` - Run migrations
- `dc artisan cache:clear` - Clear cache
- `dc help` - Show all commands
