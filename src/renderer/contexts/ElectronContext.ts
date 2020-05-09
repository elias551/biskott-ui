import React, { useReducer } from "react"

import {
  TorrentStatus,
  TorrentServerInfo,
  SearchResult,
  SubtitleDescription,
  ClientAppAction,
  ElectronAppEvent,
  TorrentSummary,
  PluginDescription,
  SearchQuery,
} from "@/@types"
import { Loadable } from "@/utils/Loadable"

import { useExternalEventHandler } from "../useExternalEventHandler"

interface TorrentManagerState {
  searchResults: Loadable<SearchResult[]>
  nextResults: Loadable
  linkSearch?: SearchResult
  searchQuery: SearchQuery
  torrentSummary: Loadable<TorrentSummary>
  status?: TorrentStatus
  serverInfo?: TorrentServerInfo
  subtitles?: SubtitleDescription[]
  searchPlugins: Loadable<{ [url: string]: PluginDescription }>
  activePlugin?: PluginDescription

  sendMessage: (data: ClientAppAction) => void
}

export const ElectronContext = React.createContext<TorrentManagerState>(
  {} as TorrentManagerState
)

const emptySearchQuery: SearchQuery = {
  userInput: "",
  page: 1,
  pluginUrl: "",
}

export const getElectronProvider = (
  sendMessage: (data: ClientAppAction) => void
) => {
  const initialState: TorrentManagerState = {
    searchResults: Loadable.idle,
    searchQuery: emptySearchQuery,
    searchPlugins: Loadable.idle,
    torrentSummary: Loadable.idle,
    nextResults: Loadable.idle,
    sendMessage,
  }

  const ElectronProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    useExternalEventHandler(dispatch)

    return React.createElement(
      ElectronContext.Provider,
      { value: state },
      children
    )
  }
  return ElectronProvider
}

const reducer = (
  state: TorrentManagerState,
  data: ElectronAppEvent
): TorrentManagerState => {
  console.log("APP -> CLIENT", data)
  switch (data.type) {
    case "config-loaded":
      return {
        ...state,
        activePlugin:
          data.userConfig.plugins[data.userConfig.defaultSearchPlugin],
        searchPlugins: Loadable.loaded(data.userConfig.plugins),
      }
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
      return {
        ...state,
        linkSearch: toEmptySearchResult(data.url),
      }
    case "search-torrents-loading":
      return {
        ...state,
        searchResults: Loadable.loading,
        linkSearch: undefined,
        searchQuery: data.query,
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
    case "search-torrents-next-page-loading":
      return {
        ...state,
        searchQuery: data.query,
        nextResults: Loadable.loading,
      }
    case "search-torrents-next-page-loaded":
      const currentResults =
        state.searchResults.status === "loaded" ? state.searchResults.value : []
      const resultsToAdd = data.results.filter(
        (r) =>
          !currentResults.find((c) => c.torrents[0].url === r.torrents[0].url)
      )
      const results = [...currentResults, ...resultsToAdd]
      return {
        ...state,
        searchResults: Loadable.loaded(results),
        nextResults: resultsToAdd.length
          ? Loadable.idle
          : Loadable.error("No more results"),
      }
    case "search-torrents-next-page-error":
      return {
        ...state,
        nextResults: Loadable.error(data.message),
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
}

const toEmptySearchResult = (url: string) => ({
  title: "Link search",
  summary: "Search result for " + url,
  torrents: [
    {
      seeders: 0,
      leechers: 0,
      url,
      quality: "unknown",
    },
  ],
})
