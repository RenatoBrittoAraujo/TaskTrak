import AsyncStorage from 'react-native'

var wiperunning = false
var keycounter
const keycountername = 'keycounter'

var ASfetch = async function (name) {
  if (wiperunning) {
    return undefined
  }
  let item = await AsyncStorage.getItem(name)
  return typeof(item) === 'string' ? 
    JSON.parse(item) :
    item
}

var ASset = async function (name, item) {
  if (item !== undefined) {
    item = JSON.stringify(item)
  }
  return await AsyncStorage.setItem(name, item)
}

var fetchKeyCounter = async () => {
  keycounter = await ASfetch(keycountername)
  if (typeof(keycounter) !== 'number') {
    keycounter = 0
    await ASset(keycountername, keycounter)
  }
}

class Task {
  
  async init (name) {
    this.key = keycounter
    this.name = name
    keycounter++
    await ASset(keycountername, keycounter)
  }

  isDone () {
    throw new TypeError("Class Task's function 'isDone' is abstract and must be implemented in child.");
  }

  async markDone () {
    throw new TypeError("Class Task's function 'markDone' is abstract and must be implemented in child.");
  }

  extraInformation () {
    throw new TypeError("Class Task's function 'extraInformation' is abstract and must be implemented in child.");
  }
}

const getTimeOrder = (interval) => {
  const sequentialMagnitudes = [
    { name: 'second(s)', time: 1000 },
    { name: 'minute(s)', time: 1000 * 60 },
    { name: 'hour(s)', time: 1000 * 60 * 60 },
    { name: 'day(s)', time: 1000 * 60 * 60 * 24 },
    { name: 'week(s)', time: 1000 * 60 * 60 * 24 * 7 },
    { name: 'months(s)', time: 1000 * 60 * 60 * 24 * 30 },
    { name: 'years(s)', time: 1000000000000000000000 },
  ]

  let i = 0
  while (interval > sequentialMagnitudes[i + 1].time)
  {
    i++
  }
  return Math.round(interval / sequentialMagnitudes[i].time).toString() +
         ' ' + sequentialMagnitudes[i].name 
}

class TaskFreq extends Task {
  
  load (obj) {
    this.name = obj.name
    this.key = obj.key
    this.frequency = obj.frequency
    this.lastDone = new Date(obj.lastDone)
  }

  async init (obj) {
    await super.init(obj.name)
    this.frequency = obj.frequency
    this.lastDone = new Date()
    this.lastDone.setTime(this.lastDone.getTime() - obj.frequency)
  }

  async markDone () {
    let list = await ASfetch('freqlist')
    for (let el of list) {
      if (el.key === this.key) {
        el.lastDone = new Date()
        break
      }
    }
    await ASset('freqlist', list)
  }

  isDone () {
    let freqAgo = new Date()
    freqAgo.setTime(freqAgo.getTime() - this.frequency)
    return freqAgo < this.lastDone
  }

  extraInformation () {
    let freqAgo = new Date()
    freqAgo.setTime(freqAgo.getTime() - this.frequency)
    let interval = Math.abs(this.lastDone.getTime() - freqAgo.getTime())
    let ret
    if (freqAgo < this.lastDone) {
      ret = "next in " + getTimeOrder(interval)
    } else {
      ret = "late by " + getTimeOrder(interval)
    }
    return ret
  }
}

class TaskOneshot extends Task {

  load (obj) {
    this.name = obj.name
    this.key = obj.key
  }

  async init (obj) {
    await super.init(obj.name)
  }

  isDone () {
    return false
  }

  async markDone () {
    let list = await ASfetch('oneshotlist')
    await ASset('oneshotlist', 
      list.filter((item) => item.key !== this.key))
  }
  
  extraInformation () {
    return ''
  }
}

const nameToClass = {
  'freqlist': TaskFreq,
  'oneshotlist': TaskOneshot
}

class Storage {
  async WipeData () {
    wiperunning = true
    await ASset('keycounter', undefined)
    await ASset('freqlist', undefined)
    await ASset('oneshotlist', undefined)
    keycounter = 0
    wiperunning = false
  }

  constructor () {
    fetchKeyCounter()
  }

  async fetchList(listname, list=null) {
    if (list === null) {
      list = await ASfetch(listname)
      if (list === undefined || list === null) {
        await ASset(listname, [])
        list = []
      }
    }
    list = list.map(el => {
      let obj = new nameToClass[listname]()
      obj.load(el)
      return obj
    })
    return list
  }

  async addToList(listname, task) {
    let taskinstance = new nameToClass[listname]()
    await taskinstance.init(task)
    let list = await this.fetchList(listname)
    list.push(taskinstance)
    await ASset(listname, list)
    return await this.fetchList(
      listname,
      list
    )
  }

  async deleteList (listname, key) {
    let list = await this.fetchList(listname)
    list = list.filter((item) => item.key !== key)
    await ASset(listname, list)
    return await this.fetchList(
      listname,
      list
    )
  }

  async markDoneList (listname, key) {
    let list = await this.fetchList(listname)
    for (let item of list) {
      if (item.key == key) {
        await item.markDone()
        break
      }
    }
    return await this.fetchList(listname)
  }
}

export default new Storage()