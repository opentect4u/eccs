import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import HeaderComponent from '../Components/HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import Toast from 'react-native-toast-message';
import { todayString } from 'react-native-calendars/src/expandableCalendar/commons';


function CalendarComponent() {
  const today = new Date();
  // const formattedToday = formatDate(today);
  // console.log(formattedToday,'formattedToday')
  const [selectedDate, setSelectedDate] = useState('');
  const [holidays, setHolidays] = useState({});
  const [selectedevent, setEvent] = useState(''); // Add event state
  useEffect(() => {
    GetStorage()
    holidayList()
  }, [])
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    //  console.log(holidays,'holidays')
    //  console.log(Object.keys(holidays),'object')
    if (day.dateString in holidays) {
      const eventInfo = holidays[day.dateString];
      const event = eventInfo.cal_event;
      setEvent(event);
    }
    else{
      setEvent('');
    }

    //  if(selectedDate ==)
  };
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Month indexes are zero-based
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
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
          acc[holiday.cal_dt.substr(0, 10)] = { marked: true, dotColor: '#a20a3a', cal_event: holiday.cal_event }; // Customize dotColor as needed
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
      // console.log(error);
    }
  };



  return (

    <>
      <HeaderComponent />

      <ImageBackground
        source={require('../assets/bg5.jpg')}

      >
        <View style={styles.container}>
         <View style={styles.dateDtls}>
          <View style={{backgroundColor:'rgba(211, 211, 211,0.1)',height:200,width:'90%',top:20,borderRadius:50,alignSelf:'center',padding:20}}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     
      <Text style={{color:'#ffffff',fontFamily:'OpenSans-ExtraBold',fontSize:18,fontWeight:'700'}}>{selectedDate ? `Selected Date: ${formatDate(selectedDate)}` : 'No date selected'}</Text>
      {selectedevent ? <Text style={{color:'#ffffff',fontFamily:'OpenSans-ExtraBold',fontSize:20,fontWeight:'700'}}>{selectedevent}</Text> : <Text style={{color:'#ffffff',fontFamily:'OpenSans-ExtraBold',fontSize:20,fontWeight:'700'}}>No holiday</Text>
}
    </View>
      </View>
     
         </View>
  
          <View style={styles.calendar}>
            <Calendar style={{
              
              height: 550,
              borderTopLeftRadius:50,
              borderTopRightRadius:50,
      
            }}
              theme={{             
                // textSectionTitleColor: '#209fb2',
                textSectionTitleColor:'#3f50b5',
                // selectedDayBackgroundColor: '#00adf5',
                selectedDayBackgroundColor:'#3f50b5',
                selected: true,
                selectedDayTextColor: '#ffffff',
                // todayTextColor: '#209fb2',
                todayTextColor:'#3f50b5',
                todayBackgroundColor:'rgba(211, 211, 211,0.6)',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#3f50b5',
                selectedDotColor: '#ffffff',
                // arrowColor: '#00adf5',
                arrowColor:'#3f50b5',
                // monthTextColor: '#00adf5',
                monthTextColor:'#3f50b5',
                textDayFontFamily: 'OpenSans-ExtraBold',
                textDayHeaderFontWeight: '900',
                textMonthFontFamily: 'OpenSans-ExtraBold',
                textDayHeaderFontFamily: 'OpenSans-ExtraBold',
                textDayFontSize: 16,
                textDayFontWeight:'900',
                textMonthFontSize: 20,
                textMonthFontWeight:'900',
                
                
              }}
              markedDates={{
                ...holidays,
                [selectedDate]: { selected: true, selectedColor: '#3f50b5' },
                
              }}
              onDayPress={handleDayPress}
              current={selectedDate}
            />
          </View>
          </View>
      </ImageBackground>
    </>

  )
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
  },
  dateDtls:{
    height:'20%',
    justifyContent:'flex-start',
    width:'100%',
  },
  calendar:{
    height:'80%',
    display:'flex',
    justifyContent:'flex-end',
  }
});

export default CalendarComponent;