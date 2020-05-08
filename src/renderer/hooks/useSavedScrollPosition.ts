import { useState, useRef, useEffect } from "react"

import { useScrollTop } from "../useScrollPosition"

const savedPositions: { [key: string]: number } = {}

export const useSavedScrollPosition = (key: string) => {
  const [isReady, setIsReady] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const scrollTop = useScrollTop(wrapperRef.current)

  useEffect(() => {
    if (wrapperRef.current) {
      const scrollTopValue = savedPositions[key]
      wrapperRef.current.scrollTop = scrollTopValue
      setIsReady(true)
    }
  }, [key, wrapperRef])

  useEffect(() => {
    if (!isReady || !scrollTop) {
      return
    }
    savedPositions[key] = scrollTop
  }, [scrollTop, isReady, key])

  return wrapperRef
}
