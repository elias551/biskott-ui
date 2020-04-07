import React, { useState, useMemo } from "react"

import { PluginDescription } from "@/@types"

interface ContextValue {
  searchPlugins: { [url: string]: PluginDescription }
  activePlugin?: PluginDescription
  setActivePlugin: (value: PluginDescription) => void
}

export const SearchPluginsContext = React.createContext({} as ContextValue)

export const SearchPluginsProvider: React.FC = ({ children }) => {
  const [searchPlugins] = useState<ContextValue["searchPlugins"]>({
    "http://localhost:1337/yts/v1": {
      name: "Yts",
      url: "http://localhost:1337/yts/v1",
      description: "unknown",
    },
    "http://localhost:1337/oxtorrent/v1": {
      name: "OxTorrent",
      url: "http://localhost:1337/oxtorrent/v1",
      description: "unknown",
    },
  })

  const [activePlugin, setActivePlugin] = useState<PluginDescription>({
    name: "Yts",
    url: "http://localhost:1337/yts/v1",
    description: "unknown",
  })

  const state = useMemo(
    () => ({ searchPlugins, activePlugin, setActivePlugin }),
    [searchPlugins, activePlugin, setActivePlugin]
  )

  return (
    <SearchPluginsContext.Provider value={state}>
      {children}
    </SearchPluginsContext.Provider>
  )
}
