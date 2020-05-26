import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  TextInput,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons'
Icon.loadFont()
import RNPickerSelect from 'react-native-picker-select'
import NumericInput from 'react-native-numeric-input'

import Storage from '../scripts/storage'

const dayInMilisseconds = 24 * 60 * 60 * 1000
const weekInMilisseconds = dayInMilisseconds * 7
const monthInMilisseconds = Math.round(weekInMilisseconds * 4.28)
const yearInMilisseconds = monthInMilisseconds * 12

// Storage.WipeData()

export const TaskPage = () => {
  
  const [page, setPage] = useState('freqlist')
  const [oneshotmodalvisible, setoneshotmodalvisible] = useState(false)
  const [freqmodalvisible, setfreqmodalvisible] = useState(false)
  const [freqlist, setfreqlist] = useState([])
  const [oneshotlist, setoneshotlist] = useState([])
  const [frequencyreps, setfrequencyreps] = useState(1)
  const [textinput, settextinput] = useState('')
  const [frequencyperiod, setfrequencyperiod] = useState(dayInMilisseconds)
  
  var getCurrentList = () => {
    return page == 'freqlist' ?
      freqlist : oneshotlist  
  }
  
  var getCurrentListSetter = () => {
    return page == 'freqlist' ?
      setfreqlist : setoneshotlist
  }

  var listItem = (item) => {
    return (
      <View style={styles.itemcontainer} key={item.key.toString()}>
        <TouchableOpacity style={styles.markdone} onPress={
          async () => {
            getCurrentListSetter()(
              await Storage.markDoneList(page, item.key))
          }
        }>
          <Icon name="check" size={25} color="#4F4" />
        </TouchableOpacity>
        <View style={styles.itemtext}>
          <Text style={styles.item}>
            {item.name}
            {
              ': ' + (item.extraInformation().length > 0 ?
                item.extraInformation() :
                !item.isDone() ? 'pending' : 'done')
            }
          </Text>
        </View>
        <TouchableOpacity style={styles.markdelete} onPress={
          async () => {
            getCurrentListSetter()(
              await Storage.deleteList(page, item.key))
          }
        }>
          <Icon name="close" size={25} color="#F44" />
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    const func = (async () => {
      let freqlist = await Storage.fetchList('freqlist')
      setfreqlist(freqlist)
      let oneshotlist = await Storage.fetchList('oneshotlist')
      setoneshotlist(oneshotlist)
    })
    func()
    const interval = setInterval(() => {
      func()
    }, 3000)
  }, [])

  const getPendingTasks = (list) => {
    let pending = 0
    for (let item of list) {
      if (!item.isDone())
       pending++
    }
    return pending
  }

  return (
    <View style={styles.screen}>

      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={freqmodalvisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput placeholder="Task..." style={styles.textinput}
                onChangeText={(value) => settextinput(value)} />
              <RNPickerSelect
                placeholder={{ label: 'Daily', value: dayInMilisseconds }}
                onValueChange={(value) => setfrequencyperiod(value)}
                items={[
                  { label: 'Hourly', value: Math.round(dayInMilisseconds / 24)},
                  { label: 'Weekly', value: weekInMilisseconds },
                  { label: 'Monthly', value: monthInMilisseconds },
                  { label: 'Yearly', value: yearInMilisseconds },
                ]}
              />
              <Text>How many times?</Text>
              <NumericInput
                value={frequencyreps}
                onChange={value => setfrequencyreps(value)}
                minValue={1}
                rounded />
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={async () => {
                  let frequency = Math.round(frequencyperiod / frequencyreps)
                  let freqlist = await Storage.addToList(
                    'freqlist',
                    { name: textinput,
                      frequency: frequency }
                  )
                  setfrequencyreps(1)
                  setfrequencyperiod(dayInMilisseconds)
                  settextinput('')
                  setfreqmodalvisible(!freqmodalvisible)
                  setfreqlist(freqlist)
                }}
              >
                <Text style={styles.textStyle}>Add Task</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setfreqmodalvisible(!freqmodalvisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={oneshotmodalvisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput placeholder="Task..." style={styles.textinput}
                onChangeText={(value) => settextinput(value)} />

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={async () => {
                  let oneshotlist = await Storage.addToList(
                    'oneshotlist',
                    { name: textinput }
                  )
                  settextinput('')
                  setoneshotmodalvisible(!oneshotmodalvisible)
                  setoneshotlist(oneshotlist)
                }}
              >
                <Text style={styles.textStyle}>Add Task</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setoneshotmodalvisible(!oneshotmodalvisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>

      <View>
        <View style={styles.button}>
          <Button title={"Frequent"}
            onPress={
              () => {
                setoneshotmodalvisible(false)
                setfreqmodalvisible(true)
              }
            }
          />
        </View>
        <View style={styles.button}>
          <Button title="One Shot"
            onPress={
              () => {
                setfreqmodalvisible(false)
                setoneshotmodalvisible(true)
              }
            }
          />
        </View>
      </View>

      <View style={styles.tasks}>
      
        <View style={styles.buttonbox}>
          <TouchableOpacity style={styles.buttonwrapper} onPress={() =>
            setPage('freqlist')}>
            <View style={[ styles.buttonview, { borderRightWidth: 1, borderColor: '#aaa' }]}>
              <Text>{"Frequent (" + getPendingTasks(freqlist) + "/" + freqlist.length + ")"}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonwrapper} onPress={() =>
            setPage('oneshotlist')}>
            <View style={[styles.buttonview, { borderLeftWidth: 1, borderColor: '#aaa' } ]}>
              <Text>{"One Shot (" + oneshotlist.length + ")"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      
        <ScrollView style={{height: 430}}>
          {
            getCurrentList().length > 0 ?
              (() => getCurrentList()
                .map((l, i) => listItem(l))
              )()
            :
              (<View style={styles.notasks}>
                <Text> Fill this list with tasks you should do! </Text>
              </View>)
          }
        </ScrollView>
      </View>
        
    </View>
  )
};

const styles = StyleSheet.create({
  item: {
    textAlign: 'center',
  },
  notasks: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#eaeaea',
    padding: 10,
    marginTop: 10
  },
  markdelete: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#b1b1b1',
    borderLeftWidth: 0,
    backgroundColor: '#4a4a4a',
  },
  markdone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#b1b1b1',
    borderRightWidth: 0,
    backgroundColor: '#4a4a4a'
  },
  itemtext: {
    flex: 5,
    backgroundColor: '#e1e1f4',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#b1b1b1',
    paddingHorizontal: 10,
  },
  itemcontainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  textinput: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
    width: 200,
    height: 40,
    borderRadius: 10
  },
  screen: {
    padding: 7
  },
  button: {
    margin: 4,
  },
  tasks: {
    padding: 6
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  buttonbox: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  buttonwrapper: {
    flex: 1,
    backgroundColor: '#e1e1f4',
  },
  buttonview: {
    padding: 5,
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 10,
    backgroundColor: "#fafafa",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4
  },
  openButton: {
    marginTop: 10,
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default TaskPage;
