import { FC, PropsWithChildren } from 'react'
import './index.scss'
import { IScrollerProps } from './props'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { Stack } from '@/components/Stack'
import { useContextMenuStore } from '@/store/contextMenu.store'
import VirtualList from 'react-tiny-virtual-list'

export const Scroller: FC<PropsWithChildren<IScrollerProps>> = ({
  children,
  extraPaddingTop = false,
  extraPaddingBottom = false,
  virtualScrollRenderItem,
  virtualScrollItemCount = 0,
  virtualScrollItemSize = 0,
  ...props
}) => {
  const contextMenuStore = useContextMenuStore()

  const onScroll = () => {
    if (contextMenuStore.menuItems.length > 0) {
      contextMenuStore.hideMenu()
    }
  }

  return (
    <div
      className={cn(
        'scroller',
        { 'scroller--extra-padding-top': extraPaddingTop, 'scroller--extra-padding-bottom': extraPaddingBottom },
        commonComponentClasses(props)
      )}
      onScroll={onScroll}
    >
      <Stack dir="vertical" gap="none" grow>
        {virtualScrollRenderItem && virtualScrollItemCount && virtualScrollItemSize ? (
          <VirtualList
            width="100%"
            height="100%"
            itemCount={virtualScrollItemCount}
            itemSize={virtualScrollItemSize}
            renderItem={({ index }) => virtualScrollRenderItem(index)}
          />
        ) : (
          children
        )}
      </Stack>
    </div>
  )
}
