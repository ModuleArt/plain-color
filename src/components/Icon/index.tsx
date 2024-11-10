import { FC } from 'react'
import { IIconProps } from './props'

export const Icon: FC<IIconProps> = ({ width = 19, height = 19, ...props }) => {
  return <props.icon width={width} height={height} />
}
