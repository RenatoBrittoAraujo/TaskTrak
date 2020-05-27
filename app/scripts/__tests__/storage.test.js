import 'react-native';
import React from 'react';
import Storage from '../storage';

var Gmockfreqlist, Gmockoneshotlist

jest.mock('react-native', () => {
  const mockfreqlist = [
    {
      name: 'name1',
      key: '1',
      frequency: 68420,
      lastDone: new Date()
    },
    {
      name: 'name',
      key: '2',
      frequency: 69420,
      lastDone: new Date('2020-09-11')
    },
  ]
  Gmockfreqlist = mockfreqlist

  const mockoneshotlist = [
    {
      name: 'name1',
      key: '3',
    },
    {
      name: 'name',
      key: '4',
    },
  ]
  Gmockoneshotlist = mockoneshotlist

  class AsyncStorageMock {
    data = {}
    async getItem(name) {
      return this.data[name]
    }
    async setItem(name, item) {
      return this.data[name] = item
    }
  }

  const asyncstorage = new AsyncStorageMock()
  
  asyncstorage.setItem('emptylist', JSON.stringify([]))
  asyncstorage.setItem('freqlist', JSON.stringify(mockfreqlist))
  asyncstorage.setItem('oneshotlist', JSON.stringify(mockoneshotlist))
  asyncstorage.setItem('keycounter', 5)

  return asyncstorage
})

it('fetch an empty list', async () => {
  const obj = await Storage.fetchList('emptylist')
  expect(obj).toEqual([])
})

it('fetch a non existing list', async () => {
  const obj = await Storage.fetchList('thisshouldnotexist')
  expect(obj).toEqual([])
})

it('fetch mock freqlist', async () => {
  const obj = await Storage.fetchList('freqlist')
  expect(JSON.stringify(obj)).toEqual(
    JSON.stringify(Gmockfreqlist)
  )
})

it('fetch mock oneshotlist', async () => {
  const obj = await Storage.fetchList('oneshotlist')
  expect(JSON.stringify(obj)).toEqual(
    JSON.stringify(Gmockoneshotlist)
  )
})

it('add item to freqlist', async () => {
  const item = {
    name: 'name3',
    frequency: 69420,
  }
  await Storage.addToList('freqlist', item)
  const obj = await Storage.fetchList('freqlist')
  expect(obj[2].name).toEqual(item.name)
  expect(obj[2].frequency).toEqual(item.frequency)
  expect(obj[2].lastDone < new Date()).toEqual(true)
  expect(obj[2].key).toEqual(5)
})

it('add item to oneshotlist', async () => {
  const item = {
    name: 'name3',
  }
  await Storage.addToList('oneshotlist', item)
  const obj = await Storage.fetchList('oneshotlist')
  expect(obj[2].name).toEqual(item.name)
  expect(obj[2].key).toEqual(6)
})

it('wipe data works', async () => {
  await Storage.WipeData()
  const freqlist = await Storage.fetchList('freqlist')
  const oneshotlist = await Storage.fetchList('oneshotlist')
  expect(freqlist).toEqual([])
  expect(oneshotlist).toEqual([])
})

it('valid timestamp for freq obj', async () => {
  const item = {
    name: 'name3',
    frequency: 24 * 60 * 60 * 1000
  }
  const olderDate = new Date((new Date()).getTime() - 24 * 60 * 61 * 1000)
  await Storage.addToList('freqlist', item)
  const obj = (await Storage.fetchList('freqlist'))[0]
  console.log('olderDate:', olderDate)
  console.log('objDate:', obj.lastDone)
  expect(olderDate < obj.lastDone).toEqual(true)
  expect(new Date() > obj.lastDone).toEqual(true)
})

it('isDone for freq obj be false', async () => {
  const item = {
    name: 'name3',
    frequency: 1
  }
  await Storage.addToList('freqlist', item)
  const obj = (await Storage.fetchList('freqlist'))[1]
  expect(obj.isDone()).toEqual(false)
})

it('isDone for freq obj be true', async () => {
  const item = {
    name: 'name3',
    frequency: 24 * 60 * 60 * 1000
  }
  await Storage.addToList('freqlist', item)
  let obj = (await Storage.fetchList('freqlist'))[2]
  await Storage.markDoneList('freqlist', obj.key)
  obj = (await Storage.fetchList('freqlist'))[2]
  expect(obj.isDone()).toEqual(true)
})

it('delete object works', async () => {
  const item = {
    name: 'name3',
    frequency: 1
  }
  await Storage.addToList('freqlist', item)
  let list = await Storage.fetchList('freqlist')
  const oldListLength = list.length
  await Storage.deleteList('freqlist', list[list.length - 1].key)
  list = await Storage.fetchList('freqlist')
  expect(list.length).toEqual(oldListLength - 1)
})