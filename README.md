<p align="center">
  <a href="https://moduleart.github.io/plaincolor">
    <img src='/src-tauri/icons/128x128.png' height="96px" />
  </a>
</p>
<h1 align="center">PlainColor</h1>
<p align="center">
  Lightweight cross-platform stylish color picker app written in Rust / Tauri
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

## Download

- <a href="https://github.com/ModuleArt/plain-color/releases/download/v1.0.5/PlainColor_1.0.5_aarch64.dmg">macOS: dmg</a>
- Windows: Coming soon...
- Linux: Coming soon...

## Features

- 🔍 Magnifying glass
- 🎨 Custom palettes
- 📋 A lot of copy options
- 🔲 Contrast checker - Coming soon...

## Todo

### v1.0.7

- Lense is lagging when picking on another screen and virtual desktop
  - Optimize picker loop: Move `setInterval` to rust, FE invokes only event loop start and end
- ColorCard: Checkboard background for alpha colors
- ColorCard: Add ability to type HEX value

### v1.0.8

- Fix: Color name, Palette name white-space
- Add picker sound (Funny mouth sound)
- Better color wheel: Add inputs for values (hex, rgba, etc.)
- Prepend default palette (Apple colors)
- <a href="https://icon.kitchen/">New app icon</a>

### v1.0.9

- <a href="https://v2.tauri.app/plugin/updater/">Add updater</a>
- More quick copy options
  - Common:
    - RGB/RGBA from 0 to 1 `0,36; 0,18; 0,57`
    - HSB/HSV `268, 69, 57`
  - WEB:
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

### Lense

- Move picker with arrows (step = 1px) (make sure it cannot be out of screen bounds)

### Shortcuts (?)

- Tray icon
- Picker shortcut `Command + Shift + M`
  - Instant picker shortcut `Ctrl + Shift + M` (?)
