import { FC, useState } from 'react'
import { IColorCardProps } from './props'
import { Stack } from '@/components/Stack'
import './index.scss'
import { Button } from '@/components/Button'
import { Copy, Trash, FloppyDisk, PencilSimple } from '@phosphor-icons/react'
import { Text } from '@/components/Text'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { hexToRgbStr, isDark } from '@/utils/color'
import cn from 'classnames'

export const ColorCard: FC<IColorCardProps> = ({ color, onSave, onDelete, onEdit }) => {
  const [copied, setCopied] = useState('')

  const copyHex = () => {
    const text = `#${color.hex}`
    writeText(text)

    setCopied(text)
    setTimeout(() => setCopied(''), 1000)
  }

  const copyRgb = () => {
    const text = hexToRgbStr(color.hex)
    writeText(text)

    setCopied(text)
    setTimeout(() => setCopied(''), 1000)
  }

  return (
    <Stack
      dir="vertical"
      className={cn('color-card', { 'color-card--inverted': !isDark(color.hex) })}
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
        <Stack grow>
          <Text text={color.label} />
          <Text text={color.hex} tinted transform="uppercase" />
        </Stack>
        <Stack>
          {onEdit && <Button icon={PencilSimple} variant="clear" size="inline" onClick={() => onEdit()} />}
          {onSave && <Button icon={FloppyDisk} variant="clear" size="inline" onClick={() => onSave()} />}
          {onDelete && <Button icon={Trash} variant="clear" size="inline" onClick={() => onDelete()} />}
        </Stack>
      </Stack>
      <Stack>
        <Button label="HEX" size="inline" variant="clear" icon={Copy} tinted onClick={copyHex} />
        <Button label="RGB" size="inline" variant="clear" icon={Copy} tinted onClick={copyRgb} />
      </Stack>
    </Stack>
  )
}
