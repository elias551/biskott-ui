import React, { useContext, useState, useEffect, useMemo, useRef } from "react"
import { useIntersectionObserver } from "react-intersection-observer-hook"

import { SearchResult, PluginDescription } from "@/@types"

import { MovieCard } from "../MovieCard"
import { Spinner } from "../Spinner"
import { ElectronContext } from "../contexts/ElectronContext"
import { RouterContext } from "../contexts/RouterContext"
import { useScrollTop } from "../useScrollPosition"

export const SearchPage = () => {
  const { searchResults, linkSearch, nextResults } = useContext(ElectronContext)
  const { setPage } = useContext(RouterContext)

  const [initialLinkSearch] = useState(linkSearch)

  useEffect(() => {
    if (linkSearch && linkSearch !== initialLinkSearch) {
      showDetails(linkSearch)
    }
  }, [linkSearch])

  const wrapperRef = useRef<HTMLDivElement>(null)

  const scrollTop = useScrollTop(wrapperRef.current)

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (wrapperRef.current) {
      const scrollTopValue = (window as any).searchscrollTop
      wrapperRef.current.scrollTop = scrollTopValue
      setIsReady(true)
    }
  }, [wrapperRef.current])

  useEffect(() => {
    if (!isReady) {
      return
    }
    ;(window as any).searchscrollTop = scrollTop
  }, [scrollTop, isReady])

  const showDetails = (searchResult: SearchResult) => {
    setPage({ name: "details", searchResult })
  }

  return (
    <div ref={wrapperRef} style={{ overflowY: "auto", height: "100%" }}>
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
            <NextButton />
          </>
        )}
        {searchResults.status === "error"
          ? "Error: " + searchResults.message
          : undefined}
      </div>
      {nextResults.status === "loading" && (
        <div style={{ width: "100%" }}>
          <Spinner />
        </div>
      )}
    </div>
  )
}

const NextButton = () => {
  const { sendMessage, searchQuery, activePlugin, nextResults } = useContext(
    ElectronContext
  )

  const showNextPage = () => {
    if (!activePlugin || nextResults.status === "loading") {
      return
    }
    sendMessage({
      type: "search-torrents-next-page",
      query: searchQuery,
    })
  }
  const [buttonRef, { entry }] = useIntersectionObserver()

  useEffect(() => {
    if (entry?.isIntersecting) {
      showNextPage()
    }
  }, [entry?.isIntersecting])

  return <div ref={buttonRef}></div>
}

export const SearchTitleBar = () => {
  const { sendMessage, searchResults, activePlugin, searchQuery } = useContext(
    ElectronContext
  )

  const [userInput, setUserInput] = useState(searchQuery.userInput)
  const searchMovies = () => {
    if (!activePlugin) {
      return
    }
    sendMessage({
      type: "search-torrents",
      query: { userInput: userInput, page: 1, pluginUrl: activePlugin.url },
    })
  }

  useEffect(() => {
    if (!activePlugin || searchQuery.pluginUrl === activePlugin.url) {
      return
    }
    setUserInput("")
    sendMessage({
      type: "search-torrents",
      query: {
        pluginUrl: activePlugin.url,
        userInput: "",
        page: 1,
      },
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
  const { sendMessage, searchPlugins, activePlugin } = useContext(
    ElectronContext
  )

  const selectSearchEngine = (searchEngineUrl: string) => {
    if (searchPlugins.status === "loaded") {
      sendMessage({ type: "set-search-plugin", url: searchEngineUrl })
    }
  }

  const [pluginDescription, setPluginDescription] = useState<
    PluginDescription
  >()

  const [pluginUrl, setPluginUrl] = useState("http://localhost:1337/yts/v1")
  const [errorMessage, setErrorMessage] = useState<string>()
  const loadPlugin = async () => {
    if (searchPlugins.status !== "loaded") {
      return
    }
    if (Object.keys(searchPlugins.value).includes(pluginUrl)) {
      setErrorMessage(
        `Plugin is already installed. (${searchPlugins.value[pluginUrl].name})`
      )
      return
    }
    fetch(pluginUrl + "/announce")
      .then((r) => r.json())
      .then((r) => ({ ...r, url: pluginUrl }))
      .then(setPluginDescription)
      .catch((e) => {
        setErrorMessage("Invalid url")
      })
  }

  useEffect(() => {
    setPluginDescription(undefined)
    setErrorMessage(undefined)
  }, [pluginUrl])

  const isValid = useMemo(
    () =>
      pluginDescription &&
      pluginDescription.description &&
      pluginDescription.name &&
      pluginDescription.url,
    [pluginDescription]
  )

  const addPlugin = () => {
    if (!pluginDescription || !isValid) {
      return
    }
    sendMessage({
      type: "save-plugin",
      pluginDescription,
    })
  }

  if (searchPlugins.status !== "loaded") {
    return <Spinner />
  }

  return (
    <div>
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
        >
          {Object.values(searchPlugins.value).map(
            (plugin: PluginDescription) => (
              <option value={plugin.url} key={plugin.url}>
                {plugin.name}
              </option>
            )
          )}
        </select>
      </div>
      <div>
        <pre>{JSON.stringify(activePlugin, null, 2)}</pre>
      </div>
      <h2>Add plugin</h2>
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <input
            type="text"
            value={pluginUrl}
            placeholder="Type plugin url to add"
            onChange={(e) => setPluginUrl(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <button onClick={loadPlugin}>Find</button>
      </div>
      <pre>{JSON.stringify(pluginDescription, null, 2)}</pre>
      {errorMessage && <div>{errorMessage}</div>}
      {pluginDescription && (
        <button onClick={addPlugin} disabled={!isValid}>
          Add
        </button>
      )}
    </div>
  )
}
