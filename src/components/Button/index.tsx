import { FC } from 'react'
import './index.scss'
import { IButtonProps } from './props'
import { Icon } from '@/components/Icon'
import cn from 'classnames'
import { Text } from '@/components/Text'
import { commonComponentClasses } from '@/lib'

export const Button: FC<IButtonProps> = ({
  icon,
  onClick,
  tinted = false,
  label,
  variant = 'fill',
  size = 'regular',
  padding = 'none',
  ...props
}) => {
  return (
    <button
      className={cn(
        'button',
        [`button--variant-${variant}`],
        [`button--size-${size}`],
        [`button--padding-${padding}`],
        {
          'button--tinted': tinted,
        },
        commonComponentClasses(props)
      )}
      onClick={() => onClick && onClick()}
    >
      {icon && <div className="button__icon">{<Icon icon={icon} />}</div>}
      {label && <Text className="button__label" text={label} />}
    </button>
  )
}
