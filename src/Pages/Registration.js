import React, { Children, useEffect, useState } from 'react';
import { TextInput  } from 'react-native-paper';
import { useColorScheme, View, Text, StyleSheet, TouchableOpacity,ImageBackground,Keyboard,TouchableWithoutFeedback} from 'react-native';
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
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

// const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

const regStorage = new MMKV({
  id: 'reg-store'
})

function Registration({navigation}) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const isDarkMode = useColorScheme() === 'dark'
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
  const [showPin, setShowPin] = useState(false);
  const [showConPin, setShowConPin] = useState(false);


  



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
      try {
        const response = await axios.get(`${BASE_URL}/api/check_user`,
         {
          params: apiParams,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data,'after phone number')
        setUserData(response.data.data[0]);

        if(response.data.suc === 1){
          setCustName(response.data.data[0].member_name);
          console.log(custName,'custname')
          try {
            const response = await axios.get(`${BASE_URL}/api/check_mobile_no?bank_id=${bankCode}&user_id=${phnNo}`, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            console.log(response.data,'check_mobile_no')
            if(response.data.suc === 1){
              // setStep(stepCount => stepCount + 1)
               //Start for OTP
          try {
            const response = await axios.get(`${BASE_URL}/api/login_otp?phone=${phnNo}`, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            console.log(response.data,'res-otp')

            if(response.data.suc === 1){
                         
              setResOtp(response.data.otp)
              setStep(stepCount => stepCount + 1)
              startTimer();
            }
            else{
            
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
          //end for otp
               
              // mobile number not registered
            }
            else{
              Toast.show({
                type:'error',
                text1:'Phone number is already exists..!',
                visibilityTime:5000
              })
            }
          }
          catch (error) {
            console.log(error);
          }

         
          
        }
        else{
         
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
    const timerId = setInterval(() => {
      setCounter(prevCounter => {
        const newCounter = prevCounter - 1;
        if (newCounter >= 0) {
          return newCounter;
        } else {
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
    // if (password !== confirmPassword) {
    //   console.log("Password mismatch");
    // }
  };

  const updateSubmitButtonState = (password, confirmPassword) => {
    // setSubmitDisabled(password !== confirmPassword);
    if(password.length != 0 && confirmPassword.length != 0 ){
    if(password.length !== 4 || confirmPassword.length !== 4){
      setError("*Password must be 4 characters long");
      setSubmitDisabled(true);
    }
    else if(password !== confirmPassword){
      setError("*Password mismatch");
      setSubmitDisabled(true);
    }
    else {
        setError('');
        setSubmitDisabled(false);
      }
    }
    // if (password !== confirmPassword) {
    //   setError("*Password mismatch");
    //   setSubmitDisabled(true);
    // } else {
    //   setError('');
    //   setSubmitDisabled(false);
    // }
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
         
          console.log('suc - 1')
          Toast.show({
            type:'success',
            text1:'Registered successfully..!',
            visibilityTime:5000
          }) 
          navigation.navigate('Login');
          await AsyncStorage.setItem('user_data', JSON.stringify(apiParams));
          await AsyncStorage.setItem('member_id',JSON.stringify(response.data.data[0].member_id))
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
  const toggleShowPin = () => {
    setShowPin(!showPin);
  };
  const toggleShowConPin = () => {
    setShowConPin(!showConPin);
  };
  const isNextDisabled = () => {
    if (step === 1) {
      return !bankCode; 
    } else if (step === 2) {
      return  phnNo.length != 10; 
    }
    else if(step === 3){
      return varOtp.length < 4; 
    }
    return false; // Enable for other steps
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={Styles.container}>
      <ImageBackground
        source={require('../assets/bg3.jpg')} // Replace with the actual path to your image
        style={Styles.backgroundImage}
      >
         <Text style={{color:'#fdbd30',fontSize:30,fontWeight:'500',marginVertical:20,alignSelf:'center',}}>Register Here</Text>
        {/* Your other components go here */}
      <View style={Styles.loginContainer}>
      {step == 1 && 
        <>
        <View style={Styles.inputContainer}>
        <TextInput
         backgroundColor='transparent'
         outlineColor='#a20a3a'
         activeOutlineColor='#a20a3a'
         textColor='#a20a3a'
         mode="outlined"
         style={{ flex: 1 , marginTop:5
        }}
        value={bankCode}
        onChangeText={handleBankCodeChange}
        keyboardType="numeric"
        placeholder="Enter the bank code here"
        placeholderTextColor={isDarkMode ? '#a20a3a' : '#a20a3a'}
        color={isDarkMode ? '#a20a3a' : '#a20a3a'}
        left={<TextInput.Icon icon="bank" color={'#a20a3a'} />}
      />
      </View>
      </>}
      {step == 2 &&
        <>
          <Text style={Styles.textStyle}>Welcome To {bankName}</Text>
          <View style={Styles.inputContainer}>
          <TextInput
           backgroundColor='transparent'
           outlineColor='#a20a3a'
           activeOutlineColor='#a20a3a'
           mode="outlined"
           style={{ flex: 1 , marginTop:5
          }}
            onChangeText={handlePhnNoChange}
            keyboardType="numeric"
            placeholder="Enter your mobile number"
            placeholderTextColor={isDarkMode ? '#a20a3a' : '#a20a3a'}
            textColor={isDarkMode ? '#a20a3a' : '#a20a3a'}
            left={<TextInput.Icon icon="account" color={'#a20a3a'} />}
          />
          </View>
          </>
          
          }
      {step == 3 &&
        <>
          {/* <Text style={Styles.textStyle}>Bank Name: {bankName}</Text> */}
          <Text style={Styles.textStyle}>Welcome {custName}</Text>
          <Text style={{top:18,color:'black',fontFamily:'Montserrat-Bold',fontSize:13}} >Please enter the Otp sent to your mobile no.</Text>
          <View style={Styles.inputContainer}>
          {/* <TextInput
           backgroundColor='transparent'
           outlineColor='#02a7bf'
           activeOutlineColor='#02a7bf'
           mode="outlined"
           style={{ flex: 1 , marginTop:5
          }}
          keyboardType="numeric"
          onChangeText={handleOtpChange}          
            placeholder="Enter the Otp"
            placeholderTextColor={isDarkMode ? 'black' : 'black'}
            color={isDarkMode ? 'black' : 'black'}
            left={<TextInput.Icon icon="numeric" color={'#02a7bf'} />}
          /> */}
          <SmoothPinCodeInput password mask="﹡"
                  cellSize={50}
                  cellSpacing={15}
                  cellStyle={{
                    borderWidth: 3,
                    borderColor: '#a20a3a',
                    borderRadius:12
                  }}
                  textStyle={{
                    fontSize: 24, 
                    color: '#a20a3a'
                  }}
                  codeLength={4}      
                  value={varOtp}
                  onTextChange={handleOtpChange}
                 
                />
          </View>       
          </>
      }

      {step == 4 &&
        <>
        {/* <Text style={Styles.textStyle}>Bank Name: {bankName}</Text>
          <Text style={Styles.textStyle}>Customer Name: {custName}</Text> */}
          <Text style={{fontSize:17,color:'#a20a3a',fontFamily:'OpenSans-Bold',fontWeight:'900'}}>Create Your PIN</Text>
          <View style={Styles.inputContainer}>
          <TextInput
           backgroundColor='transparent'
           outlineColor='#a20a3a'
           activeOutlineColor='#a20a3a'
           mode="outlined"
           style={{ flex: 1 ,
          }}
          textColor='#a20a3a'
          onChangeText={handlePasswordChange}
          keyboardType="numeric"
          secureTextEntry={!showPin}
          right={<TextInput.Icon icon={showPin ? 'eye' : 'eye-off' } color={'#a20a3a'} onPress={toggleShowPin}  />}
            placeholder="Enter PIN"
            placeholderTextColor={isDarkMode ? '#a20a3a' : '#a20a3a'}
            color={isDarkMode ? '#a20a3a' : '#a20a3a'}
          />
          
          </View>
          {/* <Text style={{color:'red',alignSelf:'flex-start',left:50}}>hhjjhhj</Text> */}
          <View style={Styles.inputContainer}>
          <TextInput
          backgroundColor='transparent'
          outlineColor='#a20a3a'
          activeOutlineColor='#a20a3a'
          mode="outlined"
          style={{ flex: 1
         }}
         textColor='#a20a3a'
          onChangeText={handleConfirmPasswordChange}
          keyboardType="numeric"
          secureTextEntry={!showConPin}
          right={<TextInput.Icon icon={showConPin ? 'eye' : 'eye-off'} color={'#a20a3a'} onPress={toggleShowConPin} />}        
          placeholder="Confirm PIN"
          placeholderTextColor={isDarkMode ? '#a20a3a' : '#a20a3a'}
          color={isDarkMode ? '#a20a3a' : '#a20a3a'}
          />
          </View>
          <View style={{top:5}}>{error ? <Text style={Styles.errorText} >{error}</Text> : null}</View>
          </>
      }
      {step <= 3 && <><TouchableOpacity style={[Styles.nextBtn,
      { backgroundColor: isNextDisabled() ? '#c28090' : '#a20a3a'}]} onPress={() => incrementStep()} disabled={isNextDisabled()}>
            <Text style={Styles.nextBtnFont}>Next</Text>
          </TouchableOpacity></>}

      {step == 3 && 
      <>
      <Text style={{top:7,fontWeight:'900',color:isDarkMode ? 'black' : 'black'}}>
        Resend OTP in <Text style={{color:'green',fontWeight:'900',}}>00:{counter}</Text>
      </Text>
      <TouchableOpacity style={{height:35,width:'35%',borderRadius:50,alignItems:'center',justifyContent:'center', top:20,backgroundColor: isResendDisabled ? 'rgba(0, 128, 0,0.5)' : 'green'}} disabled={isResendDisabled} onPress={handleResendPress}>
      <Text style={{color:'white',fontFamily:'Montserrat-Bold'}} >Resend OTP</Text>
      
      </TouchableOpacity>
      </> }
     
      {step == 4 && 
      <TouchableOpacity style={[Styles.nextBtn, { backgroundColor: isSubmitDisabled ? '#c28090' : '#a20a3a'}]} onPress={handleSubmit} 
        disabled={isSubmitDisabled}>
        <Text style={Styles.nextBtnFont}>Submit</Text>
      </TouchableOpacity>}
      </View>
      </ImageBackground>
    </View>
    </TouchableWithoutFeedback>
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
    // backgroundColor: 'white',
    backgroundColor: '#fdbd30',
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
  //  color:'#02a7bf',
   color:'#a20a3a',
   fontSize: 15,
   fontFamily:'Montserrat-Bold'
  },
  nextBtn: {
    width: '80%',
    height: 50,
    // backgroundColor: '#02a7bf',
    backgroundColor:'#a20a3a',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:50  },
    nextBtnFont: {
    fontFamily:'Montserrat-Bold',
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
  inputContainer: {
    width: '78%',
    height: 60,
    alignSelf: 'center',
    marginTop: 30

  },
})

export default Registration;
