import { FC } from 'react'
import './index.scss'
import { IButtonProps } from './props'
import { Icon } from '@/components/Icon'
import cn from 'classnames'
import { Text } from '@/components/Text'

export const Button: FC<IButtonProps> = ({
  icon,
  onClick,
  tinted = false,
  label,
  variant = 'fill',
  size = 'regular',
  grow = false,
}) => {
  return (
    <button
      className={cn('button', [`button--variant-${variant}`], [`button--size-${size}`], {
        'button--tinted': tinted,
        'button--grow': grow,
      })}
      onClick={() => onClick && onClick()}
    >
      {icon && <div className="button__icon">{<Icon icon={icon} />}</div>}
      {label && <Text className="button__label" text={label} />}
    </button>
  )
}