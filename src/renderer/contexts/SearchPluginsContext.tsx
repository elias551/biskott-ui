import { PluginDescription } from "@/@types/global"

import React, { useState, useMemo } from "react"

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
    },
    "http://localhost:1337/oxtorrent/v1": {
      name: "OxTorrent",
      url: "http://localhost:1337/oxtorrent/v1",
    },
  })

  const [activePlugin, setActivePlugin] = useState<PluginDescription>({
    name: "Yts",
    url: "http://localhost:1337/yts/v1",
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
