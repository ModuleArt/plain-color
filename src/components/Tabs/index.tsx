import { FC } from 'react'
import './index.scss'
import { ITabsProps } from './props'
import cn from 'classnames'
import { Icon } from '@/components/Icon'

export const Tabs: FC<ITabsProps> = ({ tabs, activeTabId, onTabChange }) => {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn('tabs__tab', { 'tabs__tab--active': tab.id === activeTabId })}
          onClick={() => onTabChange && onTabChange(tab.id)}
        >
          {tab.icon && <div className="tabs__tab-icon">{<Icon icon={tab.icon} />}</div>}
        </button>
      ))}
    </div>
  )
}
