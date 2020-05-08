import React, { useState, useMemo, useCallback, useEffect } from "react"

import { SearchResult } from "@/@types"

type Page =
  | { name: "search" }
  | { name: "details"; searchResult: SearchResult }
  | { name: "player"; searchResult: SearchResult }

interface ContextValue {
  page: Page
  isMenuOpen: boolean
  toggleMenu: () => void
  setPage: (page: Page) => void
}

export const RouterContext = React.createContext({} as ContextValue)

export const RouterProvider: React.FC = ({ children }) => {
  const [page, setPage] = useState<Page>({ name: "search" })
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [page])

  const toggleMenu = useCallback(() => setIsMenuOpen(!isMenuOpen), [isMenuOpen])
  const state = useMemo(() => ({ page, setPage, isMenuOpen, toggleMenu }), [
    page,
    setPage,
    isMenuOpen,
    toggleMenu,
  ])

  return React.createElement(RouterContext.Provider, { value: state }, children)
}
