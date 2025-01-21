import { FC } from 'react'
import { IInputProps } from './props'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'

export const Input: FC<IInputProps> = ({
  value,
  onChange,
  onBlur,
  autoComplete,
  autoCapitalize,
  autoCorrect,
  onKeyDown,
  inputRef,
  ...props
}) => {
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      onBlur={onBlur}
      autoComplete={autoComplete}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      onKeyDown={onKeyDown}
      className={cn('input', commonComponentClasses(props))}
    />
  )
}
