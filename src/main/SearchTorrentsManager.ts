import fetch from "node-fetch"

import { DispatchAction, SearchQuery } from "@/@types"

export class SearchTorrentsManager {
  constructor(private dispatch: DispatchAction) {}

  async search(query: SearchQuery) {
    this.dispatch({
      type: "search-torrents-loading",
      query: query,
    })
    try {
      this.dispatch({
        type: "search-torrents-loaded",
        results: await fetch(buildSearchUrl(query)).then((r) => r.json()),
      })
    } catch (error) {
      this.dispatch({
        type: "search-torrents-error",
        message: error?.message || error,
      })
    }
  }

  async getNextPage(query: SearchQuery) {
    const searhQuery = { ...query, page: query.page + 1 }
    this.dispatch({
      type: "search-torrents-next-page-loading",
      query: searhQuery,
    })
    try {
      this.dispatch({
        type: "search-torrents-next-page-loaded",
        results: await fetch(buildSearchUrl(searhQuery)).then((r) => r.json()),
      })
    } catch (error) {
      this.dispatch({
        type: "search-torrents-next-page-error",
        message: error?.message || error,
      })
    }
  }
}

const buildSearchUrl = ({
  page,
  pluginUrl,
  userInput,
  genre,
  sortBy,
}: SearchQuery) => {
  if (!pluginUrl) {
    throw new Error("No url provided")
  }
  return `${pluginUrl}/search?&page=${page}&term=${encodeURIComponent(
    userInput
  )}&genre=${encodeURIComponent(genre || "")}&sortBy=${encodeURIComponent(
    sortBy || ""
  )}`
}
