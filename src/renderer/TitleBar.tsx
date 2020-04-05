import { DetailsToolBar } from "./DetailsPage"
import { PlayerToolBar } from "./PlayerPage"
import { SearchToolBar } from "./SearchPage"
import { ElectronContext } from "./contexts/ElectronContext"
import { RouterContext } from "./contexts/RouterContext"

import CheckBoxOutlineBlankSharpIcon from "@material-ui/icons/CheckBoxOutlineBlankSharp"
import CloseIcon from "@material-ui/icons/Close"
import MinimizeIcon from "@material-ui/icons/Minimize"
import React, { useContext } from "react"

export const TitleBar = () => {
  const { page } = useContext(RouterContext)
  const { sendMessage } = useContext(ElectronContext)

  return (
    <div className="title-bar">
      <div className="menu-button-container">
        <div className="menu-button-container-wrapper">
          {page.name === "search" && <SearchToolBar />}
          {page.name === "details" && (
            <DetailsToolBar searchResult={page.searchResult} />
          )}
          {page.name === "player" && (
            <PlayerToolBar searchResult={page.searchResult} />
          )}
        </div>
      </div>
      <div className="app-name-container">
        <p>Peerflix</p>
      </div>
      <div className="window-controls-container" style={{ fontSize: 15 }}>
        <div
          className="titlebar-button minimize-button"
          onClick={() => sendMessage({ type: "minimize-window" })}
        >
          <MinimizeIcon fontSize="inherit" />
        </div>
        <div
          className="titlebar-button"
          onClick={() => sendMessage({ type: "maximize-window" })}
        >
          <CheckBoxOutlineBlankSharpIcon fontSize="inherit" />
        </div>
        <div
          className="titlebar-button close-button"
          onClick={() => sendMessage({ type: "close-app" })}
        >
          <CloseIcon fontSize="inherit" />
        </div>
      </div>
    </div>
  )
}
