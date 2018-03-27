import _find from 'lodash/find'
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
    theme: "lightTheme",
    themes: [
      {
        id: "lightTheme",
        name: "Light Theme",
        background: "#eee",
        hubItemTodo: "#f8f8f9",
        hubItemTodoBackground: "#f8f8f9",
        hubItemNote: "",
      },
      {
        id: "darkTheme",
        name: "Dark Theme",
        background: "#eee",
      }
    ]
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
  getTheme() {
    if (!settings.get('appSettings').has('theme').value()) {
      settings.set('appSettings.theme', 'lightTheme').write()
      return "lightTheme"
    }
    else return settings.get('appSettings.theme').value()
  },
  getFullTheme() {
    var themeId = null;
    if (!settings.get('appSettings').has('theme').value()) {
      settings.set('appSettings.theme', 'lightTheme').write()
      themeId = "lightTheme"
    }
    else themeId = settings.get('appSettings.theme').value()
    var fullTheme = _find(this.themes, function(theme) {theme.id == themeId});
    if (themeId != null && fullTheme) {
      return fullTheme
    }
  },
  updateTheme(theme) {
    return settings.get('appSettings').set('theme', theme).write()
  },
  getThemes() {
    if (!settings.get('appSettings').has('themes').value()) {
      settings.set('appSettings.themes', settings.defaults.appSettings.themes).write()
      return settings.defaults.appSettings.themes
    }
    else return settings.get('appSettings.themes').value()
  },
  updateThemes(themes) {
    return settings.get('appSettings').set('themes', themes).write()
  },
}