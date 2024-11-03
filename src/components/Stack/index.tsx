import cn from 'classnames'
import { FC, PropsWithChildren } from 'react'
import { IStackProps } from './props'
import './index.scss'

export const Stack: FC<PropsWithChildren<IStackProps>> = ({
  children,
  dir = 'horizontal',
  itemsGrow = false,
  className,
  style,
  justify = 'start',
  align,
  grow = false,
}) => {
  return (
    <div
      className={cn(
        'stack',
        [`stack--${dir}`],
        [`stack--justify-${justify}`],
        {
          'stack--items-grow': itemsGrow,
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
