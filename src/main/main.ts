import path from "path"
import url from "url"

import { app, BrowserWindow, ipcMain } from "electron"

import { ClientAppAction } from "@/@types"

import { AppEventManager } from "./AppEventManager"

app.allowRendererProcessReuse = true
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  let mainWindow: Electron.BrowserWindow | null

  function createWindow() {
    mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      minWidth: 600,
      minHeight: 400,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        devTools: process.env.NODE_ENV !== "production",
      },
      autoHideMenuBar: true,
      frame: false,
    })

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "./index.html"),
        protocol: "file:",
        slashes: true,
      })
    )

    const appEventManager = new AppEventManager((eventData) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        console.log("APP -> CLIENT", eventData)
        mainWindow.webContents.send("ElectronAppEvent", eventData)
      }
    })

    const onClientAction = (event: any, data: ClientAppAction) => {
      console.log("CLIENT -> APP", data)
      switch (data.type) {
        case "minimize-window":
          mainWindow?.minimize()
          break
        case "maximize-window":
          if (mainWindow?.isMaximized()) {
            mainWindow?.unmaximize()
          } else {
            mainWindow?.maximize()
          }
          break
        case "close-app":
          app.quit()
          break
        default:
          appEventManager.onUserAction(data)
          break
      }
    }

    ipcMain.on("ClientAppAction", onClientAction)
    mainWindow.on("closed", () =>
      ipcMain.off("ClientAppAction", onClientAction)
    )

    mainWindow.on("closed", () => {
      appEventManager.dispose()
      mainWindow = null
    })
  }

  app.on("ready", createWindow)

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit()
    }
  })

  app.on("activate", () => {
    if (!mainWindow) {
      createWindow()
    } else {
      mainWindow.focus()
    }
  })
}
