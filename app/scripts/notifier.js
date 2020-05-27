import { Notifications } from 'react-native-notifications'
import Storage from './storage'
import BackgroundFetch from 'react-native-background-fetch'

class NotificationService {
  
  _name = 'notifyRemainingTasks'

  async _getNotifyData () {
    let freqlist = await Storage.fetchList('freqlist')
    let oneshotlist = await Storage.fetchList('oneshotlist')

    freqlist = freqlist.filter(el => !el.isDone())
    oneshotlist = oneshotlist.filter(el => !el.isDone())

    let pending = [...freqlist, ...oneshotlist]

    const maxNotificationElements = 6
    pending = pending.filter((el, i) =>
      i <= maxNotificationElements)
    
    return pending
  }
  
  async _checkNotify (taskId) {
    let notifyData = await this._getNotifyData()
    
    if (notifyData.length <= 0) {
      BackgroundFetch.finish(taskId)
      return false
    }

    Notifications.postLocalNotification({
      body: notifyData.join(', '),
      title: 'There are tasks remaining:',
      sound: 'chime.aiff',
      category: 'Tasks',
      link: 'localNotificationLink',
      fireDate: new Date()
    }, 1)

    BackgroundFetch.finish(taskId)
    return notifyData
  }

  async _notifyError (taskId) {
    console.log("[js] RNBackgroundFetch failed to start");
  }
  
  async _notificationSetup () {
    BackgroundFetch.configure({
      minimumFetchInterval: 15,
      forceAlarmManager: false,
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
      requiresCharging: false,     
      requiresDeviceIdle: false,   
      requiresBatteryNotLow: false,
      requiresStorageNotLow: false 
    }, this._checkNotify, this._notifyError)

    try {
      await BackgroundFetch.scheduleTask({
        taskId: this._name,
        stopOnTerminate: false,
        enableHeadless: true,
        delay: 5000,          
        forceAlarmManager: true, 
        periodic: true       
      });
    } catch (e) {
      console.warn('[BackgroundFetch] scheduleTask fail', e)
    }
  }
  
  start () {
    this._notificationSetup()
  }
}

export default new NotificationService()