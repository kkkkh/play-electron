<template>
  <button @click="ipcHandle">Send IPC</button>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'SendIpc'
})
const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>
<style lang="scss" scoped></style>
