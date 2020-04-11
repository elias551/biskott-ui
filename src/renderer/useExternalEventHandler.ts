import { IpcRendererEvent } from "electron"
import { useEffect } from "react"

import { ElectronAppEvent } from "@/@types"

export const useExternalEventHandler = (
  onEvent: (event: ElectronAppEvent) => void
) => {
  useEffect(() => {
    const handler = (event: IpcRendererEvent, data: ElectronAppEvent) => {
      onEvent(data)
    }
    window.ipcRenderer.on("ElectronAppEvent", handler)
    return () => {
      window.ipcRenderer.off("ElectronAppEvent", handler)
    }
  }, [])
}
