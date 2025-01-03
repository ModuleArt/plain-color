import { FC, PropsWithChildren } from 'react'
import './index.scss'
import { IScrollerProps } from './props'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { Stack } from '@/components/Stack'

export const Scroller: FC<PropsWithChildren<IScrollerProps>> = ({
  children,
  extraPaddingTop = false,
  extraPaddingBottom = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'scroller',
        { 'scroller--extra-padding-top': extraPaddingTop, 'scroller--extra-padding-bottom': extraPaddingBottom },
        commonComponentClasses(props)
      )}
    >
      <Stack dir="vertical" gap="none" grow>
        {children}
      </Stack>
    </div>
  )
}
