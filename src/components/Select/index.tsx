import { useState } from 'react'
import './index.scss'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { ISelectOption, ISelectProps } from './props'
import { Button } from '@/components/Button'
import { Stack } from '@/components/Stack'
import { CaretDown, CaretUp, Circle, CheckCircle } from '@phosphor-icons/react'
import { Text } from '@/components/Text'
import { useClickOutside } from '@/hooks/useClickOutside.hook'

export const Select = <T extends string | number>({
  options = [],
  value,
  onChange,
  maxWidth,
  multiple = false,
  containerRef,
  ...props
}: ISelectProps<T>) => {
  const [isOpened, setIsOpened] = useState(false)

  const selectedOptions = options.filter((option) => value?.includes(option.id))

  const onOptionClick = (option: ISelectOption<T>) => {
    if (multiple) {
      const newValue = selectedOptions.filter((o) => o.id !== option.id).map((o) => o.id)

      if (newValue.length === selectedOptions.length) {
        newValue.push(option.id)
      }

      onChange && onChange(newValue)
    } else {
      onChange && onChange([option.id])
    }
  }

  const clickOutsideRef = useClickOutside(() => {
    setIsOpened(false)
  })

  return (
    <div ref={containerRef} className={cn('select', commonComponentClasses(props))}>
      <Button
        className="select__button"
        label={selectedOptions.map((option) => option.label).join(', ') || 'None'}
        iconPost={isOpened ? CaretUp : CaretDown}
        onClick={() => setIsOpened(!isOpened)}
        padding="medium"
        maxWidth={maxWidth}
        pointerEvents={isOpened ? 'disable' : 'enable'}
        tinted={isOpened}
      />
      {isOpened && (
        <div className="select__options" ref={clickOutsideRef}>
          <Stack dir="vertical" padding="small">
            {options.map((option) => {
              const isSelected = !!selectedOptions.find((o) => o.id === option.id)
              return (
                <Stack key={option.id} dir="vertical" gap="none" className="select__option">
                  <Button
                    variant="clear"
                    className="select__option-button"
                    label={option.label}
                    onClick={() => onOptionClick(option)}
                    justify="start"
                    padding="small"
                    iconPre={isSelected ? CheckCircle : Circle}
                    tinted={!isSelected}
                  />
                  {option.description && (
                    <Text size="small" className="select__option-description" tinted text={option.description} />
                  )}
                </Stack>
              )
            })}
          </Stack>
        </div>
      )}
    </div>
  )
}
