import { FC } from 'react'
import { IColorCardProps } from './props'
import { Stack } from '@/components/Stack'
import './index.scss'
import { Button } from '@/components/Button'
import { Copy, Trash, FloppyDisk } from '@phosphor-icons/react'
import { Text } from '@/components/Text'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { hexToRgbStr } from '@/utils/color'

export const ColorCard: FC<IColorCardProps> = ({ color, onSave, onDelete }) => {
  return (
    <Stack dir="vertical" className="color-card" style={{ background: `#${color.hex}` }}>
      <Stack>
        <Stack grow>
          <Text text={color.label} />
          <Text text={color.hex} tinted transform="uppercase" />
        </Stack>
        <Stack>
          <Button icon={FloppyDisk} variant="clear" size="inline" onClick={() => onSave && onSave()} />
          <Button icon={Trash} variant="clear" size="inline" onClick={() => onDelete && onDelete()} />
        </Stack>
      </Stack>
      <Stack>
        <Button
          label="HEX"
          size="inline"
          variant="clear"
          icon={Copy}
          tinted
          onClick={() => writeText(`#${color.hex}`)}
        />
        <Button
          label="RGB"
          size="inline"
          variant="clear"
          icon={Copy}
          tinted
          onClick={() => {
            const rgb = hexToRgbStr(color.hex)
            writeText(rgb)
          }}
        />
      </Stack>
    </Stack>
  )
}
