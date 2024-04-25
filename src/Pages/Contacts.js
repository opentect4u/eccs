import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TextInput, Text, Button, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import HeaderComponent from '../Components/HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import Toast from 'react-native-toast-message';


function Contacts() {
  const [isLoading, setLoading] = useState(false)
  const welcomContHeight = 0.35 * SCREEN_HEIGHT;
  const rptBodyHeight = 0.9 * SCREEN_HEIGHT;
  const [userName, setUserName] = useState(null);
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    GetStorage()
    contactDtls()
  }, [])

  const GetStorage = async () => {
    try {
      const asyncData = await AsyncStorage.getItem(`login_data`);
      setUserName(JSON.parse(asyncData)?.user_name)
    }
    catch (err) {
      console.log(err);
    }

  }
  const contactDtls = async () => {
    setLoading(true)
    const asyncData = await AsyncStorage.getItem(`login_data`);
    const bankId = JSON.parse(asyncData)?.bank_id

    try {
      const response = await axios.get(`${BASE_URL}/api/get_contact_dtls`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // console.log(response.data.msg, 'get_contact_dtls')
      if (response.data.suc === 1) {
        setLoading(false)

        setResponseData(response.data.msg);
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
      // console.log(error);
    }
  };


  return (
        <>
      <HeaderComponent />
      <View>

        <ImageBackground
          source={require('../assets/bg5.jpg')}
          style={{ resizeMode: 'cover', height: welcomContHeight }}

        >
          <View style={{ height: welcomContHeight, width: 'screenWidth', position: 'relative' }}>
            {/* <Text style={styles.containerText}>{`Hello! ${userName}`}</Text> */}
            <Text style={styles.containerText}>Contact</Text>

            <View style={styles.mainContainer}>
              <View style={styles.profileContainer}>
                  {isLoading && <ActivityIndicator color={'#3f50b5'} size={"large"} />}
                  {responseData.map((item,index) => (
                    <>
                    <View style={styles.container}>
                      
                    <View style={styles.profileView}>
                      <Text style={styles.title}>{item.designation}  </Text>
                      <Text style={styles.content}>{item.contact_person}</Text>
                      <Text style={styles.content}>(M):{item.contact_phone}</Text>
                    </View>
                  
                    {/* <View style={styles.profileView}>
                      <Text style={styles.title}>{item.designation}{index}  </Text>
                      <Text style={styles.content}>{item.contact_person}</Text>
                      <Text style={styles.content}>(M):{item.contact_phone}</Text>
                    </View> */}
                    </View>
                    {/* <View style={styles.container}>
                    <View style={styles.profileView}>
                      <Text style={styles.title}>{item.designation}</Text>
                      <Text style={styles.content}>{item.contact_person}</Text>
                      <Text style={styles.content}>(M):{item.contact_phone}</Text>
                    </View>
                    <View style={styles.profileView}>
                    <Text style={styles.title}>{item.designation}</Text>
                    <Text style={styles.content}>{item.contact_person}</Text>
                      <Text style={styles.content}>(M):{item.contact_phone}</Text>
                    </View>
                    </View>
                    <View style={styles.container}>
                    <View style={styles.profileView}>
                      <Text style={styles.title}>Director</Text>
                      <Text style={styles.content}>Name:</Text>
                      <Text style={styles.content}>(M):</Text>

                    </View>
                    <View style={styles.profileView}>
                    <Text style={styles.title}>Director</Text>
                    <Text style={styles.content}>Name:</Text>
                      <Text style={styles.content}>(M):</Text>
                    </View>
                    </View>
                    <View style={styles.container}>
                    <View style={styles.profileView}>
                      <Text style={styles.title}>Director</Text>
                      <Text style={styles.content}>Sakti Prasad Kulavi</Text>
                      <Text style={styles.content}>(M):</Text>

                    </View>
                    <View style={styles.profileView}>
                    <Text style={styles.title}>Director</Text>
                    <Text style={styles.content}>Name:</Text>
                      <Text style={styles.content}>(M):</Text>
                    </View>
                    </View> 
                    <View style={styles.container}>
                    <View style={styles.profileView}>
                      <Text style={styles.title}>Director</Text>
                      <Text style={styles.content}>Name:</Text>
                      <Text style={styles.content}>(M):</Text>

                    </View>
                    </View> */}
                    </>
                    ))}
                  
                
                </View>
              </View>
              </View>
            </ImageBackground>
          </View>

        </>

        )
}

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
            top: 120,
            padding: 20,
        },
        containerText: {
          fontSize: 20,
          fontWeight: '900',
          // color: '#fdbd30',
          color:'#ffffff',
          top: 50,
          alignSelf:'center'
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
        introText: {
          flexDirection: "row",
        justifyContent: 'center',
        marginTop: 50
      },
      container: {
        flexDirection:'row',
        justifyContent:'space-between', 
        width: '95%',
        marginLeft:8,
        gap:30,
        // borderBottomColor: '#a20a3a',
        borderBottomColor:'#3f50b5',
        borderBottomWidth: 0.5,
      },
        profileView: {
        flex:1,
        width: '100%',
        // borderBottomColor:'#a20a3a',
        // borderBottomWidth: 0.5,
        paddingBottom: 5,
        // paddingTop: 15,
      },
        profileViewPass: {
          width: '100%',
        // borderBottomColor: 'gray',
        borderBottomColor:'#a20a3a',
        borderBottomWidth: 1,
        paddingBottom: 15,
        paddingTop: 15,
        // alignItems:'center'
      },
      //   listView: {
      //     backgroundColor: 'white',
      //   height: "100%",
      //   padding: 20,
      //   marginTop: -80
      // },
        text: {
          color: 'black',
        fontWeight: "600",
        borderBottomColor:'#a20a3a',
        borderBottomWidth: 1,
        paddingVertical: 10,
        fontSize: 14,
      },
        title: {
          fontWeight: 'bold',
        // color: 'black',
        // color:'#a20a3a',
        color:'#3f50b5',
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
          // color: 'gray',
        color:'black',
        fontSize: 13
      },
        logoContainer: {
          borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        // height:welcomContHeight,
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
});

        const screenWidth = Dimensions.get('window').width;


        export default Contacts;