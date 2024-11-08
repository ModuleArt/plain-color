import { FC } from 'react'
import { IPickerPreviewProps } from './props'
import { Stack } from '@/components/Stack'
import './index.scss'

export const PickerPreview: FC<IPickerPreviewProps> = ({ image }) => {
  return (
    <Stack gap="none" className="picker-preview">
      <img src={image} className="picker-preview__image" />
    </Stack>
  )
}
