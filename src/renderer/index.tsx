import React from "react"
import ReactDOM from "react-dom"

import { App } from "./App"
import { getElectronProvider } from "./contexts/ElectronContext"
import { RouterProvider } from "./contexts/RouterContext"

const ElectronProvider = getElectronProvider((data) =>
  window.ipcRenderer.send("ClientAppAction", data)
)

ReactDOM.render(
  <RouterProvider>
    <ElectronProvider>
      <App />
    </ElectronProvider>
  </RouterProvider>,
  document.getElementById("app")
)
