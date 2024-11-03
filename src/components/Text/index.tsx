import { FC } from 'react'
import cn from 'classnames'
import { ITextProps } from './props'
import './index.scss'

export const Text: FC<ITextProps> = ({ tinted = false, text, transform = 'none', className }) => {
  return (
    <span className={cn('text', [`text--transform-${transform}`], { 'text--tinted': tinted }, className)}>{text}</span>
  )
}
