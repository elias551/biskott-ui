import { SearchResult, PluginDescription } from "@/@types/global"

import { Spinner } from "./Spinner"
import { ElectronContext } from "./contexts/ElectronContext"
import { RouterContext } from "./contexts/RouterContext"
import { SearchPluginsContext } from "./contexts/SearchPluginsContext"

import React, { useContext, useState, useEffect } from "react"

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
            <div
              key={i}
              className="search-result"
              onClick={() => showDetails(result)}
            >
              <div style={{ pointerEvents: "none", overflow: "hidden" }}>
                <div
                  style={{
                    marginBottom: 0,
                    height: 40,
                    marginLeft: 5,
                    marginTop: 5,
                    marginRight: 5,
                    fontSize: 16,
                  }}
                >
                  {result.title}
                </div>
                {result.poster && (
                  <div className="image">
                    <img src={result.poster} style={{ width: "100%" }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
      {searchResults.status === "error"
        ? "Error: " + searchResults.message
        : undefined}
    </div>
  )
}

export const SearchToolBar = () => {
  const { sendMessage, searchResults } = useContext(ElectronContext)
  const { searchPlugins, setActivePlugin, activePlugin } = useContext(
    SearchPluginsContext
  )
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
    sendMessage({
      type: "search-torrents",
      query: { term: "", page: 1, pluginUrl: activePlugin.url },
    })
  }, [activePlugin])

  const selectSearchEngine = (searchEngine: string) => {
    setUserInput("")
    setActivePlugin(searchPlugins[searchEngine])
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <select
        style={{
          border: "1px solid rgba(0,0,0,.5)",
          background: "rgba(0,0,0,.25)",
          color: "white",
          padding: 10,
        }}
        onChange={(e) => selectSearchEngine(e.target.value)}
        disabled={searchResults.status === "loading"}
      >
        {Object.values(searchPlugins).map((plugin: PluginDescription) => (
          <option value={plugin.url} key={plugin.url}>
            {plugin.name}
          </option>
        ))}
      </select>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <input
          style={{
            border: "1px solid rgba(0,0,0,.5)",
            background: "rgba(0,0,0,.25)",
            color: "white",
            padding: 10,
          }}
          placeholder="Search"
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
