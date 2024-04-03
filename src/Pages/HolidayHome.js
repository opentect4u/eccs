import React, { useState, useEffect } from 'react';
import HeaderComponent from '../Components/HeaderComponent';
import { View, StyleSheet, useColorScheme, Text, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import Toast from 'react-native-toast-message';




const HolidayHome = () => {
  const isDarkMode = useColorScheme() === 'dark'
  const welcomContHeight = 0.25 * SCREEN_HEIGHT;
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [open, setOpen] = useState(false);
  const [valuePlace, setvaluePlace] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [selectedValuesData, setselectedValuesData] = useState('');

  useEffect(() => {
    remarksSubmit()

  }, [])
  const isDisabled = !valuePlace
  const remarksSubmit = async () => {
    const asyncData = await AsyncStorage.getItem(`login_data`);
    const bank_id = JSON.parse(asyncData)?.bank_id
    try {
      const response = await axios.get(`${BASE_URL}/api/get_holiday_home_dtls?bank_id=${bank_id}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data.msg, 'holiday-home Data')
      setResponseData(response.data.msg)
      if (response.data.suc === 1) {
        const placesArray = response.data.msg.map(item => ({ label: item.hh_place, value: item.sl_no }));
        setPlaces(placesArray);
        // console.log(placesArray, 'places')
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
  };
  const valueSubmit = async () => {
    console.log(valuePlace, 'valuePlace')
    // if (valuePlace == responseData
    if (responseData.filter(item => item.sl_no == valuePlace)) {
      // setselectedValuesData(responseData.filter(item => item.sl_no == valuePlace))
      const selected = responseData.filter(item => item.sl_no === valuePlace)[0];
      setselectedValuesData(selected);
      // console.log(selectedValuesData,'data')
    }
  }
  return (
    <View>
      <HeaderComponent />
      <View>
        <ImageBackground
          source={require('../assets/bg.png')} // Replace with the actual path to your image
          style={{ resizeMode: 'cover' }}
        >
          <View style={{ height: welcomContHeight, width: 'screenWidth', position: 'relative' }}>
            <Text style={Styles.containerText}> Holiday Home</Text>
            <View style={Styles.mainContainer}>
              <View style={Styles.profileContainer}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={Styles.mainContHeader}>
                    Select your place
                  </Text>
                </View>
                <View>
                  <DropDownPicker
                    open={open}
                    setOpen={setOpen}
                    items={places}
                    placeholder="Select place"
                    setValue={setvaluePlace}
                    value={valuePlace}
                  />
                  <TouchableOpacity style={[Styles.submitBtn,isDisabled && Styles.disabledBtn]} onPress={valueSubmit} disabled={!valuePlace}>
                    <Text style={Styles.submitBtnTxt}>Submit</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  {selectedValuesData && (
                    <View>
                      <View style={{height:150,backgroundColor:'rgba(211, 211, 211,0.3)',padding:10,marginTop:20,borderRadius:20}}>
                        <Text style={{alignSelf:'center',color:isDarkMode? 'black':'black',fontSize:16,fontWeight:'900'}}>Hotel Details:</Text>
                        <Text style={{fontSize:16,fontWeight:'600',color:isDarkMode? 'black':'black'}}>Address: {selectedValuesData.hh_address}</Text>
                        <Text style={{fontSize:16,fontWeight:'600',color:isDarkMode? 'black':'black'}}>Hotel Charge: {selectedValuesData.hh_charge}</Text>
                        <Text style={{fontSize:16,fontWeight:'600',color:isDarkMode? 'black':'black'}}>Email: {selectedValuesData.hh_email}</Text>
                      </View>
                      <View style={{height:120,backgroundColor:'rgba(211, 211, 211,0.3)',padding:10,marginTop:20,borderRadius:20}}>
                      <Text style={{alignSelf:'center',color:isDarkMode? 'black':'black',fontSize:16,fontWeight:'900'}}>Contact Details</Text>
                      <Text style={{fontSize:16,fontWeight:'600',color:isDarkMode? 'black':'black'}}>Contact Person: {selectedValuesData.hh_contact_person}</Text>
                      <Text style={{fontSize:16,fontWeight:'600',color:isDarkMode? 'black':'black'}}>Phone: {selectedValuesData.hh_phone}</Text>
                      <Text style={{fontSize:16,fontWeight:'600',color:isDarkMode? 'black':'black'}}>Place: {selectedValuesData.hh_place}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  mainContainer: {
    height: 700,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    backgroundColor: 'white',
    alignSelf: 'center',
    position: 'absolute',
    top: 120,
    padding: 20,
  },
  profileContainer: {
    position: 'relative',
  },
  containerText: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
    top: 50,
    alignSelf: 'center'
  },
  mainContHeader: {
    color: '#209fb2',
    fontSize: 18,
    fontWeight: '900',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
  },

  inputContainer: {
    width: '80%',
    height: 60,
    alignSelf: 'center',
    marginTop: 30

  },
  textInputStyle: {
    width: '80%',
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
  submitBtn: {
    backgroundColor: '#04bbd6',
    width: 100,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',

  },
  submitBtnTxt: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800'
  },
  disabledBtn: {
    backgroundColor: 'lightblue', 
  },

});

// const screenWidth = Dimensions.get('window').width;

export default HolidayHome;