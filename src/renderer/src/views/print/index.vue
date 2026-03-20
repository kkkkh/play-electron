<template>
  <button @click="printHandle">Print</button>
</template>
<script lang="ts">
export const meta = {
  sort: 2
}
</script>
<script lang="ts" setup>
defineOptions({
  name: 'Print'
})
const printHandle = async (): Promise<void> => {
  const res = await window.electron.ipcRenderer.invoke('print', 'id')
  console.log('res', res)
}
</script>
<style lang="scss" scoped></style>
