import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text,StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import HeaderComponent from './HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import RouteGaurdContext from '../Context/AuthGuard';
import { assets } from '../../react-native.config';


function Home({ navigation }) {
  const { authDT } = useContext(RouteGaurdContext);

    const [userName, setUserName] = useState(null);
    const [bankName, setbankName] = useState(null);
    const welcomContHeight = 0.25 * SCREEN_HEIGHT;
    const rptBodyHeight = 0.8 * SCREEN_HEIGHT;
    const rptBodyWidth = 0.9 * screenWidth;
    const rptBgCont = 0.2 * rptBodyHeight;
    

    useEffect(() => {
        GetStorage()
        // console.log(authDT)
    }, [])

    const GetStorage = async () => {
        try {
            const asyncData = await AsyncStorage.getItem(`login_data`);
            // console.log(asyncData)
            // console.log(JSON.parse(asyncData)?.bank_id)
            setUserName(JSON.parse(asyncData)?.user_name)
            setbankName(JSON.parse(asyncData)?.bank_name)
        }
        catch (err) {
            // console.log(err);
        }

    }
    return (
        <>
            <HeaderComponent />
            <View>
                <ImageBackground
                    // source={require('../assets/bg3.jpg')}
                    source={require('../assets/bg5.jpg')}
                    style={{resizeMode: 'cover'}}
                >         
                <View style={{ height: welcomContHeight, width: 'screenWidth' }}>
                    <Text style={styles.bankDtlsTxt}>{bankName}</Text>
                    <Text style={styles.userDtlsTxt}>Hello {userName}</Text>           
                 <View>
                    <View style={{ height: rptBodyHeight,borderTopLeftRadius:40,borderTopRightRadius:40,width:'100%',
                    backgroundColor:'white',
                    // backgroundColor: '#fdbd30',
                    // backgroundColor:'#757ce8',
                    // light: '#757ce8',
                    // main: '#3f50b5',
                    // dark: '#002884',
                    // contrastText: '#fff',
                    alignSelf:'center',marginTop:25,padding:20 }}>
                    <View style={{ height: rptBgCont,flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.rptCard} onPress={() => navigation.navigate('Demand')}>
                           <Image source={require('../assets/demand3.png')} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                            <Text style={styles.rptCardTxt}>Demand</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.rptCard} onPress={() => navigation.navigate('Networth')}>
                            <Image source={require('../assets/networth3.png')} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                            <Text style={styles.rptCardTxt}>Networth</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ height: rptBgCont, width: 'screenWidth', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.rptCard} onPress={() => navigation.navigate('Calendar')}>
                            <Image source={require('../assets/calendar3.png')} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                            <Text style={styles.rptCardTxt}>Calendar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rptCard} onPress={() => navigation.navigate('Download')}>
                            <Image source={require('../assets/form.png')} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                            <Text style={styles.rptCardTxt}>Forms</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.rptCard} onPress={() => navigation.navigate('HolidayHome')}>
                            <Image source={require('../assets/holiday_calendar2.png')} style={{ width: 38, height: 38, resizeMode: 'contain' }} />
                            <Text style={styles.rptCardTxt}>Holiday Home</Text>
                        </TouchableOpacity> */}

                        {/* <TouchableOpacity style={{ backgroundColor: 'white', width: 100, height: 100, justifyContent: 'center',borderRadius:20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} >
                            <Image source={require('../assets/calculator.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                            <Text style={{ top: 5,color: 'gray', fontWeight: '900',fontFamily:'Montserrat-Bold' }}>Calculator</Text>
                        </TouchableOpacity> */}

                    </View>
                    <View style={{ height: rptBgCont,  width: 'screenWidth', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        {/* <TouchableOpacity style={styles.rptCard} onPress={() => navigation.navigate('Download')}>
                            <Image source={require('../assets/download2.png')} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                            <Text style={styles.rptCardTxt}>Download</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity style={styles.rptCard} onPress={() => navigation.navigate('Contacts')}>
                            <Image source={require('../assets/contact4.png')} style={{ width: 45, height:45, resizeMode: 'contain' }} />
                            <Text style={styles.rptCardTxt}>Contact</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rptCard} onPress={() => navigation.navigate('Feedback')}>
                            <Image source={require('../assets/feedback4.png')} style={{ width: 45, height: 45, resizeMode: 'contain' }} />
                            <Text style={styles.rptCardTxt}>Feedback</Text>
                        </TouchableOpacity>


                    </View>
                    {/* <View style={{ height: rptBgCont,  width: 'screenWidth', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}> */}
                        {/* <TouchableOpacity style={{ backgroundColor: 'white', width: 100, height: 100, justifyContent: 'center',borderRadius:20, alignItems: 'center', color: 'black', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} onPress={() => navigation.navigate('HolidayHome')}>
                            <Image source={require('../assets/holiday_calendar.png')} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                            <Text style={{ top: 5,color: 'gray', fontWeight: '900',fontFamily:'Montserrat-Bold' }}>Holiday Home</Text>
                        </TouchableOpacity> */}

                        {/* <TouchableOpacity style={styles.rptCard} onPress={() => navigation.navigate('Feedback')}>
                            <Image source={require('../assets/feedback2.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                            <Text style={styles.rptCardTxt}>Feedback</Text>
                        </TouchableOpacity> */}

                    {/* </View> */}
                </View>
                </View>
               

                </View>
                </ImageBackground>
                {/* <View style={{ height: rptBodyHeight,width:'screenWidth',backgroundColor:'white' }}></View> */}
                {/* </LinearGradient> */}
                

                {/* <View style={{ backgroundColor:'red',flexDirection: 'row', justifyContent: 'space-between', padding: 10,height:50 }}>
                    <Text>bottom</Text>
                </View> */}

            </View>
          
        </>
    );

}
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({

    bankDtlsTxt:{
        fontSize: 20, color: '#ffffff', alignSelf: 'center', marginTop: 30,fontFamily:'OpenSans-ExtraBold',fontWeight:'900',
    },
    userDtlsTxt:{ fontSize: 17, color: '#ffffff', paddingLeft: 24, fontFamily:'OpenSans-ExtraBold',fontWeight:'900' },

    rptCard:{
        backgroundColor: '#e9eafc', width: 95, height: 105, justifyContent: 'center',borderRadius:20, alignItems: 'center', color: 'black', shadowColor: '#000',  shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
    },
    rptCardTxt:{
        top: 4,color: '#3f50b5',fontFamily:'OpenSans-ExtraBold',fontSize:15,fontWeight:'900'
    }

  });

export default Home;
