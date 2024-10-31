import { ItIconComponent } from 'design-angular-kit'

const load = async (src: string) => {
  const element = document.createElement('div')
  element.style.display = 'none'
  element.innerHTML = await (await fetch(src)).text()
  document.body.appendChild(element)
}

export const loadIcons = (src: string) => {
  Object.defineProperty(ItIconComponent.prototype, 'iconHref', {
    get: function () {
      return '#it-' + this.name
    },
  })
  return load(src)
}
