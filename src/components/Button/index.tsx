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
  growLabel = false,
  tintedLabel = false,
  tintedIconPre = false,
  tintedIconPost = false,
  buttonRef,
  ...props
}) => {
  return (
    <button
      ref={buttonRef as any}
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
      onClick={(e) => onClick && onClick(e.nativeEvent)}
      title={props.nativeTooltip}
      style={{ maxWidth: maxWidth ? `${maxWidth}px` : '100%' }}
    >
      {iconPre && (
        <div className="button__icon button__icon--pre">{<Icon tinted={tintedIconPre} icon={iconPre} />}</div>
      )}
      {label && <Text tinted={tintedLabel} grow={growLabel} className="button__label" text={label} />}
      {iconPost && (
        <div className="button__icon button__icon--post">{<Icon tinted={tintedIconPost} icon={iconPost} />}</div>
      )}
    </button>
  )
}
