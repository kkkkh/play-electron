<template>
  <div>
    webview vue组件
    <button @click="executeJavaScriptClear">executeJavaScriptClear</button>
    <button @click="sessionClear">sessionClear</button>
    <button @click="getPreloadPath">getPreloadPath</button>
    <webview
      ref="webviewRef"
      style="width: 600px; height: 300px; margin: 10px 0 0 10px"
      partition="persist:webview"
      src="http://127.0.0.1:5500/src/renderer/src/files/index.html"
      disablewebsecurity
      :preload="preloadPath"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { WebviewTag } from 'electron'
defineOptions({
  name: 'Webview'
})
const webviewRef = ref<WebviewTag | null>(null)

const executeJavaScriptClear = (): void => {
  webviewRef.value?.executeJavaScript('localStorage.clear()')?.then(() => {
    console.log('clear localStorage')
  })
}

const sessionClear = (): void => {
  window.electron.ipcRenderer.send('clearLocalStorage')
}
const getPreloadPath = (): void => {
  console.log('window.electronAPI.app.getPreloadPath', window.electronAPI.app.getPreloadPath())
}
const preloadPath = window.electronAPI.app.getPreloadPath()

const handleDomReady = (): void => {
  // webviewRef.value?.openDevTools()
}
onMounted(() => {
  webviewRef.value?.addEventListener('dom-ready', handleDomReady)
})
</script>
<style lang="scss" scoped></style>
