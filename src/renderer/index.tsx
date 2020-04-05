import { DetailsPage } from "./DetailsPage"
import { PlayerPage } from "./PlayerPage"
import { SearchPage } from "./SearchPage"
import { TitleBar } from "./TitleBar"
import { getElectronProvider } from "./contexts/ElectronContext"
import { RouterContext, RouterProvider } from "./contexts/RouterContext"
import { SearchPluginsProvider } from "./contexts/SearchPluginsContext"

import React, { useContext } from "react"
import ReactDOM from "react-dom"

const ElectronProvider = getElectronProvider((data) =>
  window.ipcRenderer.send("ClientAppAction", data)
)

export const App = () => {
  const { page } = useContext(RouterContext)
  return (
    <>
      {page.name === "player" && <PlayerPage />}
      {page.name === "search" && <SearchPage />}
      {page.name === "details" && <DetailsPage />}
    </>
  )
}

ReactDOM.render(
  <RouterProvider>
    <SearchPluginsProvider>
      <ElectronProvider>
        <div
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <TitleBar />
          <div style={{ flexGrow: 1, overflowY: "auto", position: "relative" }}>
            <App />
          </div>
        </div>
      </ElectronProvider>
    </SearchPluginsProvider>
  </RouterProvider>,
  document.getElementById("app")
)
