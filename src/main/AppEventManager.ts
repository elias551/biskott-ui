import { ClientAppAction, DispatchAction } from "@/@types"
import { isTorrentLink } from "@/utils/torrent"

import { ExternalPlayerManager } from "./ExternalPlayerManager"
import { SearchTorrentsManager } from "./SearchTorrentsManager"
import { TorrentManager } from "./TorrentManager"

export class AppEventManager {
  private torrentManager: TorrentManager
  private searchTorrentsManager: SearchTorrentsManager
  private externalPlayerManager: ExternalPlayerManager

  constructor(private dispatch: DispatchAction) {
    this.torrentManager = new TorrentManager(dispatch)
    this.searchTorrentsManager = new SearchTorrentsManager(dispatch)
    this.externalPlayerManager = new ExternalPlayerManager(dispatch)
  }

  async onUserAction(data: ClientAppAction) {
    switch (data.type) {
      case "search-torrents":
        if (isTorrentLink(data.query.term)) {
          this.dispatch({
            type: "torrent-search-link",
            url: data.query.term,
          })
          this.torrentManager.getTorrentSummary(data.query.term)
          break
        }
        this.searchTorrentsManager.search(data.query)
        break
      case "show-details":
        this.torrentManager.getTorrentSummary(data.url)
        break
      case "play-torrent":
        this.torrentManager.playTorrent(data.fileIndex)
        break
      case "unload-torrent":
        this.torrentManager.dispose()
        break
      case "open-vlc":
        this.externalPlayerManager.open(data.path)
        break
    }
  }

  dispose() {
    this.torrentManager.dispose()
  }
}
