<p align="center">
  <a href="https://moduleart.github.io/plaincolor">
    <img src='https://moduleart.github.io/assets/images/projects/plain-color/icon.webp' height="96px" />
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

- macOS: <a href="https://github.com/ModuleArt/plain-color/releases/download/v1.0.12/PlainColor_1.0.12_aarch64.dmg">dmg</a>
- Windows: exe | microsoft store - Coming soon...
- Linux: deb | flathub - Coming soon...

## 🚀 Features

- 🔍 <b>Picker</b> - Pick a color from your screen with advanced magnifying glass
- 🎨 <b>Custom palettes</b> - Organize your colors with palettes. Name colors and add them to palettes to use in your projects
  - Export palette to `JSON` `Apple Color List (.clr)` `CSS or SASS variables` `JavaScript object`
  - Import from file `JSON` `Apple Color List (.clr)`
  - Import from library `Tailwind CSS` `Material UI` `Apple Developer`
- 📋 <b>A lot of color formats</b> - Copy your colors as:
  - `#HEX` `HEX` `#hex` `hex`
  - `rgb()` `R,G,B` `color(display-p3)`
  - `hsl()` `H,S,L`
  - `cmyk()` `C,M,Y,K`
- 🍎 <b>Great macOS support</b>
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

## 🔮 Roadmap

- Add ability to reorder colors
- Add ability to reorder palettes
- More color formats:
  - Common:
    - RGB/RGBA from 0 to 1 `0,36; 0,18; 0,57`
    - LAB
    - RAL
    - HKS
    - COPIC
    - Prismacolor
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
    - ☕ Java HEX
    - ☕ Java RGB
    - 📱 Android RGB/ARGB
  - Custom color formatter
- Add ability to change global shortcuts
- Export to image (with preview, mb use canvas)
- Add picker sound (Funny mouth sound, with ability to turn off)
- New button pressed animation: scale down
- Search for colors in palette
- Fix: Sometimes the cursor is not visible - Hide cursor with `set_cursor_visible` ([issue](https://github.com/tauri-apps/tauri/issues/10231))
- [Aperture size](https://github.com/ModuleArt/plain-color/pull/9#issuecomment-2599870209)
- Move picker with arrows (step = 1px), make sure it cannot be out of screen bounds
- Settings: Add "Reset to defaults" button
- Instant copy shortcut `CommandOrControl+Alt+C`
- Instant pick shortcut `CommandOrControl+Shift+C`
- <a href="https://github.com/tauri-apps/tauri-action">Build app releases with GitHub action</a>
