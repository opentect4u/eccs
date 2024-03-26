import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Image, Alert,StyleSheet } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import HeaderComponent from '../Components/HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import Toast from 'react-native-toast-message';


function CalendarComponent() {
    const [selectedDate, setSelectedDate] = useState('');
    const [holidays, setHolidays] = useState({});
    const [selectedevent, setEvent] = useState(null); // Add event state
    useEffect(() => {
      GetStorage()
      holidayList()
  }, [])
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    // console.log(day,'day')
  //  console.log(holidays,'holidays')
  //  console.log(Object.keys(holidays),'object')
   if(day.dateString in holidays){
    const eventInfo = holidays[day.dateString];
    const event = eventInfo.cal_event;
    // console.log("Event:", event);
    setEvent(event);
   }
   
  //  if(selectedDate ==)
  };
  const GetStorage = async () => {
      try {
        const asyncData = await AsyncStorage.getItem(`login_data`);
        const bankId = JSON.parse(asyncData)?.bank_id
        // console.log(JSON.parse(asyncData)?.bank_id,'bank_id')
      }
      catch (err) {
          console.log(err);
      }

  }

  const holidayList = async () => {
    const asyncData = await AsyncStorage.getItem(`login_data`);
  const bankId = JSON.parse(asyncData)?.bank_id

    try {
      const response = await axios.get(`${BASE_URL}/api/get_cal_dtls?bank_id=${bankId}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // console.log(response.data,'holiday API res')
      if (response.data.suc === 1) {
        const holidayDates = response.data.msg.reduce((acc, holiday) => {
          acc[holiday.cal_dt.substr(0,10)] = { marked: true, dotColor: 'red',cal_event: holiday.cal_event }; // Customize dotColor as needed
          return acc;
        }, {});
        setHolidays(holidayDates);
        
      }
      else {
        Toast.show({
          type: 'error',
          text1: 'error!',
          visibilityTime: 5000
        })
      }
    }
    catch (error) {
      console.log(error);
    }
  };
  


    return (

        <>
       <HeaderComponent/>
        <View style={styles.container}>
      <Calendar  style={{
        borderWidth: 1,
        borderColor: 'black',
        height: 350,
        
      }}
      theme={{
        
        textSectionTitleColor: '#209fb2',
        selectedDayBackgroundColor: '#00adf5',
        selected:true,
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#209fb2',
        dayTextColor: '#2d4150',
        textDisabledColor: '#d9e1e8',
        dotColor: '#00adf5',
        selectedDotColor: '#ffffff',
        arrowColor: '#00adf5',
        monthTextColor: '#00adf5',
        textDayFontFamily: 'monospace',
        textMonthFontFamily: 'monospace',
        textDayHeaderFontFamily: 'monospace',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
      }}
        markedDates={{
          ...holidays,
          [selectedDate]: { selected: true, selectedColor: '#04bbd6' },
        }}
        onDayPress={handleDayPress}
        current={selectedDate}
      />
      <View style={{backgroundColor:'rgba(4,187,214,255)',height:100,borderTopLeftRadius:40,borderTopRightRadius:40}}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{color:'white',fontSize:16,fontWeight:'700'}}>{selectedDate ? `Selected Date: ${selectedDate}` : 'No date selected'}</Text>
      {/* You can display the event here */}
      {/* For example, displaying it when a date is selected */}
      {selectedevent && <Text style={{color:'white',fontSize:16,fontWeight:'700'}}>{selectedevent}</Text>}
    </View>
      </View>
    </View>
        </>

    )
}

const styles = StyleSheet.create({
    container: {
      height:SCREEN_HEIGHT,
      backgroundColor:'white'
    },
  });

export default CalendarComponent;