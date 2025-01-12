import { FC } from 'react'
import { ITextareaProps } from './props'
import './index.scss'

export const Textarea: FC<ITextareaProps> = ({ value, readonly = false }) => {
  return <textarea tabIndex={-1} className="textarea" value={value} readOnly={readonly} />
}
