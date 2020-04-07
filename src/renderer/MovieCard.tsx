import React from "react"

import { SearchResult } from "@/@types"

interface Props {
  onClick: () => void
  searchResult: SearchResult
}

export const MovieCard: React.FC<Props> = ({
  onClick,
  searchResult: result,
}) => (
  <div className="search-result" onClick={onClick}>
    <div style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div className="title">{result.title}</div>
      {result.poster && (
        <div className="image">
          <img src={result.poster} style={{ width: "100%" }} />
        </div>
      )}
    </div>
  </div>
)
