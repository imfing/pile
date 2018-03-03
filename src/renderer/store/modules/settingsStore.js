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
    locale: 'zh-CN'
  }
}).write()

export default {

}