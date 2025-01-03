import { FC } from 'react'
import { Stack } from '@/components/Stack'
import { Button } from '@/components/Button'
import { IContextMenuItem, useContextMenuStore } from '@/store/contextMenu.store'
import { useClickOutside } from '@/hooks/useClickOutside.hook'
import './index.scss'
import { CaretRight } from '@phosphor-icons/react'

export const ContextMenu: FC = () => {
  const contextMenuStore = useContextMenuStore()

  const clickOutsideRef = useClickOutside(() => {
    contextMenuStore.hideMenu()
  })

  const onMenuItemClick = (event: MouseEvent, menuItem: IContextMenuItem) => {
    if (menuItem.subMenuItems) {
      contextMenuStore.replaceMenuItems(menuItem.subMenuItems)
    } else {
      contextMenuStore.hideMenu()
    }

    menuItem.onClick && menuItem.onClick(event)
  }

  const posX = Math.min(contextMenuStore.position.x, window.innerWidth - 208)
  const posY = Math.min(
    contextMenuStore.position.y,
    window.innerHeight -
      (contextMenuStore.menuItems.length > 7 ? 288 : contextMenuStore.menuItems.reduce((prev) => prev + 36, 24))
  )

  if (contextMenuStore.menuItems.length === 0) return null

  return (
    <div ref={clickOutsideRef} className="context-menu" style={{ left: `${posX}px`, top: `${posY}px` }}>
      <Stack dir="vertical" padding="small" gap="none" className="context-menu__list">
        {contextMenuStore.menuItems.map((menuItem, index) => (
          <Stack key={index} gap="extra-small" className="context-menu__item" align="center">
            <Button
              variant="clear"
              grow
              className="select__option-button"
              label={menuItem.label}
              onClick={(event) => onMenuItemClick(event, menuItem)}
              justify="start"
              padding="small"
              iconPre={menuItem.icon}
              tintedIconPre
              iconPost={menuItem.subMenuItems ? CaretRight : undefined}
              tintedIconPost
              growLabel
            />
          </Stack>
        ))}
      </Stack>
    </div>
  )
}
