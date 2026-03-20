<script lang="ts">
export const meta = {
  sort: 1
}
</script>

<script setup lang="ts">
import type { ModuleType } from '@renderer/types/module'

defineOptions({
  name: 'Test'
})

const modules = import.meta.glob(['./components/**/*.vue'], {
  eager: true
}) as Record<string, ModuleType>

const components = Object.values(modules)
  .sort((modA, modB) => {
    return (modA.meta?.sort ?? 0) - (modB.meta?.sort ?? 0)
  })
  .map((mod) => {
    return {
      name: mod.default.name,
      component: mod.default
    }
  })
</script>

<template>
  <!-- <ul>
    <li>electron</li> -->
  <ul>
    <li v-for="item in components" :key="item.name">
      <span>{{ item.name }} :</span>
      <component :is="item.component" />
    </li>
  </ul>
  <!-- </ul> -->
</template>
<style scoped lang="scss">
ul {
  margin-left: 0px;
  // padding: 0px;
  li {
    margin-left: 10px;
    display: block;
  }
}
</style>
