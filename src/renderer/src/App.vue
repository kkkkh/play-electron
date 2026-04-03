<template>
  <p><strong>route path:</strong>{{ $route.fullPath }}</p>
  <div class="app">
    <nav>
      <RouterLink
        v-for="(route, index) in routes"
        :key="index"
        :class="{ 'router-current': $route.path === route.path }"
        :to="route.path"
        >{{ route.component.name }}</RouterLink
      >
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>
<script lang="ts" setup>
import { routes } from './router'

defineOptions({
  name: 'App'
})
</script>
<style scoped lang="scss">
.app {
  display: flex;
}
main {
  margin-left: 8px;
}
nav {
  width: 100px;
  a {
    text-decoration: none;
    display: block;
    background: #323232;
    color: white;
    padding: 4px;
    &:hover {
      background: #646464;
    }
  }
  .router-current {
    background: #646464;
  }
}
</style>
