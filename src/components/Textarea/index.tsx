import { FC } from 'react'
import { ITextareaProps } from './props'
import './index.scss'

export const Textarea: FC<ITextareaProps> = ({ value, readonly = false }) => {
  return <textarea className="textarea" value={value} readOnly={readonly} />
}
