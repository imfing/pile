import { settings } from '../../store'

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
    theme: {
      name: "lightTheme",
      background: "#eee",
    },
  }
}).write()

export default {
  getWindowState() {
    return settings.get('windowState')
      .value()
  },
  updateWindowState(updateProp) {
    return settings.get('windowState')
      .assign(updateProp)
      .write()
  },
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
  getLocale() {
    return settings.get('appSettings.locale')
      .value()
  },
  updateLocale(locale) {
    return settings.get('appSettings')
      .set('locale', locale)
      .write()
  },
  updateAutoStart(value) {
    settings.set('appSettings.autoStart', value).write()
  },
  getAutoStart() {
    if (!settings.get('appSettings').has('autoStart').value()) {
      settings.set('appSettings.autoStart', false).write()
      return false
    }
    else return settings.get('appSettings.autoStart').value()
  },
  getThemeName() {
    if (!settings.get('appSettings.theme').has('name').value()) {
      settings.set('appSettings.theme.name', 'lightTheme').write()
      return "lightTheme"
    }
    else return settings.get('appSettings.theme.name').value()
  },
  updateThemeName(theme) {
    return settings.get('appSettings.theme').set('name', theme).write()
  },
}