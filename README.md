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

- macOS: <a href="https://github.com/ModuleArt/plain-color/releases/download/v1.0.9/PlainColor_1.0.9_aarch64.dmg">dmg</a>
- Windows: exe | microsoft store | chocolatey - Coming soon...
- Linux: flathub | appimage | deb - Coming soon...

## 🚀 Features

- 🔍 <b>Picker</b> - Pick a color from your screen with advanced magnifying glass
- 🎨 <b>Custom palettes</b> - Organize your colors with palettes. Name colors and add them to palettes to use in your projects
  - Export palette to `JSON` `CSS / SASS variables` `JavaScript object`
  - Import colors from `JSON` `Tailwind CSS default colors`
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

### v1.1.x

- Add ability to reorder colors
- More color formats:
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
  - Custom color formatter
- Add ability to change global shortcuts
- Export to image (with preview, mb use canvas)
- Add picker sound (Funny mouth sound, with ability to turn off)
- New button pressed animation: scale down
- Control Select with arrows up/down
