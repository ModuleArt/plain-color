import { FC, useState } from 'react'
import { IColorCardProps } from './props'
import { Stack } from '@/components/Stack'
import './index.scss'
import { Button } from '@/components/Button'
import { Copy, Trash, FloppyDisk, PencilSimple, PlusSquare } from '@phosphor-icons/react'
import { Text } from '@/components/Text'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { isDark } from '@/utils/color.util'
import cn from 'classnames'
import { useSettingsStore } from '@/store/settings.store'
import { copyVariants, formatCopyText } from '@/utils/copyVariants.util'
import { ECopyVariant } from '@/types/settings.types'
import { commonComponentClasses } from '@/lib'

export const ColorCard: FC<IColorCardProps> = ({
  color,
  onSave,
  onDelete,
  onEdit,
  onDuplicate,
  onColorChange,
  containerRef,
  ...props
}) => {
  const [copied, setCopied] = useState('')
  const settingsStore = useSettingsStore()

  const copy = (copyVariant: ECopyVariant) => {
    const text = formatCopyText(color.hex, copyVariant)
    writeText(text)

    setCopied(text)
    setTimeout(() => setCopied(''), 1000)
  }

  const onLabelChange = (label: string) => {
    onColorChange && onColorChange({ ...color, label })
  }

  const quickCopyVariants = copyVariants.filter((variant) => settingsStore.quickCopyVariants.includes(variant.id))

  return (
    <Stack
      containerRef={containerRef}
      dir="vertical"
      className={cn('color-card', { 'color-card--inverted': !isDark(color.hex) }, commonComponentClasses(props))}
      style={{ background: `#${color.hex}` }}
    >
      {copied && (
        <Stack
          justify="center"
          align="center"
          dir="vertical"
          className="color-card__copied-overlay"
          style={{ background: `#${color.hex}` }}
        >
          <Text text={copied} />
        </Stack>
      )}
      <Stack>
        <Text text={color.label} grow editable={!!onColorChange} onTextChange={onLabelChange} />
        <Stack>
          {onEdit && (
            <Button
              iconPre={PencilSimple}
              variant="clear"
              size="inline"
              onClick={() => onEdit()}
              nativeTooltip="Edit"
            />
          )}
          {onSave && (
            <Button
              iconPre={FloppyDisk}
              variant="clear"
              size="inline"
              onClick={() => onSave()}
              nativeTooltip="Add to palette"
            />
          )}
          {onDuplicate && (
            <Button
              iconPre={PlusSquare}
              variant="clear"
              size="inline"
              onClick={() => onDuplicate()}
              nativeTooltip="Duplicate"
            />
          )}
          {onDelete && (
            <Button iconPre={Trash} variant="clear" size="inline" onClick={() => onDelete()} nativeTooltip="Delete" />
          )}
        </Stack>
      </Stack>
      <Stack>
        <Stack grow wrap gap="none" className="color-card__copy-variants">
          {quickCopyVariants.map((copyVariant) => (
            <Button
              key={copyVariant.id}
              label={copyVariant.label}
              size="inline"
              variant="clear"
              iconPre={Copy}
              tinted
              onClick={() => copy(copyVariant.id)}
              nativeTooltip={copyVariant.label}
            />
          ))}
        </Stack>
        <Text text={color.hex} tinted transform="uppercase" />
      </Stack>
    </Stack>
  )
}
