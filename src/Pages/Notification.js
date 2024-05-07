import React, { useState, useEffect } from 'react';
import HeaderComponent from '../Components/HeaderComponent';
import { View, StyleSheet, Image, Alert, Text, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import { useSocket } from '../Context/Socket';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import Toast from 'react-native-toast-message';
import io from 'socket.io-client';
import { color } from 'react-native-elements/dist/helpers';





const Notification = () => {
  const { socketOndata } = useSocket();
  const [empCode,setEmpCode] = useState();
  const welcomContHeight = 0.5 * SCREEN_HEIGHT;

  useEffect(() => {
    GetStorage()
    console.log(socketOndata, 'socketOndata in notification page')
    const socket = io("http://202.21.38.178:3002");

    return () => {
      socket.off('send notification');
    };
  }, [])

  const GetStorage = async () => {
    try {
      const asyncData = await AsyncStorage.getItem(`login_data`);
      setEmpCode(JSON.parse(asyncData)?.emp_code)
      console.log(empCode,'empCode')
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
              id: item.id,
              user: user_name,
              bank_id: bank_id
            };
            console.log(apidata, 'apidata alert')

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

  const handleDltAll = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/clear_all_notify?send_user_id=${147}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data, 'clear_all_notify')
      if (response.data.suc === 1) {  
        console.log('deleted')
        Toast.show({
          type: 'success',
          text1: 'All notification removed',
          visibilityTime: 5000
        })

      }
      else {
        console.log('not deleted')
        Toast.show({
          type: 'error',
          text1: 'API error',
          visibilityTime: 5000
        })
       
      }
    }
    catch (error) {   
    }
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
      {/* <ImageBackground source={require('../assets/bg.png')} style={styles.backgroundImage}> */}
      <View style={{height:100,width:'100%',backgroundColor:'#3f50b5',alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize: 20,fontWeight: '900',color:'#ffffff'}}>Notification</Text>
      </View>
        {/* <View style={[styles.container, { height: welcomContHeight, backgroundColor: 'white' }]}> */}
        <View style={[styles.container]}>

          {/* <Text style={styles.containerText}>Notification</Text> */}
          <ScrollView style={styles.scrollView}>

            <View style={styles.notificationContainer}>
            {socketOndata.filter(item => item.send_user_id === empCode).length > 0 ? (
              socketOndata.map(item => (
                empCode === item.send_user_id && (
                <TouchableOpacity key={item.id} onPress={() => handlePress(item)}>
                  <View style={styles.notificationItem}>
                  {item.view_flag == 'N' && <View style={styles.notificationSeen}>
                      <View style={{
                        height: 8, width: 8, borderRadius: 4, backgroundColor: '#3f50b5',
                      }}>
                      </View>
                    </View>}
                    <View style={styles.notificationIconContainer}>
                      <Image source={require('../assets/bell4.png')} style={styles.notificationIcon} />
                    </View>
                    <View style={styles.notificationTextContainer}>
                      <Text style={[styles.notificationText,item.view_flag === 'N' &&  styles.unseenNotificationText ]}>
                        {item.narration.length > 25 ? `${item.narration.substring(0,35)}...` : item.narration}
                      </Text>
                      {/* <Text style={styles.notificationText}>{item.id}</Text> */}
                    </View>
                    {/* {item.view_flag == 'N' && <View style={styles.notificationSeen}>
                      <View style={{
                        height: 8, width: 8, borderRadius: 4, backgroundColor: '#a20a3a',
                      }}>
                      </View>
                    </View>} */}
                  </View>
                </TouchableOpacity>
                )
              ))
            )
            :
            (
              <View>
                 <View style={{ height: 500, width: '100%', alignItems: 'center', marginTop: 30,padding:5 }}>
            <Image source={require('../assets/nodata4.png')} style={{ resizeMode: 'contain', height: 70, width: '100%', alignSelf: 'center' }} />

            <Text style={{ color: '#3f50b5', fontSize: 17, alignSelf: 'center', fontFamily: 'OpenSans-ExtraBold', marginTop: 10,fontWeight:'900' }}>No new notifications at the moment.</Text>
          </View>
              </View>
            )}


                {socketOndata.filter(item => item.send_user_id === empCode).length > 0 && (
              <Button
                    mode="contained"
                    onPress={handleDltAll}
                    style={{ backgroundColor: '#3f50b5', paddingHorizontal: 20,color:'#ffffff',width:'90%',height:45,alignSelf:'center',fontSize:17,marginBottom:10 }}>
                    Delete all
                  </Button>
                    )}
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
      {/* </ImageBackground> */}
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
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginTop: 50,
  },
  scrollView: {
    flex: 1,
    marginTop: 5,
  },
  notificationContainer: {
    padding: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(211, 211, 211,0.3)',
    // backgroundColor:'rgba(162, 10, 58, 0.1)',
    backgroundColor: '#d9dcf0',
    borderRadius: 8,
    marginBottom: 7,
    height: 70,
    shadowColor: '#c5cbe9',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3, // This is for Android
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  notificationIcon: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  notificationTextContainer: {
    // flex: 1,
    height: 40,
    width: '75%',
    marginLeft: 10,
    // backgroundColor:'black',
    justifyContent:'center'
  },
  notificationSeen: {
    height: 8,
    width: 8,
    // backgroundColor:'black',
    alignItems:'center',
    marginLeft:5
    // flex:1,

  },
  notificationText: {
    fontFamily: 'OpenSans-ExtraBold',
    color: 'black',
    fontSize: 17,
    fontWeight:'600'
  },
  unseenNotificationText:{
    fontFamily: 'OpenSans-ExtraBold',
    color: 'black',
    fontSize: 17,
    fontWeight:'900'
  }
});


export default Notification;