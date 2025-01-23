import { forwardRef, useImperativeHandle, useRef, CSSProperties } from 'react'
import './index.scss'
import { IPickerPreviewProps, IPickerPreviewRef } from './props'
import { isDark } from '@/utils/color'
import { Text } from '@/components/Text'
import cn from 'classnames'
import { Stack } from '@/components/Stack'
import { Image } from '@/components/Image'
import { usePinchGesture } from '@/hooks/usePinchGesture.hook'

export const PickerPreview = forwardRef<IPickerPreviewRef, IPickerPreviewProps>(
  ({ colorHex, onClick, previewSize, image, showGuidelines = false, onZoomIn, onZoomOut }, ref) => {
    const isCursorVisible = useRef(false)

    const showCursor = () => {
      isCursorVisible.current = true

      setTimeout(() => {
        isCursorVisible.current = false
      }, 100)
    }

    useImperativeHandle(ref, () => ({
      showCursor,
    }))

    usePinchGesture({ onZoomIn, onZoomOut })

    return (
      <div
        className={cn('picker-preview', {
          'picker-preview--show-cursor': isCursorVisible.current,
          'picker-preview--invert-colors': !isDark(colorHex),
        })}
        onClick={() => {
          showCursor()
          onClick()
        }}
        style={{ '--pixel': `calc(100% / ${previewSize - 1})` } as CSSProperties}
      >
        <Image src={image} className="picker-preview__image" />
        <Stack className="picker-preview__color" style={{ background: `#${colorHex}` }} justify="center">
          <Text text={colorHex} tinted transform="uppercase" className="picker-preview__color-text" />
        </Stack>
        <div className="picker-preview__pointer"></div>
        {showGuidelines && (
          <>
            <div className="picker-preview__guideline picker-preview__guideline--horizontal"></div>
            <div className="picker-preview__guideline picker-preview__guideline--vertical"></div>
          </>
        )}
      </div>
    )
  }
)
