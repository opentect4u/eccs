import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, ImageBackground, Modal, Button, ActivityIndicator } from 'react-native';
import HeaderComponent from '../Components/HeaderComponent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import Toast from 'react-native-toast-message';
import { TextInput } from 'react-native-paper';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import {ImagePicker,launchImageLibrary} from 'react-native-image-picker';


const Profile = () => {
  const welcomContHeight = 0.35 * SCREEN_HEIGHT;
  const isDisabled = !oldPassword || !newPassword
  const [isLoading, setLoading] = useState(false)
  const [responseData, setResponseData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(true);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
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
    console.log(asyncData,'asyncData')
    const bankId = JSON.parse(asyncData)?.bank_id
    const empCode = JSON.parse(asyncData)?.emp_code
    const member_id = JSON.parse(asyncData)?.member_id
    console.log(empCode, 'empcode')
    try {
      const response = await axios.get(`${BASE_URL}/api/get_pofile_dtls?member_id=${member_id}&emp_code=${empCode}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data.msg, 'profileDtls')
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

  const handleImagePicker = async () => {
    try {
      const options = {
        mediaType: 'photo', // Specify 'photo' or 'video' for media type
        quality: 0.5, // 0 to 1, where 1 = highest quality
      };

      const response = await ImagePicker.launchImageLibrary(options);

      if (!response.didCancel && !response.error) {
        setSelectedImage({ uri: response.uri });
      } else {
        console.log('Image picker cancelled or encountered an error.');
      }
    } catch (error) {
      console.log('Error during image selection:', error);
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

  
  
  const toggleOldPass = () => setIsOldPasswordValid(!isOldPasswordValid);
  const toggleNewPass = () => setIsNewPasswordValid(!isNewPasswordValid);
  const submitButtonStyle = !isOldPasswordValid || !isNewPasswordValid
    ? [styles.submitBtn, styles.submitBtnDisabled]
    : styles.submitBtn;

    
  return (
    <View>
      <HeaderComponent />
      <View>
        <ImageBackground
          source={require('../assets/bg5.jpg')}
          style={{ resizeMode: 'cover', height: welcomContHeight }}

        >
          <View style={{ height: welcomContHeight, width: 'screenWidth', position: 'relative' }}>
            <View style={{ height:70,width:70,backgroundColor:'#ffffff',alignSelf:'center',borderRadius:35,top:8,alignItems:'center',justifyContent:'center'}}>
            <Image source={require('../assets/man.png')} style={{ resizeMode:'contain' ,alignSelf:'center',height:40,width:40}} />

            {/* <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: '#007AFF',
            borderRadius: 15,
           
          }}
          onPress={handleImagePicker}
          >
          <Image source={require('../assets/edit.png')} style={{ height: 22, width: 22, tintColor: '#ffffff' }} />
        </TouchableOpacity> */}

            </View>
            <Text style={styles.containerText}>{`Hello! ${responseData.user_name}`}</Text>
            <Text style={styles.containerText}>{responseData.user_id}</Text>
            {/* <Text style={styles.containerText}>Designation: {responseData.designation}</Text> */}
            <View style={styles.mainContainer}>
              <View style={styles.profileContainer}>
                {isLoading && <ActivityIndicator color={"teal"} size={"large"} />}


                {/* <View style={styles.profileView}>
                  <Text style={styles.title}> User name</Text>
                  <Text style={styles.content}> {responseData.user_name}</Text>
                </View> */}
                {/* <View style={styles.profileView}>
                  <Text style={styles.title}>Mobile No.</Text>
                  <Text style={styles.content}>{responseData.user_id}</Text>
                </View> */}
               
                <View style={styles.profileView}>
                  <Text style={styles.title}>Date of Appointment </Text>
                  <Text style={styles.content}>{responseData.doa}</Text>
                </View>
                <View style={styles.profileView}>
                  <Text style={styles.title}>Date of Birth </Text>
                  <Text style={styles.content}>{responseData.dob}</Text>
                </View>
                <View style={styles.profileView}>
                  <Text style={styles.title}>Father/Husband's Name </Text>
                  <Text style={styles.content}>{responseData.gurdian_name}</Text>
                </View>
                <View style={styles.profileView}>
                  <Text style={styles.title}>SOL ID. </Text>
                  <Text style={styles.content}>{responseData.sol_id}</Text>
                </View>
                <View style={styles.profileView}>
                  <Text style={styles.title}>Account No. </Text>
                  <Text style={styles.content}>{responseData.account_no}</Text>
                </View>
                <View style={styles.profileView}>
                  <Text style={styles.title}>P.F No. </Text>
                  <Text style={styles.content}>{responseData.pf_no}</Text>
                </View>
                <View style={styles.profileView}>
                  <Text style={styles.title}>Permanent Address </Text>
                  <Text style={styles.content}>{responseData.permanent_add}</Text>
                </View>
                <View style={styles.profileView}>
                  <Text style={styles.title}>P.O </Text>
                  <Text style={styles.content}>{responseData.po}</Text>
                </View>
                <View style={styles.profileView}>
                  <Text style={styles.title}>Dist. </Text>
                  <Text style={styles.content}>{responseData.emp_code}</Text>
                </View>
                <View style={styles.profileView}>
                  <Text style={styles.title}>Pin </Text>
                  <Text style={styles.content}>{responseData.pin}</Text>
                </View>
                {/* <View style={styles.profileView}>
                  <Text style={styles.title}>Employee Code </Text>
                  <Text style={styles.content}>{responseData.emp_code}</Text>
                </View> */}
                <View style={styles.profileViewPass}>

                  <Text style={styles.titleReset}>Need to Reset Your PIN? <TouchableOpacity>
                    <Text style={styles.titleClick} onPress={openModal}> Click Here</Text>
                  </TouchableOpacity> </Text>

                  {/* <Text style={styles.content}>{responseData.emp_code}</Text> */}
                </View>


                {/* <hr/> */}
              </View>
            </View>
          </View>
        </ImageBackground>
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
                onChangeText={(text) => {
                  setOldPassword(text);
                  setIsOldPasswordValid(text.length === 4);
                }}

              />
              {!isOldPasswordValid && (
                <Text style={styles.errorText}>Old PIN must be 4 digits</Text>
              )}
              <TextInput
                label="New Pin"
                style={styles.input}
                secureTextEntry={!showNewPass}
                right={<TextInput.Icon icon={showNewPass ? 'eye' : 'eye-off'} onPress={toggleShowNewPass} />}
                value={newPassword}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setNewPassword(text);
                  setIsNewPasswordValid(text.length === 4);
                }}
              />
              {!isNewPasswordValid && (
                <Text style={styles.errorText}>New PIN must be 4 digits</Text>
              )}
              <TouchableOpacity style={styles.submitBtn} onPress={pinSubmit} disabled={!isOldPasswordValid || !isNewPasswordValid}>
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
  mainContainer: {
    height: 700,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    backgroundColor: 'white',
    // backgroundColor:'#fdbd30',
    alignSelf: 'center',
    position: 'absolute',
    top: 140,
    padding: 20,
  },
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
    fontSize: 16,
    fontWeight: '900',
    // color: '#fdbd30',
    color:'white',
    top: 15,
    alignSelf: 'center'
  },
  introText: {
    flexDirection: "row",
    justifyContent: 'center',
    marginTop: 10
  },
  profileView: {
    width: '100%',
    borderBottomColor: '#a20a3a',
    borderBottomWidth: 0.5,
    paddingBottom: 5,
    paddingTop: 5,
  },
  profileViewPass: {
    width: '100%',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    paddingBottom: 5,
    paddingTop: 5,
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
    fontFamily: 'OpenSans-ExtraBold',
    fontWeight: 'bold',
    // color: 'black',
    // color: '#a20a3a',
    color:'#3f50b5',
    fontSize: 13
  },
  titleReset: {
    fontFamily: 'OpenSans-ExtraBold',
    color: 'black',
    fontSize: 12,
    fontWeight: '600'
  },

  titleClick: {
    fontFamily: 'OpenSans-ExtraBold',
    fontWeight: '800',
    color: '#ff8c00',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontSize: 13
  },
  content: {
    fontFamily: 'OpenSans-ExtraBold',
    color: 'black',
    fontSize: 13
  },
  logoContainer: {
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    position: 'relative',
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
    fontFamily: 'OpenSans-ExtraBold',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    // color: '#209fb2',
    // color: '#a20a3a',
    color:'#3f50b5'
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
    // backgroundColor: '#04bbd6',
    // backgroundColor: '#a20a3a',
    backgroundColor:'#3f50b5',
    width: 100,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  submitBtnTxt: {
    fontFamily: 'OpenSans-ExtraBold',
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800'
  },
  
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },

})


// const screenWidth = Dimensions.get('window').width;



export default Profile;