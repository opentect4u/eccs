import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image, TextInput, Text, Button, TouchableOpacity, ImageBackground,KeyboardAvoidingView,useColorScheme } from 'react-native';
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
// import OTPInputView from '@twotalltotems/react-native-otp-input';

function Login({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark'
  // const navigation = useNavigation();
  const { setAuthDT } = useContext(RouteGaurdContext);
  const { socket } = useContext(SocketContext);
  const [step, setStep] = useState(1)
  const [phnNo, setPhnNo] = useState('');
  const [varOtp, setOtp] = useState('');
  const [userData, setUserData] = useState(null);

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
    if (step == 1 && phnNo.length >= 10) {
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
        user_id: phnNo,
        password: varOtp
      };
      console.log(apiParams)
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
          // console.log(socket,'sss');

          // console.log(await AsyncStorage.getItem(`login_data`), 'AsyncStorage')
          navigation.navigate('BottomNav');
          // navigation.replace('BottomNav');

        }
        else if (response.data.suc === 0) {
          Toast.show({
            type: 'error',
            text1: 'Pin no. mismatch!',
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
      {/* <Text style={Styles.placeHolderText}>{ }</Text> */}
      <TextInput
        style={Styles.textInputStyle}
        placeholder={"Enter your phone no."}
        placeholderTextColor={isDarkMode ? 'black' : 'black'}
        color={isDarkMode ? 'black' : 'black'}
        onChangeText={handlePhnNoChange}
        keyboardType="numeric"
        defaultValue={phnNo}
      />
    </View>
  };
  const handleOtpChange = (value) => {
    setOtp(value);
    console.log(value, 'varOtp')
  };
  const nextButton = () => {
    return (

      <TouchableOpacity style={Styles.nextBtn} onPress={() => incrementStep().then} disabled={(step === 1 && phnNo.length < 10)}>
        <Text style={Styles.nextBtnFont}>Next</Text>
      </TouchableOpacity>
    )
  }
  useEffect(() => {
    console.log(step)
    console.log(LoginData)
  }, [step]);

  return (
    
    <KeyboardAvoidingView behavior='padding' style={Styles.container}>
    
      <ImageBackground
        source={require('../assets/bg.png')}
      
      >
      <Image source={require('../assets/Dark_Mode_Logo.png')} style={{ resizeMode: 'contain', width: '90%', top: 60,alignSelf:'center' }} />

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
            <Text style={{ color: '#02a7bf', fontWeight: 700,fontSize:16 }}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={{ color: '#02a7bf', textDecorationLine: 'underline', fontWeight: 900,fontSize:17}}> Register Now</Text>
            </TouchableOpacity>
          </View>
        </>}
        {step == 2 && <>
          <>
            {/* <Text style={Styles.textStyle}>Bank Name: {bankName}</Text> */}
            {/* <Text style={{top:18,color:'black',fontWeight:'bold',fontSize:13}} >Please enter the Otp sent to your mobile no.</Text> */}
            <View style={Styles.inputContainer}>
              <View style={Styles.introContainer}>
                <Text style={Styles.header}>Enter your pin</Text>
              </View>
              <View style={{ alignItems: 'center',top:15 }}>
                <SmoothPinCodeInput password mask="﹡"
                  cellSize={50}
                  cellSpacing={15}
                  cellStyle={{
                    borderWidth: 2,
                    borderColor: '#02a7bf',
                    borderRadius:12
                  }}
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
       <Image source={require('../assets/left.png')} style={{ resizeMode: 'contain', width:20, height:20 }} />
        Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.nextSubBtn} onPress={handleLogin} disabled={ (step === 2 && varOtp.length !== 4)}>
        <Text style={Styles.nextSubBtnFont}>
        Next
        <Image source={require('../assets/right.png')} style={{ resizeMode: 'contain', width:20, height:20 }} />
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
      </ImageBackground>
     
    </KeyboardAvoidingView>
    
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
    backgroundColor: 'rgba(32,159,178,255)',
    justifyContent: 'flex-end',
    // backgroundColor: '#fdbd30',
    // justifyContent: 'space-around',

  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
    alignItems: 'center',
    justifyContent: 'flex-end' // You can customize the alignment as needed

  },
  loginContainer: {
    width: '99%',
    height: '38%',
    backgroundColor: 'white',
    // backgroundColor:'#ccf2f0',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 10


  },
  // logoImg: {
  //   width: '100%',
  //   height: '100%',
  // },
  // circleDiv: {
  //   width: '100%',
  //   height: 100,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   padding: 10,
  // },
  // circle: {
  //   width: 75,
  //   height: 75,
  //   backgroundColor: 'rgba(24,117,130,255)',
  //   borderRadius: 50,
  //   borderWidth: 5,
  //   borderColor: 'white',
  //   overflow: 'hidden',
  //   position: 'absolute',
  //   top: -30,

  // },
  inputContainer: {
    width: '80%',
    height: 60,
    alignSelf: 'center',
    marginTop: 30

  },
  placeHolderText: {
    color: 'grey',
  },
  header: {
    fontSize: 25,
    fontWeight: '900',
    marginLeft: 10,
    color: '#02a7bf'
  },
  introContainer: {
    paddingVertical: 10
  },
  textInputStyle: {
    width: '100%',
    height: 60,
    borderWidth: 2,
    borderRadius: 5,
    // borderColor: 'rgba(24,117,130,255)',
    borderColor:'#02a7bf',
    borderRadius: 20,
    paddingLeft: 50,
  },
  nextBtn: {
    width: '80%',
    height: 50,
    // backgroundColor: 'rgba(24,117,130,255)',
    backgroundColor: '#04bbd6',
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
    // backgroundColor: 'rgba(24,117,130,255)',
    // alignSelf:'f',
    marginTop: 70,
    marginLeft: 20,
    // borderRadius:45,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnFont: {
    color: 'white',
    fontSize: 16,
  },
  nextSubBtnFont: {
    color: '#02a7bf',
    fontWeight:'900',
    fontSize: 20,
  },
  noAccContainer: {
    color: 'rgba(24,117,130,255)', fontWeight: 500, alignSelf: 'center', top: 30
  },
  messageContainer: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }

});
export default Login;
