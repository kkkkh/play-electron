import { createMemoryHistory, createRouter } from 'vue-router'

import type { ModuleType } from '@renderer/types/module'

const pages = import.meta.glob(['../views/**/index.vue'], {
  eager: true
}) as Record<string, ModuleType>

export const routes = Object.values(pages)
  .sort((modA, modB) => {
    return (modA.meta?.sort ?? 0) - (modB.meta?.sort ?? 0)
  })
  .map((item) => {
    return {
      path: `/${item.default.name}`,
      component: item.default
    }
  })

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
