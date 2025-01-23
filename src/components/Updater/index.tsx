import { FC, useEffect, useState } from 'react'
import { check, Update } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { Text } from '@/components/Text'
import { Stack } from '@/components/Stack'
import { Button } from '@/components/Button'

export const Updater: FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState<Update | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [contentLength, setContentLength] = useState(0)
  const [downloadedLength, setDownloadedLength] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    check().then((update) => {
      if (update) {
        setUpdateAvailable(update)
      }
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
            setDownloadedLength(downloadedLength + event.data.chunkLength)
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

  if (!updateAvailable) return null

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
                ? `Downloading: ${(downloadedLength / contentLength).toFixed(0)}%`
                : 'Downloading...'
              : `v${updateAvailable.version}`
          }
          size="small"
          tinted
        />
      </Stack>
      {!isDownloading && (
        <Stack>
          <Button label="Download and Install" padding="medium" onClick={downloadAndInstall} />
        </Stack>
      )}
    </Stack>
  )
}
