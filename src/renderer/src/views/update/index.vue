<template>
  <button @click="updateHandle">Update test</button>
</template>

<script lang="ts">
export const meta = {
  sort: 4
}
</script>

<script lang="ts" setup>
defineOptions({
  name: 'Update'
})

const updateHandle = (): void => {
  window.electron.ipcRenderer.send('update')
}
</script>
<style lang="scss" scoped></style>
