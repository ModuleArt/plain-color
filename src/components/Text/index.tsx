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
  onInputBlur,
  size = 'regular',
  align = 'left',
  textRef,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onClick = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus())
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTextChange && onTextChange(e.target.value)
  }

  const onBlur = () => {
    setIsEditing(false)
    onInputBlur && onInputBlur()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      onBlur()
    }
  }

  return (
    <span
      ref={textRef}
      className={cn(
        'text',
        [`text--align-${align}`],
        [`text--transform-${transform}`],
        [`text--size-${size}`],
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
      ) : editable ? (
        <button onClick={onClick} className="text__label text__label--clickable">
          {text}
        </button>
      ) : (
        <span className="text__label">{text}</span>
      )}
    </span>
  )
}
