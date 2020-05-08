import MenuIcon from "@material-ui/icons/Menu"
import React, { useContext } from "react"

import { RouterContext } from "./contexts/RouterContext"

export const MenuButton = () => {
  const { toggleMenu } = useContext(RouterContext)
  return (
    <div
      onClick={toggleMenu}
      style={{
        cursor: "pointer",
        height: 40,
        width: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MenuIcon />
    </div>
  )
}
