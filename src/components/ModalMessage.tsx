import React from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface IModalMessageComponent {
  showMessage: boolean;
  setShowMessage: (args: boolean) => void;
  message: string;
}

export default function ModalMessageComponent({ showMessage, setShowMessage, message }: IModalMessageComponent) {
  const { colors } = useTheme();

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showMessage}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setShowMessage(!showMessage);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.section}>
              <View style={styles.header}>
                <Text style={styles.label}>Mensagem</Text>

                <TouchableOpacity onPress={() => setShowMessage(!showMessage)}>
                  <Icon size={25} color="black" name="close"></Icon>
                </TouchableOpacity>
              </View>

              <View style={[styles.textAreaContainer, { backgroundColor: colors.grey3 }]}>
                <Text>{message}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(100,100,100, 0.5)',
  },
  modalView: {
    margin: 20,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textAreaContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 150,
  },
  section: {
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
