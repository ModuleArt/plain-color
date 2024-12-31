import { FC } from 'react'
import { IPaletteCardProps } from './props'
import { Stack } from '@/components/Stack'
import './index.scss'
import { Button } from '@/components/Button'
import { Trash, DotsThreeOutline, PlusSquare } from '@phosphor-icons/react'
import { Text } from '@/components/Text'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { useContextMenuStore } from '@/store/contextMenu.store'

export const PaletteCard: FC<IPaletteCardProps> = ({ palette, onDelete, onDuplicate, onPaletteChange, ...props }) => {
  const contextMenuStore = useContextMenuStore()

  const onLabelChange = (label: string) => {
    onPaletteChange && onPaletteChange({ ...palette, label })
  }

  const uniqueColors = palette.colors
    .map((color) => color.hex)
    .filter((value, index, array) => array.indexOf(value) === index)

  const showOptions = (event: MouseEvent) => {
    contextMenuStore.showMenu({ event }, [
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

  return (
    <Stack gap="none" dir="vertical" className={cn('palette-card', commonComponentClasses(props))}>
      <Stack padding="medium">
        <Text text={palette.label} grow editable={!!onPaletteChange} onTextChange={onLabelChange} />
        <Stack>
          <Button iconPre={DotsThreeOutline} variant="clear" size="inline" onClick={showOptions} />
        </Stack>
      </Stack>
      {uniqueColors.length > 0 && (
        <Stack gap="none" className="palette-card__colors">
          {uniqueColors.map((color) => (
            <Stack grow className="palette-card__color" key={color} style={{ background: `#${color}` }} />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
