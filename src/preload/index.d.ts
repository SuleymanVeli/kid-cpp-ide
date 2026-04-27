import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    // Əgər preload-da 'electronAPI' yazmısansa, bura da onu yaz:
    electronAPI: {
      runCode: (code: string) => Promise<{ success: boolean; output: string }>
    }
    // Bunlar standart gələnlərdir, qala bilər:
    electron: ElectronAPI
    api: unknown
  }
}