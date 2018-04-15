const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs')
const path = require('path')

export default function (dataPath) {
  const settingsAdapter = new FileSync(dataPath)
  const settings = low(settingsAdapter)

  // default settings
  settings.defaults({
    windowState: {
      height: 563,
      useContentSize: false,
      width: 1000,
      show: false,
      minWidth: 300,
      x: undefined,
      y: undefined
    },
    appSettings: {
      locale: "",
      autoStart: false
    }
  }).write()

  return {
    // window state
    getWindowState() {
      return settings.get('windowState')
        .value()
    },
    updateWindowState(updateProp) {
      return settings.get('windowState')
        .assign(updateProp)
        .write()
    },
    // app settings
    getAppSettings() {
      return settings.get('appSettings')
        .cloneDeep()
        .value()
    },
    updateAppSettings(updateProp) {
      return settings.get('appSettings')
        .assign(updateProp)
        .write()
    },
    // locale/i18n
    getLocale() {
      return settings.get('appSettings.locale')
        .value()
    },
    updateLocale(locale) {
      return settings.get('appSettings')
        .set('locale', locale)
        .write()
    },
    // auto start config
    getAutoStart() {
      if (!settings.get('appSettings').has('autoStart').value()) {
        settings.set('appSettings.autoStart', false).write()
        return false
      } else return settings.get('appSettings.autoStart').value()
    },
    updateAutoStart(value) {
      settings.set('appSettings.autoStart', value).write()
    },
    // user specified data path
    getDataPath() {
      if (!settings.get('appSettings').has('dataPath').value()) {
        let dataDir = require("electron").app.getPath('userData')
        let dataPath = path.join(dataDir, 'db.json')
        settings.set('appSettings.dataPath', dataPath).write()
        return dataPath
      } else return settings.get('appSettings.dataPath').value()
    },
    updateDatePath(value) {
      settings.set('appSettings.dataPath', value).write()
    }
  }
}