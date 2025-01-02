import { FC, useState } from 'react'
import { IColorCardProps } from './props'
import { Stack } from '@/components/Stack'
import './index.scss'
import { Button } from '@/components/Button'
import { Copy, Trash, PencilSimple, PlusSquare, DotsThreeOutline, Palette } from '@phosphor-icons/react'
import { Text } from '@/components/Text'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { isDark } from '@/utils/color'
import cn from 'classnames'
import { useSettingsStore } from '@/store/settings.store'
import { copyVariants, formatCopyText } from '@/utils/copyVariants.util'
import { ECopyVariant } from '@/types/settings.types'
import { commonComponentClasses } from '@/lib'
import { IContextMenuItem, IContextMenuShowMenuProps, useContextMenuStore } from '@/store/contextMenu.store'
import { usePalettesStore } from '@/store/palettes.store'
import { useRightClick } from '@/hooks/useRightClick.hook'

export const ColorCard: FC<IColorCardProps> = ({ color, onDelete, onEdit, onDuplicate, onColorChange, ...props }) => {
  const [copied, setCopied] = useState('')
  const settingsStore = useSettingsStore()
  const contextMenuStore = useContextMenuStore()
  const palettesStore = usePalettesStore()

  const copy = (copyVariant: ECopyVariant) => {
    if (!copied) {
      const text = formatCopyText(color.hex, copyVariant)
      writeText(text)

      setCopied(text)
      setTimeout(() => setCopied(''), 1000)
    }
  }

  const onLabelChange = (label: string) => {
    onColorChange && onColorChange({ ...color, label })
  }

  const quickCopyVariants = copyVariants.filter((variant) => settingsStore.quickCopyVariants.includes(variant.id))

  const showOptions = (menuProps: IContextMenuShowMenuProps) => {
    const menuItems: IContextMenuItem[] = [
      {
        icon: Copy,
        label: 'Copy',
        subMenuItems: copyVariants.map((copyVariant) => ({
          icon: Copy,
          label: copyVariant.label,
          onClick: () => copy(copyVariant.id),
        })),
      },
    ]

    if (onEdit) {
      menuItems.push({
        icon: PencilSimple,
        label: 'Edit',
        onClick: onEdit,
      })
    }

    if (palettesStore.palettes.length) {
      menuItems.push({
        icon: Palette,
        label: 'Save to palette',
        subMenuItems: palettesStore.palettes.map((palette) => ({
          icon: Palette,
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

    contextMenuStore.showMenu(menuProps, menuItems)
  }

  const rightClickRef = useRightClick((event) => {
    showOptions({ event, useMousePosition: true })
  })

  return (
    <Stack
      stackRef={rightClickRef}
      className={cn('color-card', { 'color-card--inverted': !isDark(color.hex) }, commonComponentClasses(props))}
    >
      <Stack grow dir="vertical" padding="medium" className="color-card__bg" style={{ background: `#${color.hex}` }}>
        {copied && (
          <Stack className="color-card__copied-overlay">
            <Stack
              padding="medium"
              grow
              justify="center"
              align="center"
              dir="vertical"
              style={{ background: `#${color.hex}` }}
            >
              <Text align="center" text={copied} />
            </Stack>
          </Stack>
        )}
        <Stack>
          <Text text={color.label} grow editable={!!onColorChange} onTextChange={onLabelChange} />
          <Button
            iconPre={DotsThreeOutline}
            variant="clear"
            size="inline"
            onClick={(event) => showOptions({ event })}
          />
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
          <Text text={color.hex} tinted transform="uppercase" pointerEvents="disable" />
        </Stack>
      </Stack>
    </Stack>
  )
}
