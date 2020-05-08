import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import React, { useContext, useState } from "react"

import { SearchResult } from "@/@types"

import { ElectronContext } from "../contexts/ElectronContext"
import { RouterContext } from "../contexts/RouterContext"

export const PlayerPage = () => {
  const { sendMessage, serverInfo, subtitles } = useContext(ElectronContext)

  const [isPlayerVisible, setIsPlayerVisible] = useState(true)

  const openVlc = () => {
    if (serverInfo) {
      setIsPlayerVisible(false)
      sendMessage({ type: "open-vlc", path: serverInfo?.networkURL })
    }
  }

  const togglePlayer = () => {
    setIsPlayerVisible(!isPlayerVisible)
  }

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {serverInfo && (
        <>
          {isPlayerVisible && (
            <video
              controls
              autoPlay={true}
              disablePictureInPicture
              style={{
                width: "100%",
                height: "100%",
                outline: "none",
                backgroundColor: "black",
              }}
            >
              <source src={serverInfo?.localURL} type="video/mp4" />
              {subtitles?.map((sub, i) => (
                <track
                  key={i}
                  kind="captions"
                  label={sub.label}
                  src={sub.buffer}
                  srcLang={sub.language}
                />
              ))}
            </video>
          )}
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            {isPlayerVisible ? (
              <button onClick={openVlc}>open in VLC</button>
            ) : (
              <button onClick={togglePlayer}>toggle player</button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export const PlayerTitleBar: React.FC<{ searchResult: SearchResult }> = ({
  searchResult,
}) => {
  const { sendMessage, status } = useContext(ElectronContext)
  const { page, setPage } = useContext(RouterContext)
  const stopVideo = () => {
    setTimeout(() => sendMessage({ type: "unload-torrent" }))
    setPage({ name: "details", searchResult })
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
        onClick={stopVideo}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        <ArrowBackIosIcon /> <span>Back</span>
      </div>
      {status && (
        <span>
          ({status?.downloadSpeed}, {status?.percent}%)
        </span>
      )}
    </div>
  )
}
