import React from "react"

import { SearchResult } from "@/@types"

interface Props {
  searchResult: SearchResult
}

export const MovieCard: React.FC<Props> = ({
  searchResult: { title, poster },
}) => (
  <div className="movie-card">
    <div className="title">{title}</div>
    {poster && (
      <div className="image">
        <img src={poster} />
      </div>
    )}
  </div>
)
