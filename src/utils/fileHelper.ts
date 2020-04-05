export const isVideo = (fileName: string) =>
  fileName.endsWith(".mp4") ||
  fileName.endsWith(".mkv") ||
  fileName.endsWith(".avi")
