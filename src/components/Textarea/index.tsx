import { forwardRef, useImperativeHandle, useState } from 'react'
import { ITextareaProps, ITextareaRef } from './props'
import './index.scss'
import { Stack } from '@/components/Stack'
import { Text } from '@/components/Text'

export const Textarea = forwardRef<ITextareaRef, ITextareaProps>(({ value, readonly = false }, ref) => {
  const [overlayMessage, setOverlayMessage] = useState('')

  useImperativeHandle(ref, () => ({
    showOverlayMessage: (message) => {
      if (!overlayMessage) {
        setOverlayMessage(message)
        setTimeout(() => setOverlayMessage(''), 1000)
      }
    },
  }))

  return (
    <div className="textarea">
      {overlayMessage && (
        <Stack className="textarea__overlay">
          <Stack padding="medium" grow justify="center" align="center" dir="vertical">
            <Text align="center" text={overlayMessage} />
          </Stack>
        </Stack>
      )}
      <textarea tabIndex={-1} className="textarea__textarea" value={value} readOnly={readonly} />
    </div>
  )
})
