let registered = false

export function registerMainIpc(): void {
  if (registered) return

  const modules = import.meta.glob('./modules/*.ts', { eager: true })

  for (const key of Object.keys(modules)) {
    const module = modules[key] as { register?: () => void }

    if (module.register) {
      module.register()
    }
  }

  registered = true
}

export function unregisterMainIpc(): void {
  if (!registered) return

  const modules = import.meta.glob('./modules/*.ts', { eager: true })

  for (const key of Object.keys(modules)) {
    const module = modules[key] as { unregister?: () => void }

    if (module.unregister) {
      module.unregister()
    }
  }

  registered = false
}
