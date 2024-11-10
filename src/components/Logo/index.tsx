import { FC } from 'react'
import './index.scss'
import { Image } from '@/components/Image'

export const Logo: FC = () => {
  return <Image className="logo" src="/assets/imgs/logo.svg" />
}
