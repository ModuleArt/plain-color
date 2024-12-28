import { FC } from 'react'
import './index.scss'
import { IButtonProps } from './props'
import { Icon } from '@/components/Icon'
import cn from 'classnames'
import { Text } from '@/components/Text'
import { commonComponentClasses } from '@/lib'

export const Button: FC<IButtonProps> = ({
  iconPre,
  iconPost,
  onClick,
  tinted = false,
  label,
  variant = 'fill',
  size = 'regular',
  padding = 'none',
  justify = 'center',
  maxWidth = 0,
  textWrap = false,
  containerRef,
  ...props
}) => {
  return (
    <button
      ref={containerRef}
      className={cn(
        'button',
        [`button--variant-${variant}`],
        [`button--size-${size}`],
        [`button--padding-${padding}`],
        [`button--justify-${justify}`],
        {
          'button--tinted': tinted,
          'button--no-text-wrap': !textWrap,
        },
        commonComponentClasses(props)
      )}
      onClick={() => onClick && onClick()}
      title={props.nativeTooltip}
      style={{ maxWidth: maxWidth ? `${maxWidth}px` : '100%' }}
    >
      {iconPre && <div className="button__icon button__icon--pre">{<Icon icon={iconPre} />}</div>}
      {label && <Text className="button__label" text={label} />}
      {iconPost && <div className="button__icon button__icon--post">{<Icon icon={iconPost} />}</div>}
    </button>
  )
}
