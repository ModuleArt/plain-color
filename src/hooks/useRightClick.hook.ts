import { useEffect, useRef } from 'react'

export const useRightClick = (handleClick: (event: MouseEvent | TouchEvent) => void) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.setAttribute('contextmenu', '')
    ref.current?.addEventListener('contextmenu', handleClick)

    return () => {
      ref.current?.removeEventListener('contextmenu', handleClick)
    }
  }, [])

  return ref
}
