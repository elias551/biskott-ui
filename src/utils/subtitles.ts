import LanguageDetect from "languagedetect"
import concat from "simple-concat"
import srtToVtt from "srt-to-vtt"

import { SubtitleDescription } from "@/@types"

export const loadSubtitle = (stream: NodeJS.ReadableStream, fileName: string) =>
  new Promise<SubtitleDescription>((resolve, reject) => {
    // Read the .SRT or .VTT file, parse it, add subtitle track
    const vttStream = stream.pipe(srtToVtt())

    concat(vttStream, function (err: any, buf: Buffer) {
      if (err) {
        return reject("Can't parse subtitles file.")
      }

      // Detect what language the subtitles are in
      const vttContents = buf
        .toString()
        .replace(/(.*-->.*)/g, "")
        .replace(/WEBVTT FILE/g, "")
      const langDetect = new LanguageDetect()
      const langs = langDetect.detect(vttContents, 2)
      let langDetected = langs.length ? langs[0][0] : fileName.split(".srt")[0]
      langDetected =
        langDetected.slice(0, 1).toUpperCase() + langDetected.slice(1)

      resolve({
        buffer: "data:text/vtt;base64," + buf.toString("base64"),
        language: langDetected,
        label: langDetected,
      })
    })
  })
