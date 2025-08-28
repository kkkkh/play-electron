<script setup lang="ts">
import type { Component } from 'vue'

const modules = import.meta.glob(['./components/*.vue'], {
  eager: true,
  import: 'default'
}) as Record<string, Component>

const components = Object.values(modules).map((value: Component) => {
  return {
    name: value?.name,
    component: value
  }
})
console.log('components', components)
</script>

<template>
  <!-- <ul>
    <li>electron</li> -->
  <ul>
    <li v-for="component in components" :key="component.name">
      <span>{{ component.name }} :</span>
      <component :is="component.component" />
    </li>
  </ul>
  <!-- </ul> -->
</template>
<style scoped>
ul div {
  margin-left: 30px;
}
</style>
