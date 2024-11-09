import cn from 'classnames'
import { FC, PropsWithChildren } from 'react'
import { IStackProps } from './props'
import './index.scss'
import { commonComponentClasses } from '@/lib'

export const Stack: FC<PropsWithChildren<IStackProps>> = ({
  children,
  dir = 'horizontal',
  style,
  justify = 'start',
  align,
  gap = 'small',
  padding = 'none',
  ...props
}) => {
  return (
    <div
      className={cn(
        'stack',
        [`stack--${dir}`],
        [`stack--justify-${justify}`],
        [`stack--gap-${gap}`],
        [`stack--padding-${padding}`],
        {
          [`stack--align-${align}`]: align,
        },
        commonComponentClasses(props)
      )}
      style={style}
    >
      {children}
    </div>
  )
}
