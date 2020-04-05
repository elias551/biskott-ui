import { Server } from "http"
import path from "path"

import { DispatchAction } from "@/@types/global"
import { isVideo } from "@/utils/fileHelper"
import { loadSubtitle } from "@/utils/subtitles"
import { getStats, getMovieHash } from "@/utils/torrent"

import networkAddress from "network-address"
import OpenSubtitles from "opensubtitles-api"
import WebTorrent from "webtorrent"

const client = new WebTorrent()

const OS = new OpenSubtitles({ useragent: "TemporaryUserAgent", ssl: true })

let torrent: WebTorrent.Torrent | null
let server: Server | null
let progressInterval: NodeJS.Timeout | null
let errorHandler: ((err: string | Error) => void) | null

export class TorrentManager {
  constructor(private dispatch: DispatchAction) {}

  playTorrent(fileIndex: number) {
    this.startServer(fileIndex)
  }

  getTorrentSummary(url: string) {
    this.dispose()
    this.dispatch({ type: "torrent-summary-loading" })
    if (url.startsWith("http")) {
      url = url.split("?")[0]
    }

    errorHandler = (err) => {
      this.dispatch({
        type: "torrent-summary-error",
        message: typeof err === "string" ? err : err.message,
      })
      if (errorHandler) {
        client.off("error", errorHandler)
      }
    }

    client.on("error", errorHandler)
    client.add(url, (_torrent) => {
      if (errorHandler) {
        client.off("error", errorHandler)
      }
      torrent = _torrent
      this.dispatch({
        type: "torrent-summary-loaded",
        torrentSummary: {
          url,
          files: torrent.files.map((f, i) => ({
            fileName: f.name,
            fileIndex: i,
          })),
        },
      })
    })
  }

  startServer = (fileIndex: number) => {
    if (!torrent) {
      return
    }
    progressInterval = setInterval(this.updateProgress, 1000)
    const file = torrent.files[fileIndex]
    file.select()
    console.log(torrent.infoHash)

    server = torrent.createServer()
    server.listen(0, () => {
      if (!server || !torrent) {
        return
      }
      const port = getPort(server)
      this.dispatch({
        type: "server-ready",
        serverInfo: {
          localURL: `http://localhost:${port}/${fileIndex}`,
          networkURL: `http://${networkAddress()}:${port}/${fileIndex}/${encodeURIComponent(
            file.name
          )}`,
          fileName: file.name,
        },
      })
      this.loadSubtitles()
    })
  }

  async loadSubtitles() {
    if (!torrent) {
      return
    }
    const subtitles = await Promise.all(
      torrent.files
        .filter((f) => f.name.endsWith(".srt"))
        .map((file) => loadSubtitle(file.createReadStream(), file.name))
    )
    this.dispatch({ type: "subtitles", subtitles: subtitles.filter(Boolean) })
    const videoFile = torrent.files.find((file) => isVideo(file.name))

    if (!videoFile) {
      return
    }
    const filePath = path.join(torrent.path, torrent.name, videoFile.name)
    const hash = await getMovieHash(videoFile, filePath)
    await this.searchSubs({
      sublanguageid: "fre",
      hash: hash.moviehash,
      path: filePath,
      filesize: hash.moviebytesize,
      filename: videoFile.name,
      gzip: true,
    })
  }

  async searchSubs(query: any) {
    console.log("searchSubs", query)
    // const search = await OS.search(query)
    // console.log("search", search)
  }

  dispose() {
    if (errorHandler) {
      client.off("error", errorHandler)
      errorHandler = null
    }
    if (server) {
      server.close()
      server = null
    }
    if (torrent) {
      client.remove(torrent)
      torrent = null
    }
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    this.dispatch({ type: "torrent-stopped" })
  }

  private updateProgress = () => {
    if (torrent) {
      this.dispatch({ type: "progress", status: getStats(torrent) })
    }
  }
}

const getPort = (server: Server) => {
  const addr = server.address()
  return addr ? (typeof addr === "string" ? +addr : addr.port) : undefined
}
