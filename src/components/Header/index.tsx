import { FC, PropsWithChildren } from 'react'
import { Stack } from '@/components/Stack'
import { IHeaderProps } from './props'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import './index.scss'

export const Header: FC<PropsWithChildren<IHeaderProps>> = ({ children, leftElement, rightElement, ...props }) => {
  return (
    <Stack className={cn('header', commonComponentClasses(props))} align="center">
      <Stack grow justify="start">
        {leftElement}
      </Stack>
      {children}
      <Stack grow justify="end">
        {rightElement}
      </Stack>
    </Stack>
  )
}
