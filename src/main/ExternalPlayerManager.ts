import cp from "child_process"
import path from "path"

import vlcCommand from "vlc-command"

import { DispatchAction } from "@/@types"

export class ExternalPlayerManager {
  constructor(private dispatch: DispatchAction) {}

  async open(path: string) {
    // Try to find and use VLC if external player is not specified
    vlcCommand((err: any, vlcPath: string) => {
      if (err) {
        return
      }
      const args = ["--play-and-exit", "--quiet", path]
      spawnExternal(vlcPath, args)
    })
  }
}

// holds a ChildProcess while we're playing a video in an external player, null otherwise
let proc: cp.ChildProcess | null

function spawnExternal(playerPath: string, args: string[]) {
  console.log(
    "Running external media player:",
    `${playerPath} ${args.join(" ")}`
  )

  if (process.platform === "darwin" && path.extname(playerPath) === ".app") {
    // Mac: Use executable in packaged .app bundle
    playerPath += `/Contents/MacOS/${path.basename(playerPath, ".app")}`
  }

  proc = cp.spawn(playerPath, args, { stdio: "ignore" })

  // If it works, close the modal after a second
  const closeModalTimeout = setTimeout(() => {
    console.log("exit modal ?")
  }, 1000)

  proc.on("close", (code) => {
    clearTimeout(closeModalTimeout)
    if (!proc) {
      return
    } // Killed
    console.log("External player exited with code ", code)
    if (code === 0) {
      console.log("backToList")
    } else {
      console.log("externalPlayerNotFound")
    }
    proc = null
  })

  proc.on("error", (err) => {
    console.log("External player error", err)
  })
}
