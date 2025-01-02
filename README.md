<p align="center">
  <a href="https://moduleart.github.io/plaincolor">
    <img src='/src-tauri/icons/128x128.png' height="96px" />
  </a>
</p>
<h1 align="center">PlainColor</h1>
<p align="center">
  Lightweight, versatile, cross-platform color picker app written in Rust / Tauri
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

## ⬇️ Download

- <a href="https://github.com/ModuleArt/plain-color/releases/download/v1.0.7/PlainColor_1.0.7_aarch64.dmg">macOS: dmg</a>
- Windows: Coming soon...
- Linux: Coming soon...

## 🚀 Features

- 🔍 Magnifying glass
- 🎨 Custom palettes
- 📋 A lot of copy options
  - `#HEX` `HEX` `#hex` `hex`
  - `rgb()` `R,G,B` `color(display-p3)`
  - `hsl()` `H,S,L`
  - `cmyk()` `C,M,Y,K`
- 🍎 Great macOS support
  - Works on top of menu bar and fullscreen windows

### Coming soon

- ⬛ Shades
- ⬜ Tints
- 🔲 Contrast checker
- 🖼️ Extract palette from image
  - K-Mean Algorithm
  - Dominant Colors

Want more? Open a <a href="https://github.com/ModuleArt/plain-color/issues/new">new issue</a> or 👍 an <a href="https://github.com/ModuleArt/plain-color/issues">existing one</a> so we can talk about it.

## 🐞 Bug report

If you want to report a bug, first, thank you, that helps us a lot. Please open an <a href="https://github.com/ModuleArt/plain-color/issues/new">issue</a> and mention your OS, your PlainColor version, and how to reproduce it. Adding a screenshot of the issue or screen recording is a big help too.

## 🔮 Future Plans

### v1.0.8

- Fix: Color name, Palette name white-space
- ColorCard: Checkboard background for alpha colors
- ColorCard: Add ability to type/paste HEX value
- Prepend default palette (Apple colors)
- Move picker with arrows (step = 1px), make sure it cannot be out of screen bounds

### v1.1.x

- <a href="https://icon.kitchen/">New app icon</a>
- <a href="https://v2.tauri.app/plugin/updater/">Add updater</a>
- Add picker sound (Funny mouth sound, with ability to turn off)
- Better color wheel: Add inputs for values (hex, rgba, etc.)
- Add ability to reorder colors
- More quick copy options
  - Common:
    - RGB/RGBA from 0 to 1 `0,36; 0,18; 0,57`
    - HSB/HSV `268, 69, 57`
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
- Tray icon
- Picker shortcut `Command + Shift + M`
  - Instant picker shortcut `Ctrl + Shift + M` (?)
