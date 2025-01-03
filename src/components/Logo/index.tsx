import { FC } from 'react'
import './index.scss'
import { Image } from '@/components/Image'
import { ILogoProps } from './props'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'

export const Logo: FC<ILogoProps> = ({ ...props }) => {
  return <Image className={cn('logo', commonComponentClasses(props))} src="/assets/imgs/logo.svg" />
}
