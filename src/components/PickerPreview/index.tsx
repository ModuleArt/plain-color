import { FC, useState } from 'react'
import './index.scss'
import { IPickerPreviewProps } from './props'
import { isDark } from '@/utils/color'
import { Text } from '@/components/Text'
import cn from 'classnames'
import { Stack } from '@/components/Stack'
import { Image } from '@/components/Image'

export const PickerPreview: FC<IPickerPreviewProps> = ({ colorHex, onClick, previewSize, image }) => {
  const [isPicked, setIsPicked] = useState(false)

  return (
    <div
      className={cn('picker-preview', { 'picker-preview--show-cursor': isPicked })}
      onClick={() => {
        setIsPicked(true)
        onClick()
        setTimeout(() => setIsPicked(false), 100)
      }}
      style={{ '--pixel': `calc(100% / ${previewSize - 1}` } as React.CSSProperties}
    >
      <Image src={image} className="picker-preview__image" pointerEvents="disable" />
      <Stack
        className="picker-preview__color"
        style={{ background: `#${colorHex}` }}
        justify="center"
        pointerEvents="disable"
      >
        <Text
          text={colorHex}
          tinted
          transform="uppercase"
          className={cn('picker-preview__color-text', { 'picker-preview__color-text--inverted': !isDark(colorHex) })}
        />
      </Stack>
    </div>
  )
}
