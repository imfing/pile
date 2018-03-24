const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const path = require('path')
const fs = require('fs')

const remote = require('electron').remote
const app = require('electron').app

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

// if (process.type !== 'renderer') {
//   if (!fs.existsSync(STORE_PATH)) {
//     fs.mkdirpSync(STORE_PATH)
//   }
// }

const dataAdapter = (process.env.NODE_ENV !== 'development') ?
  new FileSync(path.join(STORE_PATH, 'db.json')) :
  new FileSync('db.json')
const settingsAdapter = (process.env.NODE_ENV !== 'development') ?
  new FileSync(path.join(STORE_PATH, 'settings.json')) :
  new FileSync('settings.json')


module.exports = {
  db: low(dataAdapter),
  settings: low(settingsAdapter)
}