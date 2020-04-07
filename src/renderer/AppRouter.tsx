import React, { useContext } from "react"

import { DetailsPage, DetailsTitleBar } from "./DetailsPage"
import { MenuButton } from "./MenuButton"
import { PlayerPage, PlayerTitleBar } from "./PlayerPage"
import { SearchPage, SearchTitleBar, SearchMenu } from "./SearchPage"
import { RouterContext } from "./contexts/RouterContext"

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
    <div style={{ display: "flex" }}>
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
