import { FC, useEffect, useRef, useState } from 'react'
import { UnlistenFn } from '@tauri-apps/api/event'
import { rgbToHex } from '@/utils/color'
import { disableDefaultContextMenu } from '@/utils/contextMenu.util'
import { emitToMain } from '@/utils/emit/main.emit'
import { PickerPreview } from '@/components/PickerPreview'
import { listenInPicker } from '@/utils/emit/picker.emit'
import { IPickerPreviewRef } from '@/components/PickerPreview/props'

export const PickerLayout: FC = () => {
  const [image, setImage] = useState('')
  const [color, setColor] = useState('000000')
  const [previewSize, setPreviewSize] = useState(1)
  const [showGuidelines, setShowGuidelines] = useState(false)
  const [isHoldingShift, setIsHoldingShift] = useState(false)
  const pickerPreviewRef = useRef<IPickerPreviewRef>(null)

  const listenKeyPress = (e: KeyboardEvent) => {
    e.preventDefault()

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

      case 'g':
      case 'G':
        emitToMain({ cmd: 'toggle_guidelines', payload: { show: !showGuidelines } })
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
      listenInPicker('picker_loop_tick', (payload) => {
        if (payload.length > 0 && payload[0]) {
          setImage(payload[0])

          if (payload.length > 1 && payload[1]) {
            const color = rgbToHex({ red: payload[1][0], green: payload[1][1], blue: payload[1][2] })
            setColor(color)

            if (payload.length > 2 && payload[2]) {
              setPreviewSize(payload[2])
            }
          }
        }
      })
    )

    listeners.push(
      listenInPicker('toggle_guidelines', (payload) => {
        setShowGuidelines(payload.show)
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
  }, [color, showGuidelines])

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
    pickerPreviewRef.current?.showCursor()
    setTimeout(() => emitToMain({ cmd: 'preview_canceled', payload: {} }))
  }

  return (
    <PickerPreview
      ref={pickerPreviewRef}
      colorHex={color}
      onClick={() => pickColor(false)}
      previewSize={previewSize}
      image={image}
      showGuidelines={showGuidelines}
      onZoomIn={zoomIn}
      onZoomOut={zoomOut}
    />
  )
}
