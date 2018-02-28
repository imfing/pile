import db from '../../store'

import lodashId from 'lodash-id'

db._.mixin(lodashId)

db.defaults({
  activeBoard: 'default',
  boards: [{
    id: 'default',
    label: 'Default board',
    hubs: [{
      id: 'testhub',
      label: 'testhub',
      items: []
    }]
  }]
}).write()

export default {
  saveNewBoard (boardName, defaults) {
    return db
      .get('boards')
      .insert({
        label: boardName,
        hubs: []
      })
      .write()
  },
  saveBoardsArray (boardsArray) {
    return db
      .set('boards', boardsArray)
      .write()
  },
  saveHubsArray (boardId, items) {
    return db
      .get('boards')
      .getById(boardId)
      .set('hubs', items)
      .write()
  },
  removeBoard (boardId) {
    db.get('boards')
      .remove({id: boardId})
      .write()
  },
  setActiveBoard (boardId) {
    db.set('activeBoard', boardId)
      .write()
  },
  getActiveBoard () {
    return db.get('activeBoard')
      .value()
  },
  getList () {
    return db
      .get('boards')
      .cloneDeep()
      .value()
  },
  addHubToEnd (boardId, type) {
    return db
      .get('boards')
      .getById(boardId)
      .get('hubs')
      .insert({
        label: 'New Hub',
        type: type
      })
      .write()
  },
  getHubs (boardId) {
    return db
      .get('boards')
      .getById(boardId)
      .get('hubs')
      .cloneDeep()
      .value()
  },
  getHubItems(boardId, hubId) {
    return db
      .get('boards')
      .getById(boardId)
      .get('hubs')
      .getById(hubId)
      .get('items')
      .cloneDeep()
      .value()
  },
  addHubItem(boardId, hubId, path) {
    return db
      .get('boards')
      .getById(boardId)
      .get('hubs')
      .getById(hubId)
      .get('items')
      .insert({
        path: path
      })
      .write()
  },
  removeHubItem(boardId, hubId, itemId){
    db.get('boards')
    .getById(boardId)
    .get('hubs')
    .getById(hubId)
    .get('items')
    .remove({id: itemId})
    .write()
  }
}
