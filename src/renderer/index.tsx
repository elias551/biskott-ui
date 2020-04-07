import React from "react"
import ReactDOM from "react-dom"

import { App } from "./App"
import { getElectronProvider } from "./contexts/ElectronContext"
import { RouterProvider } from "./contexts/RouterContext"
import { SearchPluginsProvider } from "./contexts/SearchPluginsContext"

const ElectronProvider = getElectronProvider((data) =>
  window.ipcRenderer.send("ClientAppAction", data)
)

ReactDOM.render(
  <RouterProvider>
    <SearchPluginsProvider>
      <ElectronProvider>
        <App />
      </ElectronProvider>
    </SearchPluginsProvider>
  </RouterProvider>,
  document.getElementById("app")
)
