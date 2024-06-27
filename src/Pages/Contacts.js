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

      console.log(response.data.msg, 'get_contact_dtls')
      if (response.data.suc === 1) {
        setLoading(false)

        setResponseData(response.data.msg,);
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
      <HeaderComponent/>
      <View>
        <ImageBackground
          source={require('../assets/bg5.jpg')}
          style={{ resizeMode: 'cover', height: welcomContHeight }}>
          <View style={{ height: welcomContHeight,width:'screenWidth',position: 'relative'}}>
            {/* <Text style={styles.containerText}>{`Hello! ${userName}`}</Text> */}
            <Text style={styles.containerText}>Contact</Text>
            <View style={styles.mainContainer}>
              <View style={styles.profileContainer}>
                {isLoading && <ActivityIndicator color={'#3f50b5'} size={"large"} />}
                <View style={styles.container}>
                  {responseData.map((item, index) => (
                    <View style={styles.profileView} key={item.id}>
                      <Text style={styles.title}>{item.designation}</Text>
                      <Text style={styles.content}>{item.contact_person}</Text>
                      <Text style={styles.content}>(M): {item.contact_phone}</Text>
                    </View>
                  ))}
                </View>
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
    padding: 25,
  },
  containerText: {
    fontSize: 20,
    fontWeight: '900',
    // color: '#fdbd30',
    color: '#ffffff',
    top: 50,
    alignSelf: 'center'
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
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    flexWrap: 'wrap',
    width: '100%', 
    paddingHorizontal: 8,
    gap: 15,
  },
  profileView: {
    width: '45%',
    paddingBottom: 10,
    
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
    borderBottomColor: '#a20a3a',
    borderBottomWidth: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  title: {
    fontWeight: '800',
    // color: 'black',
    // color:'#a20a3a',
    color: '#3f50b5',
    fontSize: 17
  },
  titleClick: {
    fontWeight: '800',
    color: '#ff8c00',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontSize: 14
  },
  content: {
    color: 'gray',
    // color: 'black',
    fontSize: 14,
    
  },
});

const screenWidth = Dimensions.get('window').width;


export default Contacts;