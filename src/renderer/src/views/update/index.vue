<template>
  <p><strong>version:</strong> {{ currentVersion }}</p>
  <button @click="checkUpdateHandle">检查更新</button>
  <p>{{ hasLatestVersion ? `有新版本可用` : '' }}</p>
  <p v-if="downloadProgressRef">下载进度: {{ downloadProgressRef.percent }}%</p>
  <p>{{ newVersion }}</p>
  <br />
  <button @click="updateHandle">Update 增量</button>
  <br />
  <button @click="updateAllHandle">Update 全量</button>
</template>

<script lang="ts">
export const meta = {
  sort: 4
}
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Update'
})

const updateHandle = (): void => {
  window.electron.ipcRenderer.send('update')
}
const updateAllHandle = () => {
  window.electron.ipcRenderer.send('updateAll')
}

const checkUpdateHandle = () => {
  window.electron.ipcRenderer.send('checkUpdate')
}

const currentVersion = ref()
const getVersion = async () => {
  currentVersion.value = await window.electron.ipcRenderer.invoke('version')
}

onMounted(() => {
  getVersion()
})

const hasLatestVersion = ref(false)
const newVersion = ref()
const downloadProgressRef = ref()

window.electronAPI.app.onUpdateHasLatestVersion((val) => {
  hasLatestVersion.value = val
})

window.electronAPI.app.onUpdateAvailable((data) => {
  newVersion.value = data.version
})

window.electronAPI.app.onDownloadProgress((progress) => {
  downloadProgressRef.value = progress
})
</script>
<style lang="scss" scoped></style>
