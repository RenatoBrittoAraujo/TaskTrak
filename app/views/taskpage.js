import React, { useState } from 'react';

import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  TextInput
} from 'react-native';

import NumericInput from 'react-native-numeric-input'

export const TaskPage = () => {

  const [page, setPage] = useState('diaria')
  const [oneshotmodalvisible, setoneshotmodalvisible] = useState(false)
  const [diariomodalvisible, setdiariomodalvisible] = useState(false)
  const [diariolist, setdiariolist] = useState([])
  const [oneshotlist, setoneshotlist] = useState([])
  const [repsdiariomodal, setrepsdiariomodal] = useState(1)
  const [textinput, settextinput] = useState('')

  var getCurrentList = () => {
    if (page === 'diaria') {
      return diariolist
    } else {
      return oneshotlist
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.buttons}>
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
          <TouchableOpacity style={styles.buttonwrapper} onPress={() => setPage('diaria')}>
            <View style={[ styles.buttonview, { borderRightWidth: 1 }]}>
              <Text>Diaria</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonwrapper} onPress={() => setPage('one shot')}>
            <View style={[ styles.buttonview, { borderLeftWidth: 1 } ]}>
              <Text>One Shot</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={getCurrentList()}
            renderItem={ function ({ item }) {
              return (
                <TouchableOpacity style={styles.itemcontainer} onPress={
                  () => {
                    if (page == 'diaria') {
                      setdiariolist(diariolist.filter((obj) => obj.key != item.key))
                    } else {
                      setoneshotlist(oneshotlist.filter((obj) => obj.key != item.key))
                    }
                  }
                }>
                  <Text style={styles.item}>{item.str}</Text>
                </TouchableOpacity>
              )
            }}/>
        </View>
      </View>

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
              onChangeText={(value) => settextinput(value)}/>
            <Text>Número de vezes ao dia</Text>
            <NumericInput
              value={repsdiariomodal}
              onChange={value => setrepsdiariomodal(value)}
              minValue={1}
              onLimitReached={(isMax, msg) => console.log(isMax, msg)}
              rounded />

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                let obj = {
                  key: Math.random().toString(),
                  str: textinput,
                  rep: repsdiariomodal
                }
                console.log(obj)
                console.log([...diariolist, obj])
                setrepsdiariomodal(1)
                settextinput('')
                setdiariolist([...diariolist, obj])
                setdiariomodalvisible(!diariomodalvisible);
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
              onPress={() => {
                let obj = {
                  key: Math.random().toString(),
                  str: textinput
                }
                settextinput('')
                setoneshotlist([...oneshotlist, obj])
                setoneshotmodalvisible(!oneshotmodalvisible);
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
  )
};

const styles = StyleSheet.create({
  itemcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    backgroundColor: '#f5f5f5'
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
    padding: 10
  },
  buttons: {
    paddingHorizontal: 10
  },
  button: {
    margin: 4
  },
  tasks: {
    padding: 10
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
