import { FC, useMemo, useState } from 'react'
import { IPaletteCardProps } from './props'
import { Stack } from '@/components/Stack'
import './index.scss'
import { Button } from '@/components/Button'
import { Trash, DotsThreeOutline, PlusSquare, Copy } from '@phosphor-icons/react'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { IContextMenuShowMenuProps, useContextMenuStore } from '@/store/contextMenu.store'
import { useRightClick } from '@/hooks/useRightClick.hook'
import { useNavigate } from 'react-router-dom'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { copyVariants, formatCopyText } from '@/utils/copyVariants.util'
import { useSettingsStore } from '@/store/settings.store'
import { Text } from '@/components/Text'
import { hexWithoutAlpha, isDark } from '@/utils/color'
import { ECopyVariant } from '@/types/settings.types'

export const PaletteCard: FC<IPaletteCardProps> = ({ palette, onDelete, onDuplicate, ...props }) => {
  const [copied, setCopied] = useState<{ colorHex: string; text: string } | null>(null)
  const contextMenuStore = useContextMenuStore()
  const navigate = useNavigate()
  const settingsStore = useSettingsStore()

  const copy = (copyVariant: ECopyVariant, colorHex: string) => {
    if (!copied) {
      const text = formatCopyText(colorHex, copyVariant)
      writeText(text)

      setCopied({ text, colorHex })
      setTimeout(() => setCopied(null), 1000)
    }
  }

  const uniqueColors = useMemo(
    () =>
      palette.colors
        .map((color) => color.hex)
        .filter((value, index, array) => array.indexOf(value) === index)
        .slice(0, 24),
    [palette.colors]
  )

  const showPaletteOptions = (menuProps: IContextMenuShowMenuProps) => {
    contextMenuStore.showMenu(menuProps, [
      {
        icon: PlusSquare,
        label: 'Duplicate',
        onClick: onDuplicate,
      },
      {
        icon: Trash,
        label: 'Delete',
        onClick: onDelete,
      },
    ])
  }

  const showColorOptions = (menuProps: IContextMenuShowMenuProps, colorHex: string) => {
    contextMenuStore.showMenu(menuProps, [
      {
        icon: Copy,
        label: 'Copy',
        subMenuItems: copyVariants.map((copyVariant) => ({
          icon: Copy,
          label: copyVariant.label,
          onClick: () => copy(copyVariant.id, colorHex),
        })),
      },
    ])
  }

  const paletteRightClickRef = useRightClick((event) => {
    showPaletteOptions({ event, useMousePosition: true })
  })

  const colorRightClickRefs = uniqueColors.map((colorHex) =>
    useRightClick((event) => {
      showColorOptions({ event, useMousePosition: true }, colorHex)
    })
  )

  const openPalette = () => {
    navigate(`/palettes/${palette.id}`)
  }

  return (
    <Stack gap="none" dir="vertical" className={cn('palette-card', commonComponentClasses(props))}>
      {copied && (
        <Stack
          className={cn('palette-card__copied-overlay', {
            'palette-card__copied-overlay--inverted': !isDark(copied.colorHex),
          })}
        >
          <Stack
            padding="medium"
            grow
            justify="center"
            align="center"
            dir="vertical"
            style={{
              background: `linear-gradient(to top, #${copied.colorHex}, #${hexWithoutAlpha(copied.colorHex)})`,
            }}
          >
            <Text align="center" text={copied.text} />
          </Stack>
        </Stack>
      )}
      <Stack padding="medium" stackRef={paletteRightClickRef}>
        <Button label={palette.label} grow justify="start" size="inline" onClick={openPalette} />
        <Stack>
          <Button
            iconPre={DotsThreeOutline}
            variant="clear"
            size="inline"
            onClick={(event) => showPaletteOptions({ event })}
          />
        </Stack>
      </Stack>
      <Stack gap="none" className="palette-card__colors">
        {uniqueColors.length === 0 && (
          <button className="palette-card__color" onClick={openPalette}>
            <div className="palette-card__color-bg" />
            <Text text="Empty" tinted size="small" />
          </button>
        )}
        {uniqueColors.map((color, index) => (
          <button
            className="palette-card__color"
            key={color}
            onClick={() => copy(settingsStore.defaultCopyVariant, color)}
          >
            <div
              ref={colorRightClickRefs[index]}
              className="palette-card__color-bg"
              style={{
                background: `linear-gradient(to top, #${color}, #${hexWithoutAlpha(color)})`,
              }}
            />
          </button>
        ))}
      </Stack>
    </Stack>
  )
}
