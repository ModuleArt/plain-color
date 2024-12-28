<p align="center">
  <a href="https://moduleart.github.io/plaincolor">
    <img src='/src-tauri/icons/128x128.png' height="96px" />
  </a>
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
  <a href="https://moduleart.github.io/plaincolor">
    <img src='https://moduleart.github.io/assets/images/projects/plain-color/1.webp' width="100%" />
  </a>
</p>

### Download

- <a href="https://github.com/ModuleArt/plain-color/releases/download/v1.0.2/PlainColor_1.0.2_aarch64.dmg">macOS: dmg</a>
- Windows: Coming soon...
- Linux: Coming soon...

### Features

- 🔍 Zoomed preview
- 🎨 Custom palettes - Coming soon...
- 🔲 Contrast checker - Coming soon...

### Todo

##### v1.0.3

- <b>macOS permissions:</b> Better user experience
- <b>Settings page:</b>

  - macOS permission status
  - Select quick copy options
    - Common:
      - #HEX/HEXA `#5C2D91`
      - HEX/HEXA `5C2D91`
      - RGB/RGBA `92, 45, 145`
      - RGB/RGBA from 0 to 1 `0,36; 0,18; 0,57`
      - CMYK % `37, 69, 0, 43`
      - HSL/HSLA `268, 53, 37`
      - HSB/HSV `268, 69, 57`
    - WEB:
      - 🌐 CSS RGB/RGBA
      - 🌐 CSS HSL/HSLA
      - 🌐 CSS Display P3
    - Native:
      - 🖥️ NSColor RGB
      - 🖥️ NSColor HSB
      - 📱 UIColor RGB
      - 📱 UIColor HSB
      - 🐦‍⬛ SwiftUI Color HSB
      - 🐦‍⬛ Swift Color Literal
      - 🖥️ Obj-C NSColor Calibrated RGB
      - 📱 Obj-C UIColor RGB
      - 🌊 .NET RGB/ARGB
      - ☕ Java RGB/RGBA
      - 📱 Android RGB/ARGB

- <b>Lense:</b> Control zoom level with `+` and `-` keys
- <b>Lense:</b> Move picker with arrows (step = 1px)
- <b>Lense:</b> Press `C` to copy color instantly (what to copy? - need a setting for this)
- <b>ColorCard:</b> Checkboard background for alpha colors

##### Critical

- Lense cannot be dragged on top of fullscreen windows
- Lense is lagging when picking on another screen and virtual desktop
  - Optimize picker loop: Move `setInterval` to rust, FE invokes only event loop start and end
- PlainColor process is active after app closed (?)

##### Palette

- Palettes tab
- Save color to palette
- Manage palettes

##### Shortcuts (?)

- Tray icon
- Picker shortcut `Command + Shift + M`
  - Instant picker shortcut `Ctrl + Shift + M` (?)

##### Fun stuff / Quality improvements

- Add picker sound (Water drop sound)
- Prepend one color (Use different color on every new release)
- Prepend default palette (Apple colors)
- <a href="https://v2.tauri.app/plugin/updater/">Add updater</a>
