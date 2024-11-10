<p align="center">
  <img src='/src-tauri/icons/128x128.png' height="96px" />
</p>
<h1 align="center">PlainColor</h1>
<p align="center">
  Lightweight stylish cross-platform color picker app
  <br><br>
  <a href="https://github.com/ModuleArt/plain-color/releases">
    <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/moduleart/plain-color?include_prereleases">
    <img alt="GitHub All Releases" src="https://img.shields.io/github/downloads/ModuleArt/plain-color/total">
    <a href="https://moduleart.github.io">
      <img alt="Module Art website" src="https://img.shields.io/badge/www-moduleart-%2300BCD4">
    </a>
  </a>
</p>
<p align="center">
  <img src='/screenshots/1.png' width="360px" />
  <img src='/screenshots/2.png' width="360px" />
</p>

### Download

- <a href="https://github.com/ModuleArt/plain-color/releases/download/v1.0.0/PlainColor_1.0.0_aarch64.dmg">macOS: dmg</a>
- Windows: Coming soon...
- Linux: Coming soon...

### Features

- 🔍 Zoomed preview
- 🎨 Custom palettes - Coming soon...
- 🔲 Contrast checker - Coming soon...

### Todo

##### Important

- Hide cursor when picking
- Crash when cursor is close to screen sides
- Lense cannot be dragged on top of the macOS menubar
- Lense cannot be dragged on top of fullscreen windows
- Lense is lagging when picking on another screen and virtual desktop
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
- Prepend one color (Use background color)
- Prepend default palette (Apple colors)
