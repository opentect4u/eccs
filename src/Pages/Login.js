import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { TextInput,useTheme  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, Image, Text, Button, TouchableOpacity, ImageBackground,KeyboardAvoidingView,useColorScheme,TouchableWithoutFeedback,Keyboard  } from 'react-native';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import LoginData from '../data/login_dummy_data.json';
import OtpData from '../data/otp_dummy_data.json';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config/config';
import RouteGaurdContext from '../Context/AuthGuard';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import io from 'socket.io-client';
import { SocketContext, SocketProvider } from '../Context/Socket';
import { fonts } from 'react-native-elements/dist/config';
import { color } from 'react-native-elements/dist/helpers';
// import OTPInputView from '@twotalltotems/react-native-otp-input';

function Login({ navigation }) {
  const theme = useTheme();
  const isDarkMode = useColorScheme() === 'dark'
  // const navigation = useNavigation();
  const { setAuthDT } = useContext(RouteGaurdContext);
  const { socket } = useContext(SocketContext);
  const [step, setStep] = useState(1)
  const [phnNo, setPhnNo] = useState('');
  const [varOtp, setOtp] = useState('');
  const [userData, setUserData] = useState(null);
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  useEffect(() => {
    GetStorage()
    console.log(step)
  }, [step])

  const GetStorage = async () => {
    try {
      const asyncData = await AsyncStorage.getItem(`user_data`);
      console.log(JSON.parse(asyncData)?.bank_id)
    }
    catch (err) {
      console.log(err);
    }

  }
  const incrementStep = async () => {
    if (step == 1 && phnNo.length >= 4) {
      setStep(stepCount => stepCount + 1)   
    }

    else {
      console.log('stepppppp')
    }
  }
  const decrementStep = () => {
    setStep(stepCount => stepCount - 1)
  }
  const submitNext = async () => {

    if (step == 2 && varOtp.length === 4) {
      const asyncData = await AsyncStorage.getItem(`user_data`);
      // console.log(JSON.parse(asyncData)?.bank_id)
      const apiParams = {
        // bank_id: 10001,
        member_id: phnNo,
        password: varOtp
      };
      console.log(apiParams, 'login') 
      // setStep(stepCount => stepCount + 1)
      // navigation.navigate('Home');
      try {
        const response = await axios.post(`${BASE_URL}/api/login`, apiParams, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        // console.log(response.data, 'login-data')
        if (response.data.suc === 1) {
          console.log('response data for login ',response.data.data[0])
          setUserData(response.data.data[0]);
          await AsyncStorage.setItem('login_data', JSON.stringify(response.data.data[0]));
          setAuthDT(await AsyncStorage.getItem(`login_data`));
          socket.connect();
          navigation.navigate('BottomNav');

        }
        else if (response.data.suc === 0) {
          Toast.show({
            type: 'error',
            text1: 'Member ID or PIN no. mismatch!',
            visibilityTime: 5000
          })
        }
      }
      catch (error) {
        console.log(error);
      }

      // OtpData.forEach((item) => {
      //   if (item.otp == varOtp) {
      //     console.log('Otp - matched..!')
      //     setStep(stepCount => stepCount - 1)
      //     navigation.navigate('Home');
      //   }
      //   else{
      //     console.log('Otp - mismatched..!')
      //     Toast.show({
      //       type:'error',
      //       text1:'Otp - mismatched..!',
      //       visibilityTime:5000
      //     })
      //   }
      // })
    }
    else {
      console.log('first')
    }

  }
  const handleLogin = async () => {
    submitNext().then(async () => {
      await AsyncStorage.setItem(`login_data`);
    }).catch(() => console.log('error'))

  }
  const handlePhnNoChange = (value) => {
    setPhnNo(value);
    console.log(phnNo)
  };
  const handleRegister = () => {
    navigation.navigate('Reg');
  }
  const inputFunction = () => {
    return <View style={Styles.inputContainer}>
      <View style={Styles.introContainer}>
        <Text style={Styles.header}>Login</Text>
    
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TextInput          
         backgroundColor='transparent'
        //  outlineColor='#02a7bf'
        // outlineColor='#a20a3a'
        outlineColor='#000'
        //  activeOutlineColor='#a20a3a'
         mode="outlined"
         style={{ flex: 1 , marginTop:5,
        }}
        // textColor='#a20a3a'
        textColor='#3f50b5'
        placeholder={"Enter your member Id"}
        // placeholderTextColor={isDarkMode ? '#a20a3a' : '#a20a3a'}
        placeholderTextColor={isDarkMode ? '#3f50b5' : '#3f50b5'}
        color={isDarkMode ? 'black' : 'black'}
        onChangeText={handlePhnNoChange}
        keyboardType="numeric"
        defaultValue={phnNo}
        left={<TextInput.Icon icon="account" 
        // color={'#02a7bf'}
        // color={'#a20a3a'}
        color={'#3f50b5'}
         />}
        // borderColor='#02a7bf'

      
      />
      </View>
    </View>
  };
  const handleOtpChange = (value) => {
    setOtp(value);
    console.log(value, 'varOtp')
  };
  
  const nextButton = () => {
    const isDisabled = step === 1 && phnNo.length != 4 ;
    return (
      
      <TouchableOpacity style={[Styles.nextBtn,isDisabled && Styles.disabledBtn]} onPress={() => incrementStep().then} disabled={isDisabled}>
        <Text style={Styles.nextBtnFont}>Next</Text>
      </TouchableOpacity>
    )
  }
  useEffect(() => {
    console.log(step)
    console.log(LoginData)
  }, [step]);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <KeyboardAvoidingView behavior='padding' style={Styles.container}>
    
      {/* <ImageBackground
        source={require('../assets/bg4.jpg')} 
      > */}
      <Image source={require('../assets/pnbco.png')} style={{ resizeMode:'contain' ,alignSelf:'center',justifyContent:'center',marginTop:'30%'  }} />

      <View style={Styles.loginContainer}>
        {/* <Image
            //   source={require('../assets/pnblogo.png')}
              style={Styles.logoImg}
              resizeMode="contain"
            /> */}
        {/* <Text>hhuh</Text> */}
        {step == 1 && <>
          {inputFunction()}

          {nextButton()}

          <View style={Styles.messageContainer}>
            <Text style={{ 
              // color: '#02a7bf',
              // color:'#a20a3a',
              color:'#ffffff',
              fontSize:16,fontFamily:'OpenSans-Bold', }}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={{ 
                // color: '#02a7bf',
                // color:'#a20a3a',
                color:'#ffffff',
                 textDecorationLine: 'underline',fontFamily:'OpenSans-Bold', fontWeight: 900,fontSize:17}}> Register Now</Text>
            </TouchableOpacity>
          </View>
        </>}
        {step == 2 && <>
          <>

            <View style={Styles.inputContainer}>
              <View style={Styles.introContainer}>
                <Text style={Styles.header}>Enter your pin</Text>
              </View>
              <View style={{ alignItems: 'center',top:15 }}>
                <SmoothPinCodeInput password mask="﹡"
                  
                  cellSize={50}
                  cellSpacing={15}
                  cellStyle={{
                    borderWidth: 3,
                    // borderColor: '#02a7bf',
                    // borderColor: '#a20a3a',
                    borderColor:'#ffffff',
                    borderRadius:12
                  }}
                  textStyle={{
                    fontSize: 24, 
                    // color: '#a20a3a'
                    color:'#ffffff'
                  }}
                  textColor={'#a20a3a'}
                  codeLength={4}
                  // codeLength ={3}        
                  value={varOtp}
                  onTextChange={handleOtpChange}
                />
              </View>
              {/* <TextInput
                  keyboardType="numeric"
                  style={Styles.textInputStyle}
                  placeholder="Enter PIN"
                  onChangeText={handleOtpChange}
                  secureTextEntry={true}
                  
                /> */}
            </View>
            <View style={Styles.messageContainer}>
            <TouchableOpacity style={Styles.backBtn} onPress={() => decrementStep()}>
       <Text style={Styles.nextSubBtnFont}>
       <Image source={require('../assets/left2.png')} style={{ resizeMode: 'contain', width:25, height:25 }} />
        Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.nextSubBtn} onPress={handleLogin} disabled={ (step === 2 && varOtp.length !== 4)}>
        <Text style={Styles.nextSubBtnFont}>
        Next
        <Image source={require('../assets/right2.png')} style={{ resizeMode: 'contain', width:25, height:25 }} />
        </Text>
       </TouchableOpacity>
      
      </View>
          </>
        </>}
        {step == 2 &&
          <>
            {/* <View style={[Styles.loginContainer]}>
              <TouchableOpacity onPress={() => decrementStep()}>
                <Text >Back</Text>
              </TouchableOpacity>

              {step === 2 && (
                <TouchableOpacity onPress={handleLogin}>
                  <Text>Next</Text>
                </TouchableOpacity>
              )}
            </View> */}
            {/* <View style={{backgroundColor:'black',height:50}}> */}
            {/* <TouchableOpacity style={Styles.backBtn} onPress={() => decrementStep()}>
       <Text style={Styles.nextBtnFont}>back</Text>
      </TouchableOpacity> */}
            {/* <TouchableOpacity style={Styles.backBtn} onPress={() => decrementStep()} >
        <Text style={Styles.nextBtnFont}>Back</Text>
       </TouchableOpacity> */}
            {/* <TouchableOpacity style={Styles.nextSubBtn} onPress={() => decrementStep()} >
        <Text style={Styles.nextBtnFont}>Next</Text>
       </TouchableOpacity> */}
            {/* </View> */}
          </>
        }
      </View>
      {/* </ImageBackground> */}
     
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const Styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },
  disabledBtn: {
    // backgroundColor: 'lightblue', 
    // backgroundColor:'#c28090'
    backgroundColor:'#9298ed'
    
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
    // backgroundColor: 'rgba(32,159,178,255)',
    // justifyContent: 'flex-end',
    position:'relatived',
    // backgroundColor:'rgba(117, 124, 232,0.1)'
    backgroundColor:'#ffffff'

  },
  loginContainer: {
    width: '100%',
    height: '50%',
    // backgroundColor: '#fdbd30',
    // backgroundColor:'rgba(23,6,245,0.3)',
    backgroundColor:'#3f50b5',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 10,
    position:'absolute',
    bottom:0
    


  },
  inputContainer: {
    width: '78%',
    height: 60,
    alignSelf: 'center',
    marginTop: 30

  },
  placeHolderText: {
    color: 'grey',
  },
  header: {
    fontSize: 22,
    // color: '#02a7bf',
    // color:'#a20a3a',
    color:'#ffffff',
    fontFamily: 'EBGaramond-Bold'
  },
  introContainer: {
    paddingVertical: 10
  },
  textInputStyle: {
    width: '100%',
    height: 60,
    borderWidth: 2,
    borderRadius: 5,
    // borderColor:'#02a7bf',
    borderColor:'#a20a3a',
    borderRadius: 20,
    paddingLeft: 50,
  },
  nextBtn: {
    width: '60%',
    height: 40,
    // backgroundColor: '#04bbd6',
    // backgroundColor:'#a20a3a',
    // backgroundColor:'#757ce8',
    backgroundColor:'#ffffff',
    alignSelf: 'center',
    marginTop: 75,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: '30%',
    height: 50,
    // backgroundColor: 'rgba(24,117,130,255)',
    marginTop: 70,
    marginLeft: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextSubBtn: {
    width: '30%',
    height: 50,
    marginTop: 70,
    marginLeft: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnFont: {
    fontFamily: 'OpenSans-Bold',
    color:'#3f50b5',
    fontSize: 16,
    fontWeight:'800'
  },
  nextSubBtnFont: {
    // color: '#02a7bf',
    // color:'#a20a3a',
    color:'#ffffff',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold'
  },
  noAccContainer: {
    color: 'rgba(24,117,130,255)', fontWeight: 500, alignSelf: 'center', top: 30
  },
  messageContainer: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }

});
export default Login;
