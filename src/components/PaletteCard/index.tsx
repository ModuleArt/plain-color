import { FC } from 'react'
import { IPaletteCardProps } from './props'
import { Stack } from '@/components/Stack'
import './index.scss'
import { Button } from '@/components/Button'
import { Trash, DotsThreeOutline, PlusSquare } from '@phosphor-icons/react'
import { Text } from '@/components/Text'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { IContextMenuShowMenuProps, useContextMenuStore } from '@/store/contextMenu.store'
import { useRightClick } from '@/hooks/useRightClick.hook'
import { useNavigate } from 'react-router-dom'

export const PaletteCard: FC<IPaletteCardProps> = ({ palette, onDelete, onDuplicate, onPaletteChange, ...props }) => {
  const contextMenuStore = useContextMenuStore()
  const navigate = useNavigate()

  const onLabelChange = (label: string) => {
    onPaletteChange && onPaletteChange({ ...palette, label })
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
      <Stack padding="medium">
        <Text text={palette.label} grow editable={!!onPaletteChange} onTextChange={onLabelChange} />
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
        <button className="palette-card__colors" onClick={openPalette}>
          {uniqueColors.map((color) => (
            <Stack grow className="palette-card__color" key={color} style={{ background: `#${color}` }} />
          ))}
        </button>
      )}
    </Stack>
  )
}
