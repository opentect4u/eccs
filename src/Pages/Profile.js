import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, ImageBackground, Modal, Button,ActivityIndicator } from 'react-native';
import HeaderComponent from '../Components/HeaderComponent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import Toast from 'react-native-toast-message';
import { TextInput } from 'react-native-paper';


const Profile = () => {
  const [isLoading, setLoading] = useState(false)
  const [responseData, setResponseData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => {
    
    GetStorage()
    profileDtls()
  }, [])

  const GetStorage = async () => {
    try {
      const asyncData = await AsyncStorage.getItem(`login_data`);
      const bankId = JSON.parse(asyncData)?.bank_id
      console.log(JSON.parse(asyncData)?.bank_id, 'bank_id')
    }
    catch (err) {
      console.log(err);
    }

  }

  const profileDtls = async () => {
    setLoading(true)
    const asyncData = await AsyncStorage.getItem(`login_data`);
    const bankId = JSON.parse(asyncData)?.bank_id
    const empCode = JSON.parse(asyncData)?.emp_code
    console.log(empCode,'empcode')
    try {
      const response = await axios.get(`${BASE_URL}/api/get_pofile_dtls?bank_id=${bankId}&emp_code=${empCode}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data.msg[0], 'profileDtls')
      if (response.data.suc === 1) {
        setLoading(false)
        setResponseData(response.data.msg[0]);
      }
      else {
        setLoading(false)
        Toast.show({
          type: 'error',
          text1: 'error!',
          visibilityTime: 5000
        })
      }
    }
    catch (error) {
      setLoading(false)
      console.log(error);
    }
  };
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const toggleShowOldPass = () => {
    setShowOldPass(!showOldPass);
  };
  const toggleShowNewPass = () => {
    setShowNewPass(!showNewPass);
  };
  const pinSubmit = async () => {
    const asyncData = await AsyncStorage.getItem(`login_data`);
    const id = JSON.parse(asyncData)?.id
    const user = JSON.parse(asyncData)?.user_name 
    const apidata = {
      id: id,
      user_name: user,
      old_pwd: oldPassword,
      new_pwd: newPassword
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/change_password`, apidata, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data, 'reset')
      if (response.data.suc === 1) {
        Toast.show({
          type: 'success',
          text1: 'Pin changed successfully',
          visibilityTime: 5000
        })
      }
      else if (response.data.suc === 0) {
        
        Toast.show({
          type: 'error',
          text1: 'Please check your pin',
          visibilityTime: 5000
        })
      }
    }
    catch (error) {
      console.log(error);
    }
    closeModal();
  }
  return (
    <View>
      <HeaderComponent />
      <View>
        <ImageBackground
          source={require('../assets/bg.png')} // Replace with the actual path to your image
          style={{ resizeMode: 'cover' }}
        >
          <View style={styles.logoContainer}>
            <View style={styles.introText}>
              {/* Wellcome gretting */}
              <Text style={styles.containerText}>{`Hello! ${responseData.user_name}`}</Text>
            </View>

          </View>
        </ImageBackground>
        <Image source={require('../assets/profile.png')} style={styles.image} />
        <View
          style={styles.listView}>
            {isLoading && <ActivityIndicator color={"teal"} size={"large"} />}
          {/* <Table style={{ backgroundColor: COLORS.lightScheme.onTertiary }}>
          <Rows data={tableData} textStyle={styles.text} />
        </Table> */}
          <View style={styles.profileContainer}>
            <View style={styles.profileView}>
              <Text style={styles.title}> User name</Text>
              <Text style={styles.content}> {responseData.user_name}</Text>
            </View>
            <View style={styles.profileView}>
              <Text style={styles.title}>Mobile No.</Text>
              <Text style={styles.content}>{responseData.user_id}</Text>
            </View>
            <View style={styles.profileView}>
              <Text style={styles.title}>Member id </Text>
              <Text style={styles.content}>{responseData.member_id}</Text>
            </View>
            <View style={styles.profileView}>
              <Text style={styles.title}>Employee Code </Text>
              <Text style={styles.content}>{responseData.emp_code}</Text>
            </View>
            <View style={styles.profileViewPass}>

              <Text style={styles.titleReset}>Need to Reset Your PIN? <TouchableOpacity>
                <Text style={styles.titleClick} onPress={openModal}> Click Here</Text>
              </TouchableOpacity> </Text>

              {/* <Text style={styles.content}>{responseData.emp_code}</Text> */}
            </View>
          </View>

          {/* <hr/> */}
        </View>
      </View>
      {/* Modal */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Image source={require('../assets/close.png')} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
              <Text style={styles.modalText}>Reset Your PIN</Text>
              <TextInput
                label="Old Pin"
                style={styles.input}
                secureTextEntry={!showOldPass}
                right={<TextInput.Icon icon={showOldPass ? 'eye' : 'eye-off'} onPress={toggleShowOldPass} />}
                value={oldPassword}
                keyboardType="numeric"
                onChangeText={text => setOldPassword(text)}
              />
              
              {/* <TextInput
                style={styles.input}
                value={oldPassword}
                onChangeText={text => setOldPassword(text)}
                secureTextEntry={true}
              /> */}
              {/* <Text style={styles.modalText}>Enter New Pin</Text> */}
              <TextInput
                label="New Pin"
                style={styles.input}
                secureTextEntry={!showNewPass}
                right={<TextInput.Icon icon={showNewPass ? 'eye' : 'eye-off'} onPress={toggleShowNewPass} />}
                value={newPassword}
                keyboardType="numeric"
                onChangeText={text => setNewPassword(text)}
              />
              {/* <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              secureTextEntry={true}
            /> */}

              <TouchableOpacity style={styles.submitBtn} onPress={pinSubmit} disabled={!oldPassword || !newPassword}>
                <Text style={styles.submitBtnTxt}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>


  );
};

const styles = StyleSheet.create({
  nameContainer: {
    flex: 1,
    margin: 20,
    padding: 10,
    backgroundColor: "white",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderTopRightRadius: 50
  },
  profileContainer: {
    position: 'relative',
    // top:-80

  },
  containerText: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
    top: 20
  },
  introText: {
    flexDirection: "row",
    justifyContent: 'center',
    marginTop: 10
  },
  profileView: {
    width: '100%',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    paddingBottom: 7,
    paddingTop: 15,
  },
  profileViewPass: {
    width: '100%',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    paddingBottom: 15,
    paddingTop: 15,
    // alignItems:'center'
  },
  listView: {
    backgroundColor: 'white',
    height: "100%",
    padding: 20,
    marginTop: -80
  },
  text: {
    color: 'black',
    fontWeight: "600",
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16
  },
  titleReset:{
    color: 'gray',
    fontSize: 16,
    fontWeight:'600'
  },

  titleClick: {
    fontWeight: '800',
    color: '#ff8c00',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontSize: 14
  },
  content: {
    color: 'gray',
    fontSize: 20
  },
  logoContainer: {
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    //  backgroundColor: 'rgba(32,159,178,255)',
    position: 'relative',
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",

    paddingHorizontal: 20,
    height: 150,
    overflow: 'none'
  },

  image: {
    height: 105,
    width: 105,
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 100,
    alignSelf: "center",
    alignItems: 'center',
    bottom: 75,
    resizeMode: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 350,
    height: 350,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#209fb2',
  },
  input: {
    height: 50,
    width: '90%',
    backgroundColor: 'white',
    marginBottom: 20,
    borderColor: 'black',
    // borderWidth: 1,
    borderRadius: 7,
    // paddingHorizontal: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  // closeButtonText: {


  //   fontWeight: 'bold',
  // },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the color and opacity as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#04bbd6',
    width: 100,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  submitBtnTxt: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800'
  }

})


// const screenWidth = Dimensions.get('window').width;



export default Profile;