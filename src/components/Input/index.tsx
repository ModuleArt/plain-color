import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { IInputProps } from './props'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { useRightClick } from '@/hooks/useRightClick.hook'
import { mergeRefs } from 'react-merge-refs'
import { IContextMenuItem, IContextMenuShowMenuProps, useContextMenuStore } from '@/store/contextMenu.store'
import { Scissors, Copy, File } from '@phosphor-icons/react'
import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager'

export const Input: FC<IInputProps> = ({
  value,
  onChange,
  onBlur,
  autoComplete,
  autoCapitalize,
  autoCorrect,
  onKeyDown,
  handleDefaultKeyboardShortcuts = false,
  inputRef,
  ...props
}) => {
  const localRef = useRef<HTMLInputElement>(null)
  const contextMenuStore = useContextMenuStore()
  const [pauseOnBlur, setPauseOnBlur] = useState(false)

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown && onKeyDown(event)

    if (handleDefaultKeyboardShortcuts) {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'x':
            onCut()
            break
          case 'c':
            onCopy()
            break
          case 'v':
            onPaste()
            break
          case 'a':
            onSelectAll()
            break
        }
      }
    }
  }

  const onSelectAll = async () => {
    if (localRef.current) {
      localRef.current.select()
    }

    if (pauseOnBlur && onBlur) onBlur()
    setPauseOnBlur(false)
  }

  const onCut = async () => {
    if (localRef.current) {
      const start = localRef.current.selectionStart || 0
      const end = localRef.current.selectionEnd || 0
      const selection = localRef.current.value.substring(start, end)

      await writeText(selection)

      const newValue = localRef.current.value.slice(0, start) + localRef.current.value.slice(end)
      onChange && onChange(newValue)

      // fix cursor position
      setTimeout(() => localRef.current?.setSelectionRange(start, start))
    }

    if (pauseOnBlur && onBlur) onBlur()
    setPauseOnBlur(false)
  }

  const onCopy = async () => {
    if (localRef.current) {
      const start = localRef.current.selectionStart || 0
      const end = localRef.current.selectionEnd || 0
      const selection = localRef.current.value.substring(start, end)
      await writeText(selection)
    }

    if (pauseOnBlur && onBlur) onBlur()
    setPauseOnBlur(false)
  }

  const onPaste = async () => {
    if (localRef.current) {
      const textToPaste = await readText()
      const start = localRef.current.selectionStart || 0
      const end = localRef.current.selectionEnd || 0
      const newValue = localRef.current.value.slice(0, start) + textToPaste + localRef.current.value.slice(end)
      onChange && onChange(newValue)

      // fix cursor position
      const nextCursorPos = start + textToPaste.length
      setTimeout(() => localRef.current?.setSelectionRange(nextCursorPos, nextCursorPos))
    }

    if (pauseOnBlur && onBlur) onBlur()
    setPauseOnBlur(false)
  }

  const showOptions = (menuProps: IContextMenuShowMenuProps) => {
    setPauseOnBlur(true)

    const menuItems: IContextMenuItem[] = []

    const start = localRef.current?.selectionStart || 0
    const end = localRef.current?.selectionEnd || 0
    const selection = localRef.current?.value.substring(start, end) || ''

    if (selection) {
      menuItems.push({
        icon: Scissors,
        label: 'Cut',
        onClick: onCut,
      })
      menuItems.push({
        icon: Copy,
        label: 'Copy',
        onClick: onCopy,
      })
    }

    menuItems.push({
      icon: File,
      label: 'Paste',
      onClick: onPaste,
    })

    contextMenuStore.showMenu(menuProps, menuItems)
  }

  const rightClickRef = useRightClick((event) => {
    showOptions({ event, useMousePosition: true })
  })

  const handleBlur = () => {
    if (pauseOnBlur) {
      localRef.current?.focus()
    } else {
      onBlur && onBlur()
    }
  }

  useEffect(() => {
    if (!contextMenuStore.menuItems.length) {
      setPauseOnBlur(false)
    }
  }, [contextMenuStore.menuItems.length])

  return (
    <input
      ref={mergeRefs([inputRef, localRef, rightClickRef])}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      onBlur={handleBlur}
      autoComplete={autoComplete}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      onKeyDown={handleKeyDown}
      className={cn('input', commonComponentClasses(props))}
    />
  )
}
