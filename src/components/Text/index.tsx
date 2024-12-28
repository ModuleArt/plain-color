import { ChangeEvent, FC, KeyboardEvent, useRef, useState } from 'react'
import cn from 'classnames'
import { ITextProps } from './props'
import './index.scss'
import { commonComponentClasses } from '@/lib'

export const Text: FC<ITextProps> = ({
  tinted = false,
  text,
  transform = 'none',
  editable = false,
  onTextChange,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onClick = () => {
    if (editable) {
      setIsEditing(true)
      setTimeout(() => inputRef.current?.focus())
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTextChange && onTextChange(e.target.value)
  }

  const onBlur = () => {
    setIsEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      onBlur()
    }
  }

  return (
    <span
      className={cn(
        'text',
        [`text--transform-${transform}`],
        { 'text--tinted': tinted },
        commonComponentClasses(props)
      )}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="text__input"
          value={text}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      ) : (
        <span onClick={onClick} className={cn('text__label', { 'text__label--clickable': editable })}>
          {text}
        </span>
      )}
    </span>
  )
}
