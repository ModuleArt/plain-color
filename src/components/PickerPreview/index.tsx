import { FC, useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'

export const PickerPreview: FC = () => {
  const [image, setImage] = useState('')

  useEffect(() => {
    listen<string>('image_received', (event) => {
      setImage(event.payload)
    })
  }, [])

  return (
    <div>
      <img src={image} />
    </div>
  )
}
