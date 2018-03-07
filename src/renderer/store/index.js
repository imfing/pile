const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const path = require('path')

const dataAdapter = new FileSync('db.json')
const settingsAdapter = new FileSync('settings.json')

module.exports = {
  db: low(dataAdapter),
  settings: low(settingsAdapter)
}