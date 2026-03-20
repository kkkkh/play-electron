import type { Component } from 'vue'

export type ModuleType = {
  default: Component
  meta: {
    sort?: number
  }
}
