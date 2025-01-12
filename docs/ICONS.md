# How to generate new icons

### 1. Generate images using [IconKitchen](https://icon.kitchen/i/H4sIAAAAAAAAA1WOuw7CMAxF%2F8WsHTpn5QeQ6IYYHOI8RIJLHiBU9d9xstWD5Xt0fe0NPhgbFVAbGMzPxVMiUBZjoQmsW36rSAgJHUEHFzQmvFz3V15BzRPk4Hwdk%2BZaOY0xku1sF%2BiuHkdKeTfMPUa7M0fOgk7zqMEOt2QxsWmxv3aDwEUsX9LSEz5E3fc%2FhbNzy7sAAAA%3D)

Settings:

- Icon: `Image`
  - Place the app icon
- Scaling: `Center`
- Mask: `Off`
- Effect: `None`
- Padding: `0%`
- Background: `Image`
  - Place the transparent empty png
- Texture: `None`

### 2. macOS icon

- Place `AppIcon.icns` from the generated `/macos` folder into `/src-tauri/icons/icon.icns`

### 3. Web icons

- Place `apple-touch-icon.png`, `favicon.ico`, `icon-192-maskable.png`, `icon-192.png`, `icon-512-maskable.png`, `icon-512.png` from the generated `/web`folder into `/public`
- Append these lines to `index.html` or `{{ window name }}.html`:

```
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

- Add `icons` field to `/public/manifest.json` file or create a `/public/manifest.json` with the following content:

```json
{
  "manifest_version": 3,
  "name": "PlainColor",
  "version": "1.0.0",
  "description": "A basic example extension with only required keys",
  "icons": [
    { "src": "/favicon.ico", "type": "image/x-icon", "sizes": "16x16 32x32" },
    { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" },
    { "src": "/icon-192-maskable.png", "type": "image/png", "sizes": "192x192", "purpose": "maskable" },
    { "src": "/icon-512-maskable.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" }
  ]
}
```

### 4. Tauri icons

- Place `favicon.ico` from the generated `/web` folder into `/src-tauri/icons/icon.ico`
- Place `icon-512.png` from the generated `/web` folder into `/src-tauri/icons/icon.png`
- Replace all other `.png` images inside the `/src-tauri/icons` folder by resizing the generated`/web/icon-512.png` into different sizes (check an existing image size before replacing)
