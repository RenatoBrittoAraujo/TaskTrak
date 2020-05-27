import 'react-native';
import React from 'react';
import Storage from '../storage'

import Notifier from '../notifier';

jest.mock('react-native-notifications', () => {
  return {
    Notifications: {
      postLocalNotification: jest.fn(),
    }
  }
})

jest.mock('react-native-background-fetch', () => {
  return {
    finish: jest.fn(),
    scheduleTask: jest.fn(),
    configure: jest.fn()
  }
})

jest.mock('react-native', () => {
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

  return asyncstorage
})

beforeEach(async () => {
  await Storage.WipeData()
})

it('notify if item on oneshotlist', async () => {
  await Storage.addToList('oneshotlist',
    {name: 'name1'}
  )
  const data = await Notifier._checkNotify()
  expect(data[0].name).toEqual('name1')
  expect(data.length).toEqual(1)
})

it('notify if undone item on freqlist', async () => {
  await Storage.addToList('freqlist',
    { name: 'name1',
      frequency: 1231312 }
  )
  const data = await Notifier._checkNotify()
  expect(data[0].name).toEqual('name1')
  expect(data.length).toEqual(1)
})

it('not notify if all items are done', async () => {
  const data = await Notifier._checkNotify()
  expect(data).toEqual(false)
})

it('notify exact undone items', async () => {
  await Storage.addToList('freqlist',
    {
      name: 'freqshouldbedone',
      frequency: 1231312
    }
  )
  await Storage.markDoneList('freqlist', 0)
  await Storage.addToList('freqlist',
    {
      name: 'freqshouldnotbedone',
      frequency: 1231312
    }
  )
  await Storage.addToList('oneshotlist',
    {
      name: 'oneshotshouldnotbedone'
    }
  )
  const data = await Notifier._checkNotify()
  expect(data.length).toEqual(2)
  expect(data[0].name).toEqual('freqshouldnotbedone')
  expect(data[1].name).toEqual('oneshotshouldnotbedone')
})

