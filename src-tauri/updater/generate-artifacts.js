import fs from 'fs'
import path from 'path'

// load version

const packageJsonPath = path.join('package.json')
let packageJson = {}
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
} catch (error) {
  console.error('Failed to read package.json:', error)
  process.exit(1)
}

const VERSION = packageJson.version
if (!VERSION) {
  console.error('Version is missing in package.json!')
  process.exit(1)
}

// load signature

const signaturePath = path.join('src-tauri', 'target', 'release', 'bundle', 'macos', 'PlainColor.app.tar.gz.sig')
let signature = ''
try {
  signature = fs.readFileSync(signaturePath, 'utf-8').trim()
} catch (error) {
  console.error('Failed to read signature file:', error)
  process.exit(1)
}

const latestJson = {
  version: VERSION,
  notes: 'Update',
  pub_date: new Date().toISOString(),
  platforms: {
    'darwin-aarch64': {
      url: 'https://github.com/ModuleArt/plain-color/releases/latest/download/PlainColor.app.tar.gz',
      signature,
    },
  },
}

// write artifacts

const artifactsPath = path.join('artifacts')
const latestJsonOutputPath = path.join(artifactsPath, 'latest.json')

try {
  if (fs.existsSync(artifactsPath)) {
    fs.rmSync(artifactsPath, { recursive: true, force: true })
  }

  fs.mkdirSync(artifactsPath)
} catch (error) {
  console.error('Cannot access artifacts directory:', error)
  process.exit(1)
}

try {
  fs.writeFileSync(latestJsonOutputPath, JSON.stringify(latestJson, null, 2), 'utf-8')
  console.log(`latest.json generated successfully at ${latestJsonOutputPath}`)
} catch (error) {
  console.error('Failed to generate latest.json:', error)
  process.exit(1)
}

const updaterName = 'PlainColor.app.tar.gz'
const updaterPath = path.join('src-tauri', 'target', 'release', 'bundle', 'macos', updaterName)
const dmgName = `PlainColor_${VERSION}_aarch64.dmg`
const dmgPath = path.join('src-tauri', 'target', 'release', 'bundle', 'dmg', dmgName)

try {
  fs.copyFileSync(updaterPath, path.join(artifactsPath, updaterName))
  fs.copyFileSync(dmgPath, path.join(artifactsPath, dmgName))
} catch (error) {
  console.error('Failed to copy artifacts:', error)
  process.exit(1)
}
