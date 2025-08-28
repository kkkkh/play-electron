<template>
  <button @click="appGetPathHandle">app getPath</button>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'AppGetPath'
})
const appGetPathHandle = (): void => window.electron.ipcRenderer.send('appGetPath')
</script>
<style lang="scss" scoped></style>
