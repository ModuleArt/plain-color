import { FC } from 'react'
import './index.scss'
import { ITabsProps } from './props'
import cn from 'classnames'
import { Icon } from '@/components/Icon'
import { Stack } from '@/components/Stack'
import { commonComponentClasses } from '@/lib'

export const Tabs: FC<ITabsProps> = ({ tabs, activeTabId, onTabChange, containerRef, ...props }) => {
  return (
    <Stack containerRef={containerRef} className={cn('tabs', commonComponentClasses(props))} gap="none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn('tabs__tab', { 'tabs__tab--active': tab.id === activeTabId })}
          onClick={() => onTabChange && onTabChange(tab.id)}
        >
          {tab.icon && <div className="tabs__tab-icon">{<Icon icon={tab.icon} />}</div>}
        </button>
      ))}
    </Stack>
  )
}
