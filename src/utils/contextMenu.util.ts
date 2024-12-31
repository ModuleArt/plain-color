export const disableDefaultContextMenu = () => {
  document.addEventListener('contextmenu', (event) => {
    if (event.target) {
      const target = event.target as any

      // console.log(target)

      // if (target.nodeName !== 'INPUT' && target.nodeName !== 'TEXTAREA' && target.type !== 'text') {
      //   event.preventDefault()
      // }
    }
  })
}
