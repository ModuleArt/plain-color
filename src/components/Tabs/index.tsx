import { FC } from 'react'
import './index.scss'
import { ITabsProps } from './props'

export const Tabs: FC<ITabsProps> = ({ tabs }) => {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button key={tab.id} className="tabs__tab">
          {tab.icon && <div className="tabs__tab-icon">{<tab.icon width="1rem" height="1rem" />}</div>}
          {tab.label && <div className="tabs__tab-label">{tab.label}</div>}
        </button>
      ))}
    </div>
  )
}
