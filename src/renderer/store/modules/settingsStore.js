import db from '../../store'

db.defaults({
  windowState: {
    height: 563,
    useContentSize: true,
    width: 1000,
    show: false,
    minWidth: 300,
    x: undefined,
    y: undefined
  },
  appSettings: {
    locale: ""
  }
}).write()

export default {
  getWindowState() {
    return db.get('windowState')
      .value()
  },
  updateWindowState(updateProp) {
    return db.get('windowState')
      .assign(updateProp)
      .write()
  },
  getAppSettings() {
    return db.get('appSettings')
      .cloneDeep()
      .value()
  },
  updateAppSettings(updateProp) {
    return db.get('appSettings')
      .assign(updateProp)
      .write()
  },
  getLocale() {
    return db.get('appSettings.locale')
      .value()
  },
  updateLocale(locale){
    return db.get('appSettings')
      .set('locale', locale)
      .write()
  }
}