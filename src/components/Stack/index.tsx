import cn from 'classnames'
import { FC, PropsWithChildren } from 'react'
import { IStackProps } from './props'
import './index.scss'

export const Stack: FC<PropsWithChildren<IStackProps>> = ({
  children,
  dir = 'horizontal',
  className,
  style,
  justify = 'start',
  align,
  grow = false,
  gap = 'small',
}) => {
  return (
    <div
      className={cn(
        'stack',
        [`stack--${dir}`],
        [`stack--justify-${justify}`],
        [`stack--gap-${gap}`],
        {
          'stack--grow': grow,
          [`stack--align-${align}`]: align,
        },
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}
