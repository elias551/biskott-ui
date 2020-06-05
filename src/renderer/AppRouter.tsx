import React, { useContext } from "react"

import { MenuButton } from "./MenuButton"
import { RouterContext } from "./contexts/RouterContext"
import { DetailsPage, DetailsTitleBar } from "./pages/DetailsPage"
import { PlayerPage, PlayerTitleBar } from "./pages/PlayerPage"
import { SearchPage, SearchTitleBar, SearchMenu } from "./pages/SearchPage"

export const AppRouter = () => {
  const { page } = useContext(RouterContext)
  return (
    <>
      {page.name === "search" && <SearchPage />}
      {page.name === "details" && <DetailsPage />}
      {page.name === "player" && <PlayerPage />}
    </>
  )
}

export const TitleBarRouter = () => {
  const { page, isMenuOpen } = useContext(RouterContext)

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {page.name === "search" && <MenuButton />}
      {!isMenuOpen && (
        <>
          {page.name === "search" && <SearchTitleBar />}
          {page.name === "details" && (
            <DetailsTitleBar searchResult={page.searchResult} />
          )}
          {page.name === "player" && (
            <PlayerTitleBar searchResult={page.searchResult} />
          )}
        </>
      )}
    </div>
  )
}

export const SideMenuRouter = () => {
  const { page } = useContext(RouterContext)

  return <>{page.name === "search" && <SearchMenu />}</>
}
