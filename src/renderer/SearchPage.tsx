import React, { useContext, useState, useEffect } from "react"

import { SearchResult, PluginDescription } from "@/@types"

import { MovieCard } from "./MovieCard"
import { Spinner } from "./Spinner"
import { ElectronContext } from "./contexts/ElectronContext"
import { RouterContext } from "./contexts/RouterContext"
import { SearchPluginsContext } from "./contexts/SearchPluginsContext"

export const SearchPage = () => {
  const { searchResults } = useContext(ElectronContext)
  const { setPage } = useContext(RouterContext)

  const showDetails = (searchResult: SearchResult) => {
    setPage({ name: "details", searchResult })
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
      }}
    >
      {searchResults.status === "loading" && <Spinner />}
      {searchResults.status === "loaded" && (
        <>
          {searchResults.value.length === 0 && "No results"}
          {searchResults.value.map((result, i) => (
            <MovieCard
              key={i}
              onClick={() => showDetails(result)}
              searchResult={result}
            />
          ))}
        </>
      )}
      {searchResults.status === "error"
        ? "Error: " + searchResults.message
        : undefined}
    </div>
  )
}

export const SearchTitleBar = () => {
  const { sendMessage, searchResults } = useContext(ElectronContext)
  const { activePlugin } = useContext(SearchPluginsContext)
  const [userInput, setUserInput] = useState("")
  const searchMovies = () => {
    if (!activePlugin) {
      return
    }
    sendMessage({
      type: "search-torrents",
      query: { term: userInput, page: 1, pluginUrl: activePlugin.url },
    })
  }

  useEffect(() => {
    if (!activePlugin) {
      return
    }
    setUserInput("")
    sendMessage({
      type: "search-torrents",
      query: { term: "", page: 1, pluginUrl: activePlugin.url },
    })
  }, [activePlugin])

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <input
          style={{
            border: "1px solid rgba(0,0,0,.5)",
            background: "rgba(0,0,0,.25)",
            color: "white",
            padding: 10,
          }}
          placeholder={`Search (${activePlugin?.name})`}
          type="text"
          value={userInput}
          onKeyPress={(e) => (e.key === "Enter" ? searchMovies() : undefined)}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={searchResults.status === "loading"}
        ></input>
      </div>
    </div>
  )
}

export const SearchMenu = () => {
  const { searchPlugins, setActivePlugin, activePlugin } = useContext(
    SearchPluginsContext
  )
  const { searchResults } = useContext(ElectronContext)
  const selectSearchEngine = (searchEngine: string) => {
    setActivePlugin(searchPlugins[searchEngine])
  }

  return (
    <div>
      <select
        style={{
          border: "1px solid rgba(0,0,0,.5)",
          background: "rgba(0,0,0,.25)",
          color: "white",
          padding: 10,
        }}
        value={activePlugin?.url}
        onChange={(e) => selectSearchEngine(e.target.value)}
        disabled={searchResults.status === "loading"}
      >
        {Object.values(searchPlugins).map((plugin: PluginDescription) => (
          <option value={plugin.url} key={plugin.url}>
            {plugin.name}
          </option>
        ))}
      </select>
    </div>
  )
}
