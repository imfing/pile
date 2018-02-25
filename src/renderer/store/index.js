const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const path = require('path')

const adapter = new FileSync(path.join(__dirname, 'db.json'))

export default low(adapter)