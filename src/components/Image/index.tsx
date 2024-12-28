import { FC } from 'react'
import { IImageProps } from './props'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'

export const Image: FC<IImageProps> = ({ src, width, height, containerRef, ...props }) => {
  return (
    <img
      ref={containerRef}
      draggable={false}
      src={src}
      width={width}
      height={height}
      className={cn(props, commonComponentClasses(props))}
    />
  )
}
