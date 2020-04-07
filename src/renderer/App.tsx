import CheckBoxOutlineBlankSharpIcon from "@material-ui/icons/CheckBoxOutlineBlankSharp"
import CloseIcon from "@material-ui/icons/Close"
import MinimizeIcon from "@material-ui/icons/Minimize"
import React, { useContext, useEffect } from "react"

import { TitleBarRouter, AppRouter, SideMenuRouter } from "./AppRouter"
import { MenuButton } from "./MenuButton"
import { ElectronContext } from "./contexts/ElectronContext"
import { RouterContext } from "./contexts/RouterContext"

export const App = () => {
  const { sendMessage } = useContext(ElectronContext)

  useEffect(() => {
    sendMessage({ type: "front-ready" })
  }, [])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "relative",
      }}
    >
      <TitleBar />

      <div style={{ flexGrow: 1, overflowY: "auto", position: "relative" }}>
        <AppRouter />
      </div>

      <SideMenu />
    </div>
  )
}

const TitleBar = () => {
  const { sendMessage } = useContext(ElectronContext)

  return (
    <div className="title-bar">
      <div className="menu-button-container">
        <div className="menu-button-container-wrapper">
          <TitleBarRouter />
        </div>
      </div>
      <div className="app-name-container">
        <h3>Biskott</h3>
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

const SideMenu = () => {
  const { isMenuOpen, toggleMenu } = useContext(RouterContext)
  return (
    (isMenuOpen && (
      <>
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            background: "black",
            opacity: 0.6,
          }}
          onClick={toggleMenu}
        ></div>
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: 400,
            background: "grey",
          }}
        >
          <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
            <MenuButton /> <h3>Options</h3>
          </div>
          <SideMenuRouter />
        </div>
      </>
    )) || <></>
  )
}
