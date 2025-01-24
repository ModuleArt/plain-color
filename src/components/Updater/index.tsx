import { FC, useEffect, useState } from 'react'
import { check, Update } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { Text } from '@/components/Text'
import { Stack } from '@/components/Stack'
import { Button } from '@/components/Button'
import { app } from '@tauri-apps/api'
import { ProgressBar } from '@/components/ProgressBar'

export const Updater: FC = () => {
  const [version, setVersion] = useState('0')
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState<Update | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [contentLength, setContentLength] = useState(0)
  const [downloadedLength, setDownloadedLength] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    setIsCheckingForUpdates(true)

    app.getVersion().then((v) => setVersion(v))

    check().then((update) => {
      if (update) {
        setUpdateAvailable(update)
      }
      setIsCheckingForUpdates(false)
    })
  }, [])

  const downloadAndInstall = () => {
    setIsDownloading(true)

    updateAvailable
      ?.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            setContentLength(event.data.contentLength || 0)
            break
          case 'Progress':
            setDownloadedLength((downloadedLength) => downloadedLength + event.data.chunkLength)
            break
          case 'Finished':
            setIsFinished(true)
            break
        }
      })
      .then(() => {
        relaunch()
      })
  }

  if (isCheckingForUpdates) {
    return (
      <Stack dir="vertical" gap="extra-small">
        <Stack dir="vertical">
          <Text text="Checking for updates..." size="small" tinted />
        </Stack>
      </Stack>
    )
  }

  if (!updateAvailable) {
    return (
      <Stack dir="vertical" gap="extra-small">
        <Stack dir="vertical">
          <Text text="You're up-to-date!" />
          <Text text={`PlainColor v${version} is currently the newest version available`} size="small" tinted />
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack dir="vertical" gap="extra-small">
      <Stack dir="vertical">
        <Text text="New Update Available!" />
        <Text
          text={
            isFinished
              ? 'Finished. Relaunching...'
              : isDownloading
              ? contentLength > 0
                ? `Downloading... ${((downloadedLength / contentLength) * 100).toFixed(0)}%`
                : 'Downloading...'
              : `The new version of PlainColor v${updateAvailable.version} is available`
          }
          size="small"
          tinted
        />
        {isDownloading && <ProgressBar value={downloadedLength} maxValue={contentLength} />}
      </Stack>

      {!isDownloading && (
        <Stack>
          <Button label="Download and Install" padding="medium" onClick={downloadAndInstall} />
        </Stack>
      )}
    </Stack>
  )
}
