import { contextBridge, ipcRenderer} from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

console.log("Preload skripti işə düşdü!");
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    contextBridge.exposeInMainWorld('electronAPI', {
      toggleDarkMode: () => ipcRenderer.invoke('dark-mode:toggle'),
      runCode: (code: string) => ipcRenderer.invoke('run-code', code)
    })
  } catch (error) {
    console.error('Preload Error:', error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (fallback)
  window.electronAPI = {
    runCode: (code: string) => ipcRenderer.invoke('run-code', code)
  }
}
