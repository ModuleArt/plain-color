import { FC } from 'react'
import { IIconProps } from './props'
import './index.scss'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'

export const Icon: FC<IIconProps> = ({ width = 20, height = 20, tinted, ...props }) => {
  return (
    <props.icon
      className={cn('icon', { 'icon--tinted': tinted }, commonComponentClasses(props))}
      width={width}
      height={height}
    />
  )
}
