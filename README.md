# PlainColor

Stylish cross-platform color picker app

<img src='/screenshots/1.png' height="512px" />

### Download

- <a href="https://github.com/ModuleArt/plain-color/releases/download/v1.0.0/PlainColor_1.0.0_aarch64.dmg">macOS: dmg</a>
- Windows: Coming soon...

### Todo

##### Must have

- Hide cursor when picking
- Crash when cursor is close to screen sides
- Preview cannot be dragged on top of the macOS menubar
- ColorCard: Checkboard background for alpha colors

##### Palette

- Palettes tab
- Save color to palette
- Manage palettes

##### Shortcuts

- Tray icon
- Picker shortcut `Command + Shift + M`
- Instant picker shortcut `Ctrl + Shift + M` (?)

##### Settings

- Settings window

##### Lense improvements

- Control zoom level with `+` and `-` keys
- Hard to target specific pixel with touchpad, ColorSlurp is much more responsive
- Try to use tauri `cursor_position` function to retrieve mouse coordinates

##### Optimizations

- Optimize picker loop: Move `setInterval` to rust, FE invokes only event loop start and end

##### Fun stuff

- Add picker sound (Water drop sound)
