import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  TextInput,
  ScrollView,
} from 'react-native';

import NumericInput from 'react-native-numeric-input'

import Storage from '../scripts/storage'
import {Notifications} from 'react-native-notifications'

export const TaskPage = () => {
  
  const [page, setPage] = useState('one shot')
  const [oneshotmodalvisible, setoneshotmodalvisible] = useState(false)
  const [diariomodalvisible, setdiariomodalvisible] = useState(false)
  const [diariolist, setdiariolist] = useState([])
  const [oneshotlist, setoneshotlist] = useState([])
  const [repsdiariomodal, setrepsdiariomodal] = useState(1)
  const [textinput, settextinput] = useState('')
  
  var listItem = (item) => {
    return (
      <View style={styles.itemcontainer} key={item.key.toString()}>
        <View style={styles.itemtext}>
          <Text style={styles.item}>
            {item.name}
            {(item.frequency ? ' => ' + item.frequency : '')}
          </Text>
        </View>
        <TouchableOpacity style={styles.deletebutton} onPress={
          async () => {
            if (page == 'diaria') {
              setdiariolist(await Storage.deleteDiarioList(item.key))
            } else {
              setoneshotlist(await Storage.deleteOneshotList(item.key))
            }
          }
        }>
          <Text>X</Text>
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    Notifications.registerRemoteNotifications();
    Notifications.postLocalNotification({
      body: 'Local notification!',
      title: 'Local Notification Title',
      sound: 'chime.aiff',
      category: 'SOME_CATEGORY',
      link: 'localNotificationLink',
      fireDate: new Date()
    }, 1);
    (async () => {
      let diariolist = await Storage.fetchDiarioList()
      let oneshotlist = await Storage.fetchOneshotList()
      setdiariolist(diariolist)
      setoneshotlist(oneshotlist)
    })()
  }, [])

  var getCurrentList = () => {
    if (page === 'diaria') {
      return diariolist
    } else {
      return oneshotlist
    }
  }

  return (
    <View style={styles.screen}>

      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={diariomodalvisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput placeholder="Tarefa..." style={styles.textinput}
                onChangeText={(value) => settextinput(value)} />
              <Text>Número de vezes ao dia</Text>
              <NumericInput
                value={repsdiariomodal}
                onChange={value => setrepsdiariomodal(value)}
                minValue={1}
                onLimitReached={(isMax, msg) => console.log(isMax, msg)}
                rounded />

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={async () => {
                  let diariolist = await Storage.addDiarioList(
                    {
                      name: textinput,
                      frequency: repsdiariomodal
                    })
                  setrepsdiariomodal(1)
                  settextinput('')
                  setdiariomodalvisible(!diariomodalvisible)
                  setdiariolist(diariolist)
                }}
              >
                <Text style={styles.textStyle}>Adicionar</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setdiariomodalvisible(!diariomodalvisible);
                }}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={oneshotmodalvisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput placeholder="Tarefa..." style={styles.textinput}
                onChangeText={(value) => settextinput(value)} />

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={async () => {
                  let oneshotlist = await Storage.addOneshotList({ name: textinput })
                  settextinput('')
                  setoneshotmodalvisible(!oneshotmodalvisible)
                  setoneshotlist(oneshotlist)
                }}
              >
                <Text style={styles.textStyle}>Adicionar</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setoneshotmodalvisible(!oneshotmodalvisible);
                }}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>

      <View>
        <View style={styles.button}>
          <Button title="Diaria"
            onPress={
              () => {
                setoneshotmodalvisible(false)
                setdiariomodalvisible(true)
              }
            }
          />
        </View>
        <View style={styles.button}>
          <Button title="One Shot"
            onPress={
              () => {
                setdiariomodalvisible(false)
                setoneshotmodalvisible(true)
              }
            }
          />
        </View>
      </View>

      <View style={styles.tasks}>
      
        <View style={styles.buttonbox}>
          <TouchableOpacity style={styles.buttonwrapper} onPress={() =>
            setPage('diaria')}>
            <View style={[ styles.buttonview, { borderRightWidth: 1 }]}>
              <Text>Diaria</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonwrapper} onPress={() =>
            setPage('one shot')}>
            <View style={[ styles.buttonview, { borderLeftWidth: 1 } ]}>
              <Text>One Shot</Text>
            </View>
          </TouchableOpacity>
        </View>
      
        <ScrollView style={{height: 430}}>
          {
            (() => getCurrentList()
              .map((l, i) => listItem(l))
            )()
          }
        </ScrollView>
      </View>
        
    </View>
  )
};

const styles = StyleSheet.create({
  deletebutton: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#b1b1b1',
    borderLeftWidth: 0
  },
  itemtext: {
    flex: 5,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#b1b1b1',
    borderRightWidth: 0
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
    margin: 4
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
    borderBottomWidth: 2
  },
  buttonwrapper: {
    flex: 1,
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
