import { FC, useState, MouseEvent } from 'react'
import { IColorCardProps } from './props'
import { Stack } from '@/components/Stack'
import './index.scss'
import { Button } from '@/components/Button'
import { Copy, Trash, FloppyDisk, PencilSimple, PlusSquare, DotsThreeOutline } from '@phosphor-icons/react'
import { Text } from '@/components/Text'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { isDark } from '@/utils/color'
import cn from 'classnames'
import { useSettingsStore } from '@/store/settings.store'
import { copyVariants, formatCopyText } from '@/utils/copyVariants.util'
import { ECopyVariant } from '@/types/settings.types'
import { commonComponentClasses } from '@/lib'
import { IContextMenuItem, useContextMenuStore } from '@/store/contextMenu.store'
import { usePalettesStore } from '@/store/palettes.store'

export const ColorCard: FC<IColorCardProps> = ({
  color,
  onDelete,
  onEdit,
  onDuplicate,
  onColorChange,
  containerRef,
  ...props
}) => {
  const [copied, setCopied] = useState('')
  const settingsStore = useSettingsStore()
  const contextMenuStore = useContextMenuStore()
  const palettesStore = usePalettesStore()

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

  const showOptions = (event: MouseEvent) => {
    const menuItems: IContextMenuItem[] = []

    if (onEdit) {
      menuItems.push({
        icon: PencilSimple,
        label: 'Edit',
        onClick: onEdit,
      })
    }

    if (palettesStore.palettes.length) {
      menuItems.push({
        icon: FloppyDisk,
        label: 'Save to palette',
        subMenuItems: palettesStore.palettes.map((palette) => ({
          label: palette.label,
          onClick: () => {
            palettesStore.addColorToPalette(palette.id, color)
          },
        })),
      })
    }

    if (onDuplicate) {
      menuItems.push({
        icon: PlusSquare,
        label: 'Duplicate',
        onClick: onDuplicate,
      })
    }

    if (onDelete) {
      menuItems.push({
        icon: Trash,
        label: 'Delete',
        onClick: onDelete,
      })
    }

    contextMenuStore.showMenu({ x: event.clientX, y: event.clientY }, menuItems)
  }

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
        {(onEdit || onDuplicate || onDelete || palettesStore.palettes.length) && (
          <Button iconPre={DotsThreeOutline} variant="clear" size="inline" onClick={showOptions} />
        )}
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
