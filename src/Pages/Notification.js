import React, { useState, useEffect } from 'react';
import HeaderComponent from '../Components/HeaderComponent';
import {View, StyleSheet, Image, Alert , Text, TouchableOpacity, ImageBackground, Dimensions,ActivityIndicator,ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import { useSocket } from '../Context/Socket';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import Toast from 'react-native-toast-message';





const Notification = () => {
  const { socketOndata } = useSocket();
  const welcomContHeight = 0.25 * SCREEN_HEIGHT;
 
  useEffect(() => {
    GetStorage()
    console.log(socketOndata,'socketOndata noti')
}, [])

const GetStorage = async () => {
  try {
      const asyncData = await AsyncStorage.getItem(`login_data`);
  }
  catch (err) {
      console.log(err);
  }
}


const handlePress = async (item) => {
  Alert.alert(
    'Notification',
    item.narration,
    [
      {
        text: 'OK',
        onPress: async () => {
        const asyncDatalg = await AsyncStorage.getItem(`login_data`);
        const user_name = JSON.parse(asyncDatalg)?.user_name;
        const bank_id = JSON.parse(asyncDatalg)?.bank_id
        
        const apidata = {
           id:item.id,
           user:user_name,
           bank_id:bank_id
        };
        console.log(apidata,'apidata alert')
      
        try {
          const response = await axios.post(`${BASE_URL}/api/noti_view_flag`, apidata, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log(response.data, 'noti flag')
          if (response.data.suc === 1) {
            Toast.show({
              type: 'success',
              text1: 'Thank you for your feedback',
              visibilityTime: 5000
            })
          }
          else if (response.data.suc === 0) {
            
            Toast.show({
              type: 'error',
              text1: 'API error',
              visibilityTime: 5000
            })
          }
        }
        catch (error) {
          console.log(error);
        }
       }
      },
    ],
    { cancelable: false }
  );
 

};
  return (
  //  <View>
  //   <HeaderComponent/>
  //   <View>
  //       <ImageBackground
  //         source={require('../assets/bg.png')} // Replace with the actual path to your image
  //         style={{ resizeMode: 'cover' }}
  //       >
  //          <View style={{ height: welcomContHeight, width: 'screenWidth', position: 'relative' }}>
  //           <Text style={Styles.containerText}> Notification</Text>
            
  //           <View style={Styles.mainContainer}>
  //           <ScrollView vertical>
  //             <View style={Styles.profileContainer}>
  //               <View style={{ alignItems: 'center' }}>
  //                 <Text style={Styles.mainContHeader}>
  //                   Get your notifications here
  //                 </Text>
  //               </View>
    
  //   {socketOndata.map(item => (
  //       <View key={item.id} style={{height:60,width:'100%',backgroundColor:'rgba(211, 211, 211,0.3)',marginTop:10,borderRadius:40,alignSelf:'center',flex:1,flexDirection:'row'}}>
  //         <View style={{height:40,width:40,borderRadius:20,backgroundColor:'white',top:10,left:10,alignItems:'center',justifyContent:'center'}}>
  //          <Image source={require('../assets/bell.png')} style={{ resizeMode: 'contain', width:20, height:20 }} />
  //         </View>
  //         <View style={{width:290,height:70,left:20}}>
  //         <Text style={{color:'black',fontSize:18,top:15}}>{item.narration}</Text>
  //         </View>
  //       </View>
  //     ))}
    
  //             </View>
  //             </ScrollView>
  //           </View>


  //         </View>
  //       </ImageBackground>
  //     </View>
   
  //  </View>



  <View style={styles.container}>
      <HeaderComponent />
      <ImageBackground source={require('../assets/bg.png')} style={styles.backgroundImage}>
        <View style={[styles.container, { height: welcomContHeight,backgroundColor:'white' }]}>
          <Text style={styles.containerText}>Notification</Text>
          <ScrollView style={styles.scrollView}>
          
            <View style={styles.notificationContainer}>
              {socketOndata.map(item => (
                <TouchableOpacity key={item.id} onPress={() => handlePress(item)}>
                <View style={styles.notificationItem}>
                  <View style={styles.notificationIconContainer}>
                    <Image source={require('../assets/bell3.png')} style={styles.notificationIcon} />
                  </View>
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationText}>{item.narration}</Text>
                    <Text style={styles.notificationText}>{item.id}</Text>
                  </View>
                  {item.view_flag == 'N' &&<View style={styles.notificationSeen}>
                   <View style={{ height:8,width:8,borderRadius:4,backgroundColor:'#a20a3a',
                  }}>
                   </View>
                  </View>}
                </View>
              </TouchableOpacity>
              ))}
              {/* <View style={styles.notificationItem}>
                  <View style={styles.notificationIconContainer}>
                    <Image source={require('../assets/bell.png')} style={styles.notificationIcon} />
                  </View>
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationText}>item.narration</Text>
                  </View>
                  
                </View> */}
              
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>


  );
};

const screenWidth = Dimensions.get('window').width;
// const Styles = StyleSheet.create({
//   mainContainer: {
//     height: 700,
//     borderTopLeftRadius: 40,
//     borderTopRightRadius: 40,
//     width: '100%',
//     backgroundColor: 'white',
//     alignSelf: 'center',
//     position: 'absolute',
//     top: 120,
//     padding: 20,
//   },
//   profileContainer: {
//     position: 'relative',
//   },
//   containerText: {
//     fontSize: 20,
//     fontWeight: '900',
//     color: 'white',
//     top: 50,
//     alignSelf: 'center'
//   },
//   mainContHeader: {
//     color: '#209fb2',
//     fontSize: 18,
//     fontWeight: '900',
//     padding: 15,
//     borderBottomWidth: 0.5,
//     borderBottomColor: 'black',
//   },

//   inputContainer: {
//     width: '80%',
//     height: 60,
//     alignSelf: 'center',
//     marginTop: 30

//   },
//   textInputStyle: {
//     width: '80%',
//     height: 100,
//     alignSelf: 'center',
//     marginTop: 20,
//   },
//   submitBtn: {
//     backgroundColor: '#04bbd6',
//     width: 100,
//     padding: 10,
//     borderRadius: 10,
//     marginTop: 10,
//     alignSelf: 'center',

//   },
//   submitBtnTxt: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 15,
//     fontWeight: '800'
//   }

// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  containerText: {
    fontFamily:'OpenSans-ExtraBold',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginTop: 50,
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  notificationContainer: {
    padding: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(211, 211, 211,0.3)',
    backgroundColor:'rgba(162, 10, 58, 0.1)',
    borderRadius: 40,
    marginBottom: 10,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  notificationIcon: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  notificationSeen:{
    flex:1,
    marginLeft:210
  },
  notificationText: {
    fontFamily:'OpenSans-ExtraBold',
    color: 'black',
    fontSize: 18,
  },
});


export default Notification;