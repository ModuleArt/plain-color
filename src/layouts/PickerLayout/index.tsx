import { FC, useEffect, useState } from 'react'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import { rgbToHex } from '@/utils/color'
import { disableDefaultContextMenu } from '@/utils/contextMenu.util'
import { emitToMain } from '@/utils/emit'
import { PickerPreview } from '@/components/PickerPreview'

export const PickerLayout: FC = () => {
  const [image, setImage] = useState('')
  const [color, setColor] = useState('000000')
  const [previewSize, setPreviewSize] = useState(1)
  const [isHoldingShift, setIsHoldingShift] = useState(false)

  const listenKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        cancel()
        break

      case '-':
      case '_':
        zoomOut()
        break

      case '=':
      case '+':
        zoomIn()
        break

      case 'c':
      case 'C':
        pickColor(true)
        break
    }
  }

  const listenKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Shift':
        setIsHoldingShift(true)
        break
    }
  }

  const listenKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Shift':
        setIsHoldingShift(false)
        break
    }
  }

  useEffect(() => {
    disableDefaultContextMenu()

    const listeners: Promise<UnlistenFn>[] = []

    listeners.push(
      listen<[string, [number, number, number, number], number]>('picker_loop_tick', (event) => {
        if (event.payload.length > 0 && event.payload[0]) {
          setImage(event.payload[0])

          if (event.payload.length > 1 && event.payload[1]) {
            const color = rgbToHex({ red: event.payload[1][0], green: event.payload[1][1], blue: event.payload[1][2] })
            setColor(color)

            if (event.payload.length > 2 && event.payload[2]) {
              setPreviewSize(event.payload[2])
            }
          }
        }
      })
    )

    document.addEventListener('keypress', listenKeyPress)
    document.addEventListener('keydown', listenKeyDown)
    document.addEventListener('keyup', listenKeyUp)

    return () => {
      document.removeEventListener('keypress', listenKeyPress)
      document.removeEventListener('keydown', listenKeyDown)
      document.removeEventListener('keyup', listenKeyUp)

      listeners.map((unlisten) => unlisten.then((f) => f()))
    }
  }, [color])

  const pickColor = (instantCopy: boolean) => {
    emitToMain({
      cmd: 'color_picked',
      payload: { color, closePicker: !isHoldingShift, instantCopy },
    })
  }

  const zoomIn = () => {
    emitToMain({ cmd: 'preview_zoom_in', payload: {} })
  }

  const zoomOut = () => {
    emitToMain({ cmd: 'preview_zoom_out', payload: {} })
  }

  const cancel = () => {
    emitToMain({ cmd: 'preview_canceled', payload: {} })
  }

  return <PickerPreview colorHex={color} onClick={() => pickColor(false)} previewSize={previewSize} image={image} />
}
