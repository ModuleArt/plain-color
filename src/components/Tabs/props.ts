import { IPlainlibComponentProps } from '@/lib/types'
import { Icon } from '@phosphor-icons/react'

export interface ITabsProps extends IPlainlibComponentProps {
  tabs: { id: string; icon?: Icon }[]
  activeTabId: string
  onTabChange?: (tabId: string) => void
}
