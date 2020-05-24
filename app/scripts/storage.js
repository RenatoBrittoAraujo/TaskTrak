import { AsyncStorage } from "react-native"

var ASfetch = async function (name) {
  let item = await AsyncStorage.getItem(name)
  return JSON.parse(item)
}

var ASset = async function (name, item) {
  item = JSON.stringify(item)
  return await AsyncStorage.setItem(name, item)
}

var keycounter

(async () => {
  keycounter = await ASfetch('keycounter')
  if (typeof(keycounter) !== 'number') {
    keycounter = 0
    await ASset('keycounter', keycounter)
  }
})()

const diariolistname = 'diariolist'
const oneshotlistname = 'oneshotlist'

class Task {
  async init (name) {
    this.key = keycounter
    this.name = name
    keycounter++
    await ASset('keycounter', keycounter)
  }
}

class TaskDiario extends Task {
  async init (name, frequency) {
    await super.init(name)
    this.frequency = frequency
  }
}

class TaskOneshot extends Task {
  async init (name) {
    await super.init(name)
  }
}

class Storage {
  constructor () {}

  async _fetchList (listname) {
    let list = await ASfetch(listname)
    if (list === undefined || list === null) {
      await ASset(listname, [])
      list = []
    }
    return list
  }

  async _addList (item, listname) {
    let list = await ASfetch(listname)
    list.push(item)
    await ASset(listname, list)
    return list
  }
  
  async _deleteList (key, listname) {
    let list = await ASfetch(listname)
    list = list.filter((item) => item.key !== key)
    await ASset(listname, list)
    return list
  }

  async fetchDiarioList () {
    return await this._fetchList(diariolistname)
  }

  async fetchOneshotList () {
    return await this._fetchList(oneshotlistname)
  }

  async addDiarioList (taskdiario) {
    let diario = new TaskDiario()
    await diario.init(taskdiario.name, taskdiario.frequency)
    return await this._addList(diario, diariolistname)
  }
  
  async addOneshotList (taskoneshot) {
    let oneshot = new TaskOneshot()
    await oneshot.init(taskoneshot.name)
    return await this._addList(oneshot, oneshotlistname)
  }

  async deleteDiarioList (key) {
    return await this._deleteList(key, diariolistname)
  }

  async deleteOneshotList (key) {
    return await this._deleteList(key, oneshotlistname)
  }
}

export default new Storage()