import { Notifications } from 'react-native-notifications'
import Storage from './storage'
import BackgroundFetch from 'react-native-background-fetch'

class NotificationService {
  
  _name = 'notifyRemainingTasks'
  
  async _nofify (taskId) {

    let freqlist = await Storage.fetchList('freqlist')
    let oneshotlist = await Storage.fetchList('oneshotlist')
    
    freqlist = freqlist.filter(el => !el.isDone())
    oneshotlist = oneshotlist.filter(el => !el.isDone())
    
    let pending = []
    for (let item of freqlist) pending.push(item.name)
    for (let item of oneshotlist) pending.push(item.name)

    const maxNotificationElements = 6
    pending = pending.filter((el, i) => 
      i <= maxNotificationElements)
    
    if (pending.length <= 0) {
      BackgroundFetch.finish(taskId)
      return
    }

    Notifications.postLocalNotification({
      body: pending.join(', '),
      title: 'There are tasks remaining:',
      sound: 'chime.aiff',
      category: 'Tasks',
      link: 'localNotificationLink',
      fireDate: new Date()
    }, 1)

    BackgroundFetch.finish(taskId)
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
    }, this._nofify, this._notifyError)

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