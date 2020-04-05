import { SearchResult } from "@/@types/global"
import { isVideo } from "@/utils/fileHelper"

import { Spinner } from "./Spinner"
import { ElectronContext } from "./contexts/ElectronContext"
import { RouterContext } from "./contexts/RouterContext"

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import React, { useContext, useEffect, useState } from "react"

export const DetailsPage = () => {
  const { sendMessage, torrentSummary } = useContext(ElectronContext)
  const { page, setPage } = useContext(RouterContext)

  const searchResult =
    (page.name === "details" && page.searchResult) || undefined

  const [selectedTorrentIndex, setSelectedTorrentIndex] = useState(0)

  useEffect(() => {
    if (searchResult) {
      sendMessage({
        type: "show-details",
        url: searchResult.torrents[selectedTorrentIndex].url,
      })
    }
  }, [searchResult, selectedTorrentIndex])

  if (!searchResult) {
    return <Spinner />
  }

  const playTorrent = (fileIndex: number) => {
    setPage({ name: "player", searchResult })
    sendMessage({ type: "play-torrent", fileIndex })
  }

  return (
    <div
      style={{
        backgroundImage:
          searchResult.background && `url('${searchResult.background}')`,
        backgroundSize: "cover",
        height: "100%",
        fontSize: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", margin: 15 }}>
          {searchResult.poster && (
            <div style={{ marginRight: 10 }}>
              <img
                src={searchResult.poster}
                style={{ maxWidth: 500, maxHeight: 500 }}
              />
            </div>
          )}
          <div style={{ flexGrow: 1 }}>
            <div style={{ backgroundColor: "#171717", padding: 5 }}>
              {searchResult.summary}
            </div>
          </div>
        </div>
        <div style={{ margin: 15 }}>
          <div>
            <select
              value={selectedTorrentIndex}
              onChange={(e) => setSelectedTorrentIndex(+e.target.value)}
            >
              {searchResult.torrents.map((t, i) => (
                <option key={t.url} value={i}>
                  {t.quality} (Seeders: {t.seeders}, Leechers: {t.leechers})
                </option>
              ))}
            </select>
          </div>
          {torrentSummary.status === "loading" && <Spinner />}
          {torrentSummary.status === "loaded" &&
            torrentSummary.value.files.length > 0 && (
              <div>
                <input
                  type="text"
                  value={torrentSummary.value.url}
                  style={{ width: "100%", maxWidth: 300 }}
                />
                <ul>
                  {torrentSummary.value.files.map((file) => (
                    <li
                      key={file.fileIndex}
                      style={{ marginBottom: 5, wordBreak: "break-all" }}
                    >
                      {file.fileName}
                      {isVideo(file.fileName) && (
                        <button
                          onClick={() => playTorrent(file.fileIndex)}
                          style={{
                            marginLeft: 5,
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: "#171717",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <PlayArrowIcon
                            fontSize="inherit"
                            style={{ pointerEvents: "none" }}
                          />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export const DetailsToolBar: React.FC<{ searchResult: SearchResult }> = ({
  searchResult,
}) => {
  const { setPage } = useContext(RouterContext)

  const backToSearch = () => setPage({ name: "search" })

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
      }}
    >
      <span onClick={backToSearch} style={{ cursor: "pointer" }}>
        <ArrowBackIosIcon style={{ pointerEvents: "none" }} />
      </span>
      <span style={{ fontSize: 16 }}>{searchResult.title}</span>
    </div>
  )
}
