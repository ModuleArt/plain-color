import { FC, PropsWithChildren } from 'react'
import { IHeaderProps } from './props'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import './index.scss'
import { Stack } from '../Stack'

export const Header: FC<PropsWithChildren<IHeaderProps>> = ({
  children,
  extraPaddingLeft = false,
  extraPaddingRight = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'header',
        { 'header--extra-padding-left': extraPaddingLeft, 'header--extra-padding-right': extraPaddingRight },
        commonComponentClasses(props)
      )}
    >
      <Stack className="header__container">{children}</Stack>
    </div>
  )
}
