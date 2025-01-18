export interface IPickerPreviewProps {
  colorHex: string
  onClick: () => void
  previewSize: number
  image: string
  showGuidelines?: boolean
  onZoomIn?: () => void
  onZoomOut?: () => void
}

export interface IPickerPreviewRef {
  showCursor: () => void
}
