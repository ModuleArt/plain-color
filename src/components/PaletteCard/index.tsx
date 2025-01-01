import { FC, useState } from 'react'
import { IPaletteCardProps } from './props'
import { Stack } from '@/components/Stack'
import './index.scss'
import { Button } from '@/components/Button'
import { Trash, DotsThreeOutline, PlusSquare } from '@phosphor-icons/react'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { IContextMenuShowMenuProps, useContextMenuStore } from '@/store/contextMenu.store'
import { useRightClick } from '@/hooks/useRightClick.hook'
import { useNavigate } from 'react-router-dom'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { formatCopyText } from '@/utils/copyVariants.util'
import { useSettingsStore } from '@/store/settings.store'
import { Text } from '@/components/Text'
import { isDark } from '@/utils/color'

export const PaletteCard: FC<IPaletteCardProps> = ({ palette, onDelete, onDuplicate, ...props }) => {
  const [copied, setCopied] = useState<{ colorHex: string; text: string } | null>(null)
  const contextMenuStore = useContextMenuStore()
  const navigate = useNavigate()
  const settingsStore = useSettingsStore()

  const copy = (colorHex: string) => {
    if (!copied) {
      const text = formatCopyText(colorHex, settingsStore.defaultCopyVariant)
      writeText(text)

      setCopied({ text, colorHex })
      setTimeout(() => setCopied(null), 1000)
    }
  }

  const uniqueColors = palette.colors
    .map((color) => color.hex)
    .filter((value, index, array) => array.indexOf(value) === index)

  const showOptions = (menuProps: IContextMenuShowMenuProps) => {
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

  const rightClickRef = useRightClick((event) => {
    showOptions({ event, useMousePosition: true })
  })

  const openPalette = () => {
    navigate(`/palettes/${palette.id}`)
  }

  return (
    <Stack
      stackRef={rightClickRef}
      gap="none"
      dir="vertical"
      className={cn('palette-card', commonComponentClasses(props))}
    >
      {copied && (
        <Stack
          padding="medium"
          justify="center"
          align="center"
          dir="vertical"
          className={cn('palette-card__copied-overlay', {
            'palette-card__copied-overlay--inverted': !isDark(copied.colorHex),
          })}
          style={{ background: `#${copied.colorHex}` }}
        >
          <Text align="center" text={copied.text} />
        </Stack>
      )}
      <Stack padding="medium">
        <Button label={palette.label} grow justify="start" size="inline" onClick={openPalette} />
        <Stack>
          <Button
            iconPre={DotsThreeOutline}
            variant="clear"
            size="inline"
            onClick={(event) => showOptions({ event })}
          />
        </Stack>
      </Stack>
      {uniqueColors.length > 0 && (
        <Stack gap="none">
          {uniqueColors.map((color) => (
            <button
              className="palette-card__color"
              key={color}
              style={{ background: `#${color}` }}
              onClick={() => copy(color)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
