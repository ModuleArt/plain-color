import { FC } from 'react'
import { IProgressBarProps } from './props'
import './index.scss'

export const ProgressBar: FC<IProgressBarProps> = ({ value, maxValue = 1 }) => {
  return (
    <div className="progress-bar">
      <div className="progress-bar__value" style={{ width: `${(value / maxValue) * 100}%` }} />
    </div>
  )
}
