import React, { useState, useEffect } from 'react';
import HeaderComponent from '../Components/HeaderComponent';
import { View, StyleSheet, Image, Alert, Text, TouchableOpacity, TouchableWithoutFeedback,Modal,ImageBackground, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import { useSocket } from '../Context/Socket';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import Toast from 'react-native-toast-message';
import io from 'socket.io-client';
import { color } from 'react-native-elements/dist/helpers';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';





const Notification = (item ) => {
  const { socketOndata,handleEmit, countNoti  } = useSocket();
  const [notifications, setNotifications] = useState(socketOndata);
  const [empCode, setEmpCode] = useState();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const welcomContHeight = 0.5 * SCREEN_HEIGHT;

  useEffect(() => {
    GetStorage()
    console.log(socketOndata, 'socketOndata in notification page newwwww')
    const socket = io("http://202.21.38.178:3002");

    return () => {
      socket.off('send notification');
    };
  }, [])
  useEffect(() => {
    setNotifications(socketOndata);
  }, [socketOndata]);

  useEffect(() => {
    console.log(notifications, "Updated notifications state");
  }, [notifications]);

  const GetStorage = async () => {
    try {
      const asyncData = await AsyncStorage.getItem(`login_data`);
      setEmpCode(JSON.parse(asyncData)?.emp_code)
      console.log(empCode, 'empCode')
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
  const handleLongPress = (item) => {
    console.log('Handle long press, maybe show delete button')
    console.log(item.id,'handleLongPress id') 
    setSelectedItem(item.id);
    setShowBottomSheet(true);
    // setShowDeleteButton(true);
  };
  const handleDelete = async () => {
    console.log("Delete button pressed for item",item.id);
    console.log(item.id,'handleDelete id')
    console.log(selectedItem,'selectedItem')

    try {
      const response = await axios.get(`${BASE_URL}/api/notify_delete?id=${selectedItem}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data, 'notify_delete')
      if (response.data.suc === 1) {
        const updatedNotifications = socketOndata.filter(notification => notification.id !== selectedItem);
      setNotifications(updatedNotifications);
      setSelectedItem(null);
        console.log(socketOndata, 'in delete API')
        setShowBottomSheet(false)
        Toast.show({
          type: 'success',
          text1: 'Notification deleted',
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

  const handleDltAll = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/clear_all_notify?send_user_id=${147}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data.suc, 'clear_all_notify')
      if (response.data.suc == 1) {
        // socketOndata.length = 0
        console.log(socketOndata,'after delete all')
        console.log('deleted')
        Toast.show({
          type: 'success',
          text1: 'All notification removed',
          visibilityTime: 5000
        })
        setNotifications([]);
        console.log(notifications,"setNotifications")
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

    <View style={styles.container}>
      <HeaderComponent />
      <View style={{ height: 100, width: '100%', backgroundColor: '#3f50b5', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#ffffff' }}>Notification</Text>
      </View>
      <View style={[styles.container]}>
        <ScrollView style={styles.scrollView}>

          <View style={styles.notificationContainer}>
            {/* {socketOndata.filter(item => item.send_user_id === empCode).length > 0 ? ( */}
            {notifications.length > 0 ? (
              notifications.map(item => (
                empCode === item.send_user_id && (
                  <TouchableWithoutFeedback key={item.id}
                    onLongPress={() => handleLongPress(item)}
                    onPress={() => handlePress(item)}>
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
                        <Text style={[styles.notificationText, item.view_flag === 'N' && styles.unseenNotificationText]}>
                          {item.narration.length > 25 ? `${item.narration.substring(0, 35)}...` : item.narration}
                        </Text>
                        {/* <Text style={styles.notificationText}>{item.id}</Text> */}
                      </View>
                      {/* {item.view_flag == 'N' && <View style={styles.notificationSeen}>
                      <View style={{
                        height: 8, width: 8, borderRadius: 4, backgroundColor: '#a20a3a',
                      }}>
                      </View>
                    </View>} */}
                      {/* {showDeleteButton && selectedItem && selectedItem.id === item.id && (
                        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                          <Text style={styles.deleteButtonText}></Text>
                        </TouchableOpacity>
                      )} */}
                    </View>
                  </TouchableWithoutFeedback>
                )
              ))
            )
              :
              (
                <View>
                  <View style={{ height: 500, width: '100%', alignItems: 'center', marginTop: 30, padding: 5 }}>
                    <Image source={require('../assets/nodata4.png')} style={{ resizeMode: 'contain', height: 70, width: '100%', alignSelf: 'center' }} />

                    <Text style={{ color: '#3f50b5', fontSize: 17, alignSelf: 'center', fontFamily: 'OpenSans-ExtraBold', marginTop: 10, fontWeight: '900' }}>No new notifications at the moment.</Text>
                  </View>
                </View>
              )}


            {/* {socketOndata.filter(item => item.send_user_id === empCode).length > 0 && (
              <Button
                    mode="contained"
                    onPress={handleDltAll}
                    style={{ backgroundColor: '#3f50b5', paddingHorizontal: 20,color:'#ffffff',width:'90%',height:45,alignSelf:'center',fontSize:17,marginBottom:10 }}>
                    Delete all
                  </Button>
                    )} */}
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

        {/* Floating button */}
        {socketOndata.filter(item => item.send_user_id === empCode).length > 0 && (
          <TouchableOpacity style={styles.floatingButton} onPress={handleDltAll}>
            <Image source={require('../assets/delete_white.png')} style={{ resizeMode: 'contain', height: 18, width: 18, }} />
            <Text style={styles.buttonText}>Delete all</Text>
          </TouchableOpacity>
        )}

{showBottomSheet && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showBottomSheet}
          onRequestClose={() => setShowBottomSheet(false)}>
          <View style={styles.bottomSheet}>
            <TouchableOpacity onPress={() => handleDelete()} style={styles.deleteButton}>
            <Image source={require('../assets/delete_white.png')} style={{ resizeMode: 'contain', height: 30, width: 30, }} />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
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
    width: '68%',
    marginLeft: 10,
    // backgroundColor:'black',
    justifyContent: 'center'
  },
  notificationSeen: {
    height: 8,
    width: 8,
    alignItems: 'center',
    marginLeft: 5

  },
  notificationText: {
    fontFamily: 'OpenSans-ExtraBold',
    color: 'black',
    fontSize: 17,
    fontWeight: '600'
  },
  unseenNotificationText: {
    fontFamily: 'OpenSans-ExtraBold',
    color: 'black',
    fontSize: 17,
    fontWeight: '800'
  },
  floatingButton: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    gap: 10,
    bottom: 10,
    right: 10,
    backgroundColor: '#3f50b5',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: 115,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  bottomSheet: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 50, 
  },
  deleteButton: {
    // backgroundColor: 'rgb(63, 80, 181)',
    backgroundColor:'#5262bc',
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    // borderColor:'#3f50b5',
    borderWidth:1,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    borderBottomColor:'white'
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default Notification;