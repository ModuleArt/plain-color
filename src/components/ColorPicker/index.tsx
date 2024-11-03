import { FC } from 'react'
import { HexAlphaColorPicker } from 'react-colorful'
import { IColorPickerProps } from './props'
import './index.scss'
import cn from 'classnames'

export const ColorPicker: FC<IColorPickerProps> = ({ hexValue, onChange, grow = false }) => {
  return (
    <HexAlphaColorPicker
      className={cn('color-picker', { 'color-picker--grow': grow })}
      color={hexValue}
      onChange={(v) => onChange && onChange(v.replace('#', ''))}
    />
  )
}
