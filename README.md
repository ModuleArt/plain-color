# PlainColor

Stylish color picker for macOS and Windows

### Todo

##### Must have

- Custom app icon
- Hide cursor when picking
- Crash when cursor is close to screen sides
- Preview cannot be dragged on top of the macOS menubar

##### Palette

- Palettes tab
- Save color to palette
- Manage palettes

##### Shortcuts

- Tray icon
- Picker shortcut `Command + Shift + M`
- Instant picker shortcut `Ctrl + Shift + M`?

##### Settings

- Settings/about tab

##### Lense improvements

- Control zoom level with `+` and `-` keys
- Hard to target specific pixel with touchpad, ColorSlurp is much more responsive
- Try to use tauri `cursor_position` function to retrieve mouse coordinates

##### Optimizations

- Optimize picker loop: Move `setInterval` to rust, FE invokes only event loop start and end
