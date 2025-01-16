import { FC, useRef, useState } from 'react'
import './index.scss'
import { IPickerPreviewProps } from './props'
import { isDark } from '@/utils/color'
import { Text } from '@/components/Text'
import cn from 'classnames'
import { Stack } from '@/components/Stack'
import { Image } from '@/components/Image'
import { usePinchGesture } from '@/hooks/usePinchGesture.hook'

export const PickerPreview: FC<IPickerPreviewProps> = ({
  colorHex,
  onClick,
  previewSize,
  image,
  showGuidelines = false,
  onZoomIn,
  onZoomOut,
}) => {
  const [isPicked, setIsPicked] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  usePinchGesture({ onZoomIn, onZoomOut })

  return (
    <div
      ref={ref}
      className={cn('picker-preview', {
        'picker-preview--show-cursor': isPicked,
        'picker-preview--invert-colors': !isDark(colorHex),
      })}
      onClick={() => {
        setIsPicked(true)
        onClick()
        setTimeout(() => setIsPicked(false), 100)
      }}
      style={{ '--pixel': `calc(100% / ${previewSize - 1})` } as React.CSSProperties}
    >
      <Image src={image} className="picker-preview__image" pointerEvents="disable" />
      <Stack
        className="picker-preview__color"
        style={{ background: `#${colorHex}` }}
        justify="center"
        pointerEvents="disable"
      >
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
