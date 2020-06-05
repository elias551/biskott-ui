import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import React, { useContext, useEffect, useState } from "react"

import { SearchResult } from "@/@types"
import { isVideo } from "@/utils/fileHelper"

import { Spinner } from "../Spinner"
import { ElectronContext } from "../contexts/ElectronContext"
import { RouterContext } from "../contexts/RouterContext"

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
  }, [searchResult, selectedTorrentIndex, sendMessage])

  if (!searchResult) {
    return <Spinner />
  }

  const playTorrent = (fileIndex: number) => {
    setPage({ name: "player", searchResult })
    sendMessage({ type: "play-torrent", fileIndex })
  }

  return (
    <>
      <div
        style={{
          backgroundImage:
            searchResult.background && `url('${searchResult.background}')`,
          backgroundSize: "cover",
          height: "100%",
          width: "100%",
          position: "absolute",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "absolute",
          overflowY: "auto",
          fontSize: 16,
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
            <div
              style={{ display: "flex", flexDirection: "row", margin: "5px 0" }}
            >
              {searchResult.torrents.map((t, i) => (
                <div
                  key={t.url}
                  onClick={() => setSelectedTorrentIndex(i)}
                  className="action-button"
                  style={{
                    background:
                      selectedTorrentIndex === i ? "#292929" : undefined,
                    cursor: selectedTorrentIndex === i ? "default" : undefined,
                    marginRight: 5,
                  }}
                >
                  {t.quality} (S: {t.seeders}, L: {t.leechers})
                </div>
              ))}
            </div>
          </div>
          <div style={{ margin: "10px 0 20px 0" }}>
            <input
              type="text"
              value={searchResult.torrents[selectedTorrentIndex].url}
              style={{
                width: "100%",
                background: "transparent",
                border: "transparent",
                color: "white",
              }}
              readOnly={true}
            />
          </div>
          {torrentSummary.status === "loading" && <Spinner />}
          {torrentSummary.status === "loaded" &&
            torrentSummary.value.files.length > 0 && (
              <div>
                {torrentSummary.value.files.map((file) => (
                  <div
                    key={file.fileIndex}
                    style={{ marginBottom: 5, wordBreak: "break-all" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {file.fileName}
                      {isVideo(file.fileName) && (
                        <div
                          onClick={() => playTorrent(file.fileIndex)}
                          className="action-button"
                          style={{ marginLeft: 5 }}
                        >
                          <span className="action-button-icon">
                            <PlayArrowIcon fontSize="inherit" />
                          </span>
                          <span>Play</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </>
  )
}

export const DetailsTitleBar: React.FC<{ searchResult: SearchResult }> = ({
  searchResult,
}) => {
  const { setPage } = useContext(RouterContext)

  const backToSearch = () => {
    return setPage({ name: "search" })
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
      }}
    >
      <div
        onClick={backToSearch}
        style={{
          cursor: "pointer",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ArrowBackIosIcon />
      </div>
      <span style={{ fontSize: 16 }}>{searchResult.title}</span>
    </div>
  )
}
