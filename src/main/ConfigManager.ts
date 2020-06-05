import fs from "fs"
import { promisify } from "util"

import fetch from "node-fetch"

import { DispatchAction, PluginDescription, UserConfig } from "@/@types"

const CONFIG_FILE_PATH = "./app.config.json"

const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)
const readFile = promisify(fs.readFile)

export class ConfigManager {
  constructor(private dispatch: DispatchAction) {}

  async readConfigFromFile() {
    if (!(await exists(CONFIG_FILE_PATH))) {
      return { plugins: {}, defaultSearchPlugin: "" } as UserConfig
    }
    const config = await readFile(CONFIG_FILE_PATH, "utf8")
    return JSON.parse(config) as UserConfig
  }

  saveConfig(config: UserConfig) {
    return writeFile(CONFIG_FILE_PATH, JSON.stringify(config))
  }

  async loadConfig() {
    const userConfig = await this.readConfigFromFile()

    this.dispatch({
      type: "config-loaded",
      userConfig: userConfig,
    })

    await Promise.all(
      Object.keys(userConfig.plugins).map((pluginUrl) =>
        fetch(pluginUrl + "/announce")
          .then((r) => r.json())
          .then((r) => ({ ...r, url: pluginUrl } as PluginDescription))
          .then(this.saveSearchPlugin.bind(this))
          .catch(console.error)
      )
    )
    this.dispatch({
      type: "config-loaded",
      userConfig: await this.readConfigFromFile(),
    })
  }

  async saveSearchPlugin(plugin: PluginDescription) {
    const config = await this.readConfigFromFile()
    const newConfig = {
      ...config,
      plugins: { ...config.plugins, [plugin.url]: plugin },
      defaultSearchPlugin: config.defaultSearchPlugin || plugin.url,
    }
    this.saveConfig(newConfig)
    this.dispatch({ type: "config-loaded", userConfig: newConfig })
  }

  async removeSearchPlugin(pluginUrl: string) {
    const config = await this.readConfigFromFile()
    const newConfig = {
      ...config,
      plugins: { ...config.plugins },
    }

    delete newConfig.plugins[pluginUrl]
    if (newConfig.defaultSearchPlugin === pluginUrl) {
      newConfig.defaultSearchPlugin = Object.keys(newConfig.plugins)[0]
    }
    this.saveConfig(newConfig)
    this.dispatch({ type: "config-loaded", userConfig: newConfig })
  }

  async setSearchPlugin(url: string) {
    const config = await this.readConfigFromFile()
    const newConfig = { ...config, defaultSearchPlugin: url }
    this.saveConfig(newConfig)
    this.dispatch({ type: "config-loaded", userConfig: newConfig })
  }
}
