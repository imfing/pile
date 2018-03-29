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
    themes: [],
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
    var themeId = this.getTheme()
    var themes = this.getThemes()
    console.log("themeId: " + themeId)
    console.log("themes: " + JSON.stringify(themes))
    var fullTheme = _find(themes, function(theme) {return theme.id == themeId})
    console.log("Theme null: " + (fullTheme == null))
    console.log("theme: " + JSON.stringify(fullTheme))
    if (themeId != null && fullTheme) {
      return fullTheme
    }
    return themes[0];
  },
  updateTheme(theme) {
    return settings.get('appSettings').set('theme', theme).write()
  },
  getThemes() {
    if (!settings.get('appSettings').has('themes').value()) {
      var themesDef = [
        {
          id: "lightTheme",
          name: "Light Theme",
          background: "#252525",
          hubItemTodo: "#f8f8f9",
          hubItemTodoBackground: "#f8f8f9",
          hubItemNote: "",
        },
        // {
        //   id: "lightTheme",
        //   name: "Light Theme",
        //   background: "#eee",
        //   hubItemTodo: "#f8f8f9",
        //   hubItemTodoBackground: "#f8f8f9",
        //   hubItemNote: "",
        // },
        {
          id: "darkTheme",
          name: "Dark Theme",
          background: "#252525",
        }
      ];
      settings.set('appSettings.themes', themesDef).write()
      return themesDef
    }
    else return settings.get('appSettings.themes').value()
  },
  updateThemes(themes) {
    return settings.get('appSettings').set('themes', themes).write()
  },
}