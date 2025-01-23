# How to release a new version

### Preparation (skip if it's already done)

1. Place `tauri.key` and `tauri.key.pub` files into `~/.tauri` folder
2. Add this to your `.zshrc`:

```
export TAURI_SIGNING_PRIVATE_KEY="$HOME/.tauri/tauri.key"
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD="$$$"
```

3. Refresh `.zshrc`:

```bash
source ~/.zshrc
```

where `$$$` is password for the `tauri.key`

### Build

1. Build bundle:

```bash
yarn t:build:release
```

### Release

1. Create a new GitHub release
2. Attach all files from `/artifacts` folder to the release
