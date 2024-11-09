import { FC } from 'react'
import { HexAlphaColorPicker } from 'react-colorful'
import { IColorPickerProps } from './props'
import './index.scss'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'

export const ColorPicker: FC<IColorPickerProps> = ({ hexValue, onChange, ...props }) => {
  return (
    <HexAlphaColorPicker
      className={cn('color-picker', commonComponentClasses(props))}
      color={hexValue}
      onChange={(v) => onChange && onChange(v.replace('#', ''))}
    />
  )
}
