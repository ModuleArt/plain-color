import { create } from 'zustand'
import { Icon } from '@phosphor-icons/react'

export interface IContextMenuPosition {
  x: number
  y: number
}

export interface IContextMenuItem {
  icon?: Icon
  label: string
  onClick?: (event: MouseEvent) => void
  subMenuItems?: IContextMenuItem[]
}

export interface IContextMenuShowMenuProps {
  event: MouseEvent | TouchEvent
  useMousePosition?: boolean
}

interface IContextMenuState {
  position: IContextMenuPosition
  menuItems: IContextMenuItem[]
  showMenu: (props: IContextMenuShowMenuProps, menuItems: IContextMenuItem[]) => void
  hideMenu: () => void
  replaceMenuItems: (menuItems: IContextMenuItem[]) => void
}

export const useContextMenuStore = create<IContextMenuState>()((set) => ({
  position: { x: 0, y: 0 },
  menuItems: [],
  showMenu: (props, menuItems) =>
    set((state) => {
      let x = 0
      let y = 0

      if (props.useMousePosition) {
        if (props.event instanceof MouseEvent) {
          x = props.event.clientX
          y = props.event.clientY
        } else if (props.event.touches.length) {
          x = props.event.touches[0].clientX
          y = props.event.touches[0].clientY
        }
      } else {
        const target = props.event.target as HTMLElement
        const bounds = target.getBoundingClientRect()
        x = bounds.left
        y = bounds.top + bounds.height - 8
      }

      return { ...state, menuItems, position: { x, y } }
    }),
  hideMenu: () => set((state) => ({ ...state, menuItems: [], position: { x: 0, y: 0 } })),
  replaceMenuItems: (menuItems) => set((state) => ({ ...state, menuItems })),
}))
