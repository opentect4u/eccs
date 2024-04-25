import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image,Alert  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import RouteGaurdContext from '../Context/AuthGuard';
import { useSocket } from '../Context/Socket';


function HeaderComponent() {
  const [bankid,setbankid] = useState(null)
  const { isConnected,handleEmit,onEvent,handleEvent,GetStorage } = useSocket();
  const headerHeight = 0.07 * SCREEN_HEIGHT;
  const {setAuthDT}  = useContext(RouteGaurdContext);  
  const navigation = useNavigation();
  
  
  useEffect(() => {
    GetStorage()
    handleEmit()
    // handleEvent()
    if (isConnected) {
      
      console.log('Socket is connected!');
     
    } else {
      console.log('Socket is disconnected!');
    }
  }, [isConnected]);
  // useEffect(()=>{
  //   console.log('First useEffect')
  //   onEvent()
  // },[])

//   const GetStorage = async () => {
//     try {
//         const asyncData = await AsyncStorage.getItem(`login_data`);
//         console.log('bank id from localstorage ',JSON.parse(asyncData)?.bank_id)
//         // console.log(JSON.parse(asyncData)?.bank_id,'bank_iddddd')
//         setbankid(JSON.parse(asyncData)?.bank_id)
//         // console.log(bankid,'bankidddd ')
//     }
//     catch (err) {
//         console.log(err,'err');
//     }

// }


    handleLogout = () => {
      // Show alert when logout button is pressed
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Logout',
            onPress: async () => {
              try {
                await AsyncStorage.clear();
                setAuthDT(null);
              } catch (error) {
                console.error('Error clearing AsyncStorage:', error);
              }
  
              // Navigate to the login screen
              navigation.navigate('Login');
            }
          }
        ],
        { cancelable: false }
      );
    };
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10,height:headerHeight,backgroundColor:'#ffffff',borderBottomWidth:1 }}>
        {/* <TouchableOpacity onPress={() => navigation.openDrawer()}> */}
        <TouchableOpacity >
          {/* <Image source={require('../assets/left.png')} style={{ width: 35, height: 35 }} /> */}
        </TouchableOpacity>
  
        {/* Your Logo */}
        {/* <Image source={require('../assets/sss_Colo.png')} style={{ width: 65, height: 40,resizeMode: 'contain',alignSelf:'center' }} /> */}
        <Image source={require('../assets/pnbco.png')} style={{ width: 50, height: 50,resizeMode: 'contain',alignSelf:'center' }} />
  
        <TouchableOpacity onPress={handleLogout}>
        <Image source={require('../assets/logout4.png')} style={{ width: 25, height: 25,top:5 }} />
        </TouchableOpacity>
      </View>
    );

}


export default HeaderComponent;