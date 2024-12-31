import { create } from 'zustand'
import { Icon } from '@phosphor-icons/react'
import { MouseEvent } from 'react'

export interface IContextMenuPosition {
  x: number
  y: number
}

export interface IContextMenuItem {
  icon?: Icon
  label: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  subMenuItems?: IContextMenuItem[]
}

interface IContextMenuState {
  position: IContextMenuPosition
  menuItems: IContextMenuItem[]
  showMenu: (position: IContextMenuPosition, menuItems: IContextMenuItem[]) => void
  hideMenu: () => void
  replaceMenuItems: (menuItems: IContextMenuItem[]) => void
}

export const useContextMenuStore = create<IContextMenuState>()((set) => ({
  position: { x: 0, y: 0 },
  menuItems: [],
  showMenu: (position, menuItems) => set((state) => ({ ...state, position, menuItems })),
  hideMenu: () => set((state) => ({ ...state, position: { x: 0, y: 0 }, menuItems: [] })),
  replaceMenuItems: (menuItems) => set((state) => ({ ...state, menuItems })),
}))
