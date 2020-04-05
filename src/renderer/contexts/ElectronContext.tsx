import {
  TorrentStatus,
  TorrentServerInfo,
  SearchResult,
  SubtitleDescription,
  ClientAppAction,
  ElectronAppEvent,
  TorrentSummary,
} from "@/@types/global"

import { RouterContext } from "./RouterContext"

import { IpcRendererEvent } from "electron"
import React, { useReducer, useEffect, useContext } from "react"

interface IdleStatus {
  status: "idle"
}

interface LoadingStatus {
  status: "loading"
}

interface LoadedStatus<T> {
  status: "loaded"
  value: T
}

interface ErrorStatus {
  status: "error"
  message: string
}

type Loadable<T> = IdleStatus | LoadingStatus | LoadedStatus<T> | ErrorStatus

const Loadable = {
  idle: { status: "idle" } as IdleStatus,
  loading: { status: "loading" } as LoadingStatus,
  loaded<T>(value: T) {
    return { status: "loaded", value } as LoadedStatus<T>
  },
  error(message: string) {
    return { status: "error", message } as ErrorStatus
  },
}

interface TorrentManagerState {
  searchResults: Loadable<SearchResult[]>
  torrentSummary: Loadable<TorrentSummary>
  status?: TorrentStatus
  serverInfo?: TorrentServerInfo
  subtitles?: SubtitleDescription[]
  sendMessage: (data: ClientAppAction) => void
}

export const ElectronContext = React.createContext<TorrentManagerState>(
  {} as TorrentManagerState
)

export const getElectronProvider = (
  sendMessage: (data: ClientAppAction) => void
) => {
  const initialState: TorrentManagerState = {
    searchResults: Loadable.loaded([]),
    torrentSummary: Loadable.idle,
    sendMessage,
  }

  const ElectronProvider: React.FC = ({ children }) => {
    const { setPage } = useContext(RouterContext)
    const [state, dispatch] = useReducer(
      (
        state: TorrentManagerState,
        data: ElectronAppEvent
      ): TorrentManagerState => {
        switch (data.type) {
          case "torrent-stopped":
            return {
              ...state,
              status: undefined,
              serverInfo: undefined,
              subtitles: undefined,
              torrentSummary: Loadable.idle,
            }
          case "progress":
            return { ...state, status: data.status }
          case "server-ready":
            return { ...state, serverInfo: data.serverInfo }
          case "torrent-search-link":
            setPage({
              name: "details",
              searchResult: {
                title: "Link search",
                summary: "Search result for " + data.url,
                torrents: [
                  {
                    seeders: 0,
                    leechers: 0,
                    url: data.url,
                    quality: "unknown",
                  },
                ],
              },
            })
            return state
          case "search-torrents-loading":
            return {
              ...state,
              searchResults: Loadable.loading,
            }
          case "search-torrents-loaded":
            return {
              ...state,
              searchResults: Loadable.loaded(data.results),
            }
          case "search-torrents-error":
            return {
              ...state,
              searchResults: Loadable.error(data.message),
            }
          case "subtitles":
            return { ...state, subtitles: data.subtitles }
          case "torrent-summary-loading":
            return {
              ...state,
              torrentSummary: Loadable.loading,
            }
          case "torrent-summary-loaded":
            return {
              ...state,
              torrentSummary: Loadable.loaded(data.torrentSummary),
            }
          case "torrent-summary-error":
            return {
              ...state,
              searchResults: Loadable.error(data.message),
            }
        }
      },
      initialState,
      undefined
    )

    useEffect(() => {
      const handler = (event: IpcRendererEvent, data: ElectronAppEvent) => {
        dispatch(data)
      }
      window.ipcRenderer.on("ElectronAppEvent", handler)
      return () => {
        window.ipcRenderer.off("ElectronAppEvent", handler)
      }
    }, [])

    return (
      <ElectronContext.Provider value={state}>
        {children}
      </ElectronContext.Provider>
    )
  }
  return ElectronProvider
}
