import fetch from "node-fetch"

import { DispatchAction, SearchQuery } from "@/@types"

export class SearchTorrentsManager {
  constructor(private dispatch: DispatchAction) {}

  async search(query: SearchQuery) {
    this.dispatch({
      type: "search-torrents-loading",
      userInput: query.term,
      page: query.page,
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
}

const buildSearchUrl = ({ pluginUrl, term, page }: SearchQuery) => {
  if (!pluginUrl) {
    throw new Error("No url provided")
  }
  return `${pluginUrl}/search?&page=${page}&term=${encodeURIComponent(term)}`
}
