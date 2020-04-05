import { SearchResult } from "@/@types/global"

import React, { useState, useMemo } from "react"

type Page =
  | { name: "search" }
  | { name: "details"; searchResult: SearchResult }
  | { name: "player"; searchResult: SearchResult }

interface ContextValue {
  page: Page
  setPage: (page: Page) => void
}

export const RouterContext = React.createContext({} as ContextValue)

export const RouterProvider: React.FC = ({ children }) => {
  const [page, setPage] = useState<Page>({ name: "search" })

  const state = useMemo(() => ({ page, setPage }), [page, setPage])
  return (
    <RouterContext.Provider value={state}>{children}</RouterContext.Provider>
  )
}
