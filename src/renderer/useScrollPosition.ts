import { useState, useEffect } from "react"

export function useScrollTop(element: HTMLElement | null) {
  const [position, setScrollPosition] = useState<number>()

  useEffect(() => {
    setScrollPosition(element?.scrollTop)

    let requestRunning: number | null = null
    function handleScroll() {
      if (requestRunning === null) {
        requestRunning = window?.requestAnimationFrame(() => {
          setScrollPosition(element?.scrollTop)
          requestRunning = null
        })
      }
    }

    element?.addEventListener("scroll", handleScroll)
    return () => element?.removeEventListener("scroll", handleScroll)
  }, [element])

  return position
}
