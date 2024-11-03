import { Icon } from '@phosphor-icons/react'

export interface ITabsProps {
  tabs: { id: string; icon?: Icon }[]
  activeTabId: string
  onTabChange?: (tabId: string) => void
}
