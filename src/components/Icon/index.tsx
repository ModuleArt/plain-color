import { FC } from 'react'
import { IIconProps } from './props'

export const Icon: FC<IIconProps> = (props) => {
  return <props.icon width="1.2rem" height="1.2rem" />
}
