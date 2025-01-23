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
  wrap = false,
  onClick,
  stackRef,
  ...props
}) => {
  return (
    <div
      ref={stackRef as any}
      className={cn(
        'stack',
        [`stack--${dir}`],
        [`stack--justify-${justify}`],
        [`stack--gap-${gap}`],
        [`stack--padding-${padding}`],
        {
          [`stack--align-${align}`]: align,
          'stack--wrap': wrap,
        },
        commonComponentClasses(props)
      )}
      style={style}
      onClick={(e) => onClick && onClick(e.nativeEvent)}
    >
      {children}
    </div>
  )
}
