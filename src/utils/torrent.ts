export const isTorrentLink = (value: string) =>
  value.startsWith("magnet:?") ||
  value.startsWith("http://") ||
  value.startsWith("https://")

import { TorrentStatus } from "@/@types/global"

import moment from "moment"
import OpenSubtitles from "opensubtitles-api"
import { Torrent, TorrentFile } from "webtorrent"

export function getStats(torrent: Torrent): TorrentStatus {
  // Peers
  const numPeers = torrent.numPeers

  // Progress
  const percent = Math.round(torrent.progress * 100 * 100) / 100
  const downloaded = prettyBytes(torrent.downloaded)
  const total = prettyBytes(torrent.length)

  // Remaining time
  let remaining
  if (torrent.done) {
    remaining = "Done."
  } else {
    remaining = moment
      .duration(torrent.timeRemaining / 1000, "seconds")
      .humanize()
    remaining =
      remaining[0].toUpperCase() + remaining.substring(1) + " remaining."
  }

  // Speed rates
  const downloadSpeed = prettyBytes(torrent.downloadSpeed) + "/s"
  const uploadSpeed = prettyBytes(torrent.uploadSpeed) + "/s"
  return {
    numPeers,
    percent,
    downloaded,
    total,
    downloadSpeed,
    uploadSpeed,
  }
}

const wait = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout))

export const getMovieHash = async (
  videoFile: TorrentFile,
  filePath: string
) => {
  while (true) {
    await wait(2000)
    console.log({ downloaded: videoFile.downloaded })
    if (videoFile.downloaded < 5783552) {
      continue
    }
    try {
      return await new OpenSubtitles("TemporaryUserAgent").hash(filePath)
    } catch (e) {
      console.error(e)
    }
  }
}

// Human readable bytes util
function prettyBytes(num: number) {
  var exponent,
    unit,
    neg = num < 0,
    units = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  if (neg) {
    num = -num
  }
  if (num < 1) {
    return (neg ? "-" : "") + num + " B"
  }
  exponent = Math.min(
    Math.floor(Math.log(num) / Math.log(1000)),
    units.length - 1
  )
  num = Number((num / Math.pow(1000, exponent)).toFixed(2))
  unit = units[exponent]
  return (neg ? "-" : "") + num + " " + unit
}
