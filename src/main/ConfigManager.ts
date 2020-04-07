import fs from "fs"

import { DispatchAction, PluginDescription, UserConfig } from "@/@types"

const CONFIG_FILE_PATH = "./app.config.json"

export class ConfigManager {
  constructor(private dispatch: DispatchAction) {}

  readConfigFromFile() {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      return { plugins: {}, defaultSearchPlugin: "" } as UserConfig
    }
    const config = fs.readFileSync(CONFIG_FILE_PATH, "utf8")
    return JSON.parse(config) as UserConfig
  }

  saveConfig(config: UserConfig) {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config))
  }

  async loadConfig() {
    this.dispatch({
      type: "config-loaded",
      userConfig: this.readConfigFromFile(),
    })
  }

  async saveSearchPlugin(plugin: PluginDescription) {
    const config = this.readConfigFromFile()
    const newConfig = {
      ...config,
      plugins: { ...config.plugins, [plugin.url]: plugin },
      defaultSearchPlugin: config.defaultSearchPlugin || plugin.url,
    }
    this.saveConfig(newConfig)
    this.dispatch({ type: "config-loaded", userConfig: newConfig })
  }

  setSearchPlugin(url: string) {
    const config = this.readConfigFromFile()
    const newConfig = { ...config, defaultSearchPlugin: url }
    this.saveConfig(newConfig)
    this.dispatch({ type: "config-loaded", userConfig: newConfig })
  }
}
