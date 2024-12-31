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

interface IContextMenuState {
  position: IContextMenuPosition
  menuItems: IContextMenuItem[]
  showMenu: (
    position: { x?: number; y?: number; event: MouseEvent | TouchEvent },
    menuItems: IContextMenuItem[]
  ) => void
  hideMenu: () => void
  replaceMenuItems: (menuItems: IContextMenuItem[]) => void
}

export const useContextMenuStore = create<IContextMenuState>()((set) => ({
  position: { x: 0, y: 0 },
  menuItems: [],
  showMenu: (position, menuItems) =>
    set((state) => {
      if (position.event) {
        const el = (position.event.target as HTMLDivElement).getBoundingClientRect()
        return { ...state, position: { x: el.top, y: el.bottom }, menuItems }
      }
      return { ...state, position: { x: position.x || 0, y: position.y || 0 }, menuItems }
    }),
  hideMenu: () => set((state) => ({ ...state, position: { x: 0, y: 0 }, menuItems: [] })),
  replaceMenuItems: (menuItems) => set((state) => ({ ...state, menuItems })),
}))
