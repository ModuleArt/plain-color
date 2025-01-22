export interface ITextareaProps {
  value: string
  readonly?: boolean
}

export interface ITextareaRef {
  showOverlayMessage: (message: string) => void
}
