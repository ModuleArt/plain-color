import { FC } from 'react'
import cn from 'classnames'
import { ITextProps } from './props'
import './index.scss'

export const Text: FC<ITextProps> = ({ tinted = false, text, transform = 'none', grow = false, className }) => {
  return (
    <span
      className={cn(
        'text',
        [`text--transform-${transform}`],
        { 'text--tinted': tinted, 'text--grow': grow },
        className
      )}
    >
      {text}
    </span>
  )
}
