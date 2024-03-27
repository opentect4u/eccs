import React, { useEffect, useState } from 'react';
// import { Text } from "react-native-paper";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity,ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MMKV } from 'react-native-mmkv';
// import {AsyncStorage} from 'react-native';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import BankData from '../data/bank_dummy_data.json';
import CustomerData from '../data/customer_dummy_data';
import OtpData from '../data/otp_dummy_data.json';
import PinData from '../data/pin_dummy_data.json';
import Toast from 'react-native-toast-message';
import CountDown from 'react-native-countdown-component';
import { BASE_URL } from '../config/config';
import axios from 'axios';
// const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

const regStorage = new MMKV({
  id: 'reg-store'
})

function Registration({navigation}) {
  const [isresend, setresend] = useState(false);
  const [step, setStep] = useState(1)
  const [bankCode, setBankCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [custName, setCustName] = useState('');
  const [phnNo, setPhnNo] = useState('');
  const [varOtp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const [error, setError] = useState('');
  const [counter,setCounter] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [useBank_code, setBank_code] = useState([]);
  const [otp, setResOtp] = useState('');
  const [userData, setUserData] = useState(null);

  



  useEffect(()=>{
    // console.log(regStorage.getString(`bank_name`))
   
    SetStorage();

    setTimeout(() => {
      GetStorage();
    }, 500);
  },[])

  const SetStorage = async () =>{
    try {
      await AsyncStorage.setItem(
       'abcd'
      );
    } catch (error) {
      // Error saving data
    }
  }

  const GetStorage = async () =>{
    console.log(`asdasdasddas`)
    try {
      const value = await AsyncStorage.getItem('abcd');
      console.log('asdasd')
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      console.log(error)
      // Error retrieving data
    }
  }

  const incrementStep = async () => {
    if (step == 1) {
        try {
        const response = await axios.get(`${BASE_URL}/api/bank_dt?bank_id=${bankCode}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data,'res-data')
        if(response.data.suc === 1){
          const bankData = response.data.msg[0];
          const bank_name = response.data.msg[0].bank_name;
          setBank_code(response.data.msg[0].bank_id)
          setBankName(response.data.msg[0].bank_name);

          setStep(stepCount => stepCount + 1)
        }
        else{
          // console.log('error')
          Toast.show({
            type:'error',
            text1:'Bankcode mismatched..!',
            visibilityTime:5000
          })
        }
      }
      catch (error) {
        console.log(error);
      }
      // if(dt.length > 0){
      //   setStep(stepCount => stepCount + 1)
      //   setBankName(dt[0].bank_name);

      // }
      //   else {
      //     Toast.show({
      //       type:'error',
      //       text1:'Bankcode mismatched..!',
      //       visibilityTime:5000
      //     })
      //   }
      // BankData.forEach((item) => {
      //   if (item.bank_code == bankCode) {
      //     console.log('Bankcode- matched')
      //     setStep(stepCount => stepCount + 1)
      //     setBankName(item.bank_name);
      //   }
      //   else {
      //     console.log('Bankcode- mismatched')
      //     Toast.show({
      //       type:'error',
      //       text1:'Bankcode mismatched..!',
      //       visibilityTime:5000
      //     })
      //   }
      // })
    }
    else if (step == 2) {
      const apiParams = {
        bank_id: useBank_code,
        tb_name: 'md_member_rpf',
        phone: phnNo
      };
      // console.log(apiParams,'object')
      try {
        const response = await axios.get(`${BASE_URL}/api/check_user`,
         {
          params: apiParams,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data,'after phone number')
        // console.log(response.data.data[0].member_name,'after phone number')

        setUserData(response.data.data[0]);

        if(response.data.suc === 1){
          // console.log(response.data,'registered')
          // setBankName(response.data.msg[0].bank_name);
          setCustName(response.data.data[0].member_name);
          console.log(custName,'custname')
          // console.log('suc-1')
          //start for otp
          try {
            const response = await axios.get(`${BASE_URL}/api/login_otp?phone=${phnNo}`, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            console.log(response.data,'res-otp')

            if(response.data.suc === 1){
              // console.log(response.data.otp)            
              setResOtp(response.data.otp)
              setStep(stepCount => stepCount + 1)
              startTimer();
            }
            else{
              // console.log('suc-0')
              Toast.show({
                type:'error',
                text1:'Otp not sent..!',
                visibilityTime:5000
              })
            }
          }
          catch (error) {
            console.log(error);
          }
          //start for otp
          
        }
        else{
          // console.log('suc-0')
          Toast.show({
            type:'error',
            text1:'your phone no. is not registered with us!',
            visibilityTime:5000
          })
        }
      }
      catch (error) {
        console.log(error);
      }
      
      // CustomerData.forEach((item) => {
      //   if (item.phn_no == phnNo) {
         
      //     console.log('Phn no.- matched')
      //     setStep(stepCount => stepCount + 1)
      //     startTimer();
      //     setBankName(item.bank_name);
      //     setCustName(item.cust_name);
      //   }
      //   else {
      //     console.log('Phn no.- mismatched')
      //     Toast.show({
      //       type:'error',
      //       text1:'Mobile no. mismatched.!',
      //       visibilityTime:5000
      //     })
      //   }
      // })
     
    }
    else if (step == 3) {
      if(otp == varOtp){
        setStep(stepCount => stepCount + 1)
        // console.log('otp matched')
      }
      else{
        Toast.show({
                type:'error',
                text1:'Otp - mismatched..!',
                visibilityTime:5000
              })
      } 
      // OtpData.forEach((item) => {
      //   if (item.otp == varOtp) {
      //     console.log('Otp - matched..!')
      //     setStep(stepCount => stepCount + 1)
      //     setBankName(item.bank_name);
      //     setCustName(item.cust_name);
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
    else if(step == 4){
      // try {
      //   const response = await axios.post(`${BASE_URL}/api/save_user`, {
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   });
      //   // console.log(response.data.suc,'res-data')
      //   if(response.data.suc === 1){
      //   }
      //   else{
      //     Toast.show({
      //       type:'error',
      //       text1:'Not submitted!',
      //       visibilityTime:5000
      //     })
      //   }
      // }
      // catch (error) {
      //   console.log(error);
      // }
    }

    else {
      console.log('stepppppp')
    }



  }
  const handleBankCodeChange = (value) => {
    setBankCode(value);
  };
  const handlePhnNoChange = (value) => {
    setPhnNo(value);

  };
  const handleOtpChange = (value) => {
    setOtp(value);
  };

  // const decrementStep = () =>{
  //   setStep(prev => prev--)
  // }
  // const nextButton = (props) => {
  //   return (
  //     <TouchableOpacity  style={Styles.nextBtn} onPress={props.onClick}>
  //      <Text style={Styles.nextBtnFont}>Next</Text>
  //     </TouchableOpacity>
  //   )
  // }
  useEffect(() => { console.log(step)
  // const timer = counter > 0 && setInterval(() =>
  // setCounter(counter - 1),1000);
  // return () => clearInterval(timer);
 }, [step]);
  // setTimeout(()=>{
  //   Toast.show({
  //     type:'success',
  //     text1:'welcome',
  //     text2:'hiii',
  //     visibilityTime:5000
  //   })
  // },2000)
  const startTimer = () => {
    // return counter > 0 && setInterval(() => setCounter(prevCounter => prevCounter - 1), 1000);
    const timerId = setInterval(() => {
      setCounter(prevCounter => {
        const newCounter = prevCounter - 1;
        
        // Check if the new counter is greater than 0
        if (newCounter >= 0) {
          return newCounter;
        } else {
          // If counter is 0, clear the interval and return 0
          clearInterval(timerId);
          setIsResendDisabled(false);
          return 0;
        }
      });
    }, 1000);
  };
  const handleResendPress = () => {
    // Reset the counter, disable resend, and start the timer again
    Toast.show({
      type:'success',
      text1:'OTP sent successfully..!',
      visibilityTime:5000
    })
    setCounter(60);
    setIsResendDisabled(true);
    startTimer();
  };
  
  const handlePasswordChange = (text) => {
    setPassword(text);
    updateSubmitButtonState(text, confirmPassword);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    updateSubmitButtonState(password, text);
    if (password !== confirmPassword) {
      console.log("Password mismatch");
    }
  };

  const updateSubmitButtonState = (password, confirmPassword) => {
    // setSubmitDisabled(password !== confirmPassword);
    if (password !== confirmPassword) {
      setError("*Password mismatch");
      setSubmitDisabled(true);
    } else {
      setError('');
      setSubmitDisabled(false);
    }
  };

  const handleSubmit = async () => {
    if (!isSubmitDisabled) {
      const apiParams = {
        bank_id:useBank_code,
        emp_code:userData.emp_code,
        user_name:userData.member_name,
        user_id:phnNo,
        // password:password,
        tb_name:"td_user"
      };
      console.log(apiParams,'dataset')
      try {
        const dt = {...apiParams,password:password};
        console.log(dt);
        const response = await axios.post(`${BASE_URL}/api/save_user`,{...apiParams,password:password}, {
          // params: apiParams,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data,'res-data')
        if(response.data.suc === 1){
          await AsyncStorage.setItem('user_data', JSON.stringify(apiParams));
          await AsyncStorage.setItem('member_id',JSON.stringify(response.data.data[0].member_id))
          Toast.show({
            type:'success',
            text1:'Registered successfully..!',
            visibilityTime:5000
          })
          navigation.navigate('Login');
        }
        else{
          Toast.show({
            type:'error',
            text1:'Your id is already registered with us!',
            visibilityTime:5000
          })
        }
      }
      catch (error) {
        console.log(error);
      }
     
    }
    else{
      // console.log('error')
    }
  };
  return (
    
    <View style={Styles.container}>
      <ImageBackground
        source={require('../assets/bg.png')} // Replace with the actual path to your image
        style={Styles.backgroundImage}
      >
         <Text style={{color:'white',fontSize:30,fontWeight:'500',marginVertical:20,alignSelf:'center',}}>Register Here</Text>
        {/* Your other components go here */}
      <View style={Styles.loginContainer}>
      {step == 1 && 
        <>
        <TextInput
        value={bankCode}
        onChangeText={handleBankCodeChange}
        keyboardType="numeric"
        style={Styles.input}
        placeholder="Enter the bank code here"
      /></>}
      {step == 2 &&
        <>
          <Text style={Styles.textStyle}>Welcome To {bankName}</Text>
          <TextInput
            onChangeText={handlePhnNoChange}
            keyboardType="numeric"
            style={Styles.input}
            placeholder="Type your mobile number here"
          />
          </>
          
          }
      {step == 3 &&
        <>
          {/* <Text style={Styles.textStyle}>Bank Name: {bankName}</Text> */}
          <Text style={Styles.textStyle}>Welcome {custName}</Text>
          <Text style={{top:18,color:'black',fontWeight:'900',fontSize:15}} >Please enter the Otp sent to your mobile no.</Text>
          <TextInput
          keyboardType="numeric"
          onChangeText={handleOtpChange}
            style={Styles.input}
            placeholder="Enter the Otp"
          />       
          </>
      }

      {step == 4 &&
        <><Text style={Styles.textStyle}>Bank Name: {bankName}</Text>
          <Text style={Styles.textStyle}>Customer Name: {custName}</Text>
          <TextInput
          onChangeText={handlePasswordChange}
          keyboardType="numeric"
            style={Styles.input}
            placeholder="Enter PIN"
          />
          <TextInput
          onChangeText={handleConfirmPasswordChange}
          keyboardType="numeric"
          style={Styles.input}
          placeholder="Confirm PIN"
          />
          <View style={{top:25}}>{error ? <Text style={Styles.errorText} >{error}</Text> : null}</View>
          </>
      }
      {step <= 3 && <><TouchableOpacity style={Styles.nextBtn} onPress={() => incrementStep()}>
            <Text style={Styles.nextBtnFont}>Next</Text>
          </TouchableOpacity></>}

      {step == 3 && 
      <>
      <Text style={{top:7,fontWeight:'900'}}>
        Resend OTP in <Text style={{color:'green',fontWeight:'900'}}>00:{counter}</Text>
      </Text>
      <TouchableOpacity style={{height:35,width:'35%',borderRadius:50,alignItems:'center',justifyContent:'center', top:20,backgroundColor: isResendDisabled ? 'rgba(0, 128, 0,0.5)' : 'green'}} disabled={isResendDisabled} onPress={handleResendPress}>
      <Text style={{color:'white'}} >Resend OTP</Text>
      
      </TouchableOpacity>
      </> }
     
      {step == 4 && 
      <TouchableOpacity style={Styles.nextBtn} onPress={handleSubmit} 
        disabled={isSubmitDisabled}>
        <Text style={Styles.nextBtnFont}>Submit</Text>
      </TouchableOpacity>}
      </View>
      </ImageBackground>
    </View>

  )
}
const Styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: SCREEN_HEIGHT,
    // alignItems: 'center',
    // justifyContent:'center'

  },
  loginContainer: {
    width: '90%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 50,
    alignSelf:'center',
    alignItems:'center',
    justifyContent: 'center',
    // overflow: 'hidden',
  },
  input: {
    width: '80%',
    height: 60,
    backgroundColor: 'white',
    borderWidth: 2,
    paddingLeft: 10,
    borderRadius: 20,
    marginBottom: 10,
    color: 'black',
    top: 30,
    borderColor: '#02a7bf',
  },
  textStyle:{
   color:'#02a7bf',
   fontSize: 18,
   fontWeight: '900'
  },
  nextBtn: {
    width: '80%',
    height: 50,
    backgroundColor: '#02a7bf',
    alignSelf: 'center',
    marginTop: 60,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:50  },
    nextBtnFont: {
    color: 'white',
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize:15,
    fontWeight:'600'
  },
})

export default Registration;
