import React from "react"
import ReactDOM from "react-dom"

import { App } from "./App"
import { getElectronProvider } from "./contexts/ElectronContext"
import { RouterProvider } from "./contexts/RouterContext"

const ElectronProvider = getElectronProvider((data) => {
  console.log("CLIENT -> APP", data)
  return window.ipcRenderer.send("ClientAppAction", data)
})

ReactDOM.render(
  <ElectronProvider>
    <RouterProvider>
      <App />
    </RouterProvider>
  </ElectronProvider>,
  document.getElementById("app")
)
