import { FC, useEffect, useState } from 'react'
import { listen, emitTo, UnlistenFn } from '@tauri-apps/api/event'
import './index.scss'
import { isDark, rgbToHex } from '@/utils/color.util'
import { Text } from '@/components/Text'
import cn from 'classnames'
import { Stack } from '@/components/Stack'
import { Image } from '@/components/Image'

export const PickerLayout: FC = () => {
  const [image, setImage] = useState('')
  const [color, setColor] = useState('000000')
  const [previewSize, setPreviewSize] = useState(1)

  const listenHotkeys = (e: KeyboardEvent) => {
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
    }
  }

  useEffect(() => {
    const listeners: Promise<UnlistenFn>[] = []

    listeners.push(
      listen<[string, [number, number, number, number], number]>('preview_fetched', (event) => {
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

    document.addEventListener('keypress', listenHotkeys)

    return () => {
      document.removeEventListener('keypress', listenHotkeys)
      listeners.map((unlisten) => unlisten.then((f) => f()))
    }
  }, [])

  const pickColor = () => {
    emitTo('main', 'color_picked', color)
  }

  const zoomIn = () => {
    emitTo('main', 'preview_zoom_in')
  }

  const zoomOut = () => {
    emitTo('main', 'preview_zoom_out')
  }

  const cancel = () => {
    emitTo('main', 'color_canceled')
  }

  return (
    <div
      className="picker-layout"
      onClick={pickColor}
      style={{ '--pixel': `calc(100% / ${previewSize - 1}` } as React.CSSProperties}
    >
      <Image src={image} className="picker-layout__image" pointerEvents="disable" />
      <Stack
        className="picker-layout__color"
        style={{ background: `#${color}` }}
        justify="center"
        pointerEvents="disable"
      >
        <Text
          text={color}
          tinted
          transform="uppercase"
          className={cn('picker-layout__color-text', { 'picker-layout__color-text--inverted': !isDark(color) })}
        />
      </Stack>
    </div>
  )
}
