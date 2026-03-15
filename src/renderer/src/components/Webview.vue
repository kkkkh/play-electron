<template>
  <div>
    <ul>
      <li>
        两种方式清除 localStorage
        <button @click="executeJavaScriptClear">executeJavaScriptClear</button>
        &nbsp;
        <button @click="sessionClear">sessionClear</button>
      </li>
      <li>
        调用主进程方法
        <button @click="getPreloadPath">getPreloadPath</button>
      </li>
      <li>
        webview页面
        <webview
          ref="webviewRef"
          style="width: 600px; height: 300px; margin: 10px 0 0 10px"
          partition="persist:webview"
          src="http://127.0.0.1:5500/src/renderer/src/files/index.html"
          disablewebsecurity
          :preload="preloadPath"
        />
      </li>
    </ul>
    <!-- // #regin webviewRef -->

    <!-- // #endregin webviewRef -->
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { WebviewTag } from 'electron'

defineOptions({
  name: 'Webview'
})
// 清除 localStorage
const executeJavaScriptClear = (): void => {
  webviewRef.value?.executeJavaScript('localStorage.clear()')?.then(() => {
    console.log('clear localStorage')
  })
}
const sessionClear = (): void => {
  window.electron.ipcRenderer.send('clearLocalStorage')
}

// getPreloadPath
const getPreloadPath = (): void => {
  // 调用主线程方法
  console.log('window.electronAPI.app.getPreloadPath', window.electronAPI.app.getPreloadPath())
}
const preloadPath = window.electronAPI.app.getPreloadPath()

// 调试
const webviewRef = ref<WebviewTag | null>(null)
const handleDomReady = (): void => {
  // 开启调试
  // webviewRef.value?.openDevTools()
}
onMounted(() => {
  webviewRef.value?.addEventListener('dom-ready', handleDomReady)
})
</script>
<style lang="scss" scoped></style>
