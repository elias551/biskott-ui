import { IpcRenderer } from "electron"

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
  }
}

interface ISearchPlugin {
  search(query: SearchQuery): Promise<SearchResult[]>
}

interface PluginDescription {
  name: string
  url: string
  description: string
}

interface SearchQuery {
  pluginUrl: string
  term: string
  page: number
}

interface SubtitleDescription {
  buffer: string
  language: string
  label: string
}

interface SearchResult {
  title: string
  summary: string
  poster?: string
  background?: string
  torrents: TorrentDescription[]
}

interface TorrentDescription {
  url: string
  seeders: number
  leechers: number
  quality: string
}

interface TorrentStatus {
  numPeers: number
  percent: number
  downloaded: string
  total: string
  downloadSpeed: string
  uploadSpeed: string
}

interface TorrentServerInfo {
  localURL: string
  networkURL: string
  fileName: string
}

interface TorrentFileSummary {
  fileName: string
  fileIndex: number
}

interface TorrentSummary {
  url: string
  files: TorrentFileSummary[]
}

type SearchTorrentsAppEvent =
  | {
      type: "search-torrents-loading"
    }
  | {
      type: "search-torrents-loaded"
      results: SearchResult[]
    }
  | {
      type: "search-torrents-error"
      message: string
    }

type GetTorrentDetailsAppEvent =
  | {
      type: "torrent-search-link"
      url: string
    }
  | {
      type: "torrent-summary-loading"
    }
  | {
      type: "torrent-summary-loaded"
      torrentSummary: TorrentSummary
    }
  | {
      type: "torrent-summary-error"
      message: string
    }

type DispatchAction = (data: ElectronAppEvent) => void

type ElectronAppEvent =
  | {
      type: "torrent-stopped"
    }
  | {
      type: "progress"
      status: TorrentStatus
    }
  | {
      type: "server-ready"
      serverInfo: TorrentServerInfo
    }
  | SearchTorrentsAppEvent
  | {
      type: "subtitles"
      subtitles: SubtitleDescription[]
    }
  | GetTorrentDetailsAppEvent

type ClientAppAction =
  | {
      type: "play-torrent"
      fileIndex: number
    }
  | {
      type: "search-torrents"
      query: SearchQuery
    }
  | {
      type: "unload-torrent"
    }
  | {
      type: "open-vlc"
      path: string
    }
  | {
      type: "show-details"
      url: string
    }
  | {
      type: "minimize-window"
    }
  | {
      type: "maximize-window"
    }
  | {
      type: "close-app"
    }
