import { useEffect, useRef, useCallback } from 'react'

export const useRightClick = (handleClick: (event: MouseEvent | TouchEvent) => void) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      handleClick(event)
    },
    [handleClick]
  )

  useEffect(() => {
    const element = ref.current

    if (element) {
      element.setAttribute('data-allow-context-menu', '')

      element.addEventListener('contextmenu', handleContextMenu)

      return () => {
        element.removeEventListener('contextmenu', handleContextMenu)
      }
    }
  }, [handleContextMenu])

  return ref
}
