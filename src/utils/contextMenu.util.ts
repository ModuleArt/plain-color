export const disableDefaultContextMenu = () => {
  document.addEventListener('contextmenu', (event) => {
    const allowContextMenu = event.target ? (event.target as HTMLElement).closest('[data-allow-context-menu]') : null

    if (!allowContextMenu) {
      event.preventDefault()
    }
  })
}
