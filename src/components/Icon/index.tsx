import { FC } from 'react'
import { IIconProps } from './props'

export const Icon: FC<IIconProps> = ({ width = 20, height = 20, ...props }) => {
  return <props.icon width={width} height={height} />
}
