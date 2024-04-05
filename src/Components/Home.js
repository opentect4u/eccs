import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text,ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import HeaderComponent from './HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import RouteGaurdContext from '../Context/AuthGuard';


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
            // console.log(userName, 'userName')
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
                    source={require('../assets/bg.png')} // Replace with the actual path to your image
                    style={{resizeMode: 'cover'}}
                >         
                <View style={{ height: welcomContHeight, width: 'screenWidth' }}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '900', alignSelf: 'center', marginTop: 30,fontFamily:'Montserrat-Bold'}}>{bankName}</Text>
                    <Text style={{ fontSize: 18, color: 'white', paddingLeft: 25, fontWeight: '700', marginTop: 10,fontFamily:'Montserrat-Bold',  }}>Hello {userName}</Text>           
                 <View>
                    <View style={{ height: rptBodyHeight,borderTopLeftRadius:40,borderTopRightRadius:40,width:'100%',backgroundColor:'white',alignSelf:'center',marginTop:25,padding:20 }}>
                    <View style={{ height: rptBgCont,flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ backgroundColor: 'white', width: 100, height: 100, justifyContent: 'center',borderRadius:20, alignItems: 'center', color: 'black', shadowColor: '#000',  shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} onPress={() => navigation.navigate('Demand')}>
                           <Image source={require('../assets/demand.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />

                            <Text style={{ color: 'gray', fontWeight: '900', top: 5,fontFamily:'Montserrat-Bold' }}>Demand</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: 'white', width: 100, height: 100, justifyContent: 'center',borderRadius:20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} onPress={() => navigation.navigate('Networth')}>
                            <Image source={require('../assets/networth.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                            <Text style={{ top: 5,color: 'gray', fontWeight: '900',fontFamily:'Montserrat-Bold' }}>Networth</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ height: rptBgCont, width: 'screenWidth', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <TouchableOpacity style={{ backgroundColor: 'white', width: 100, height: 100,borderRadius:20, justifyContent: 'center', alignItems: 'center', color: 'black', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} onPress={() => navigation.navigate('Calendar')}>
                            <Image source={require('../assets/calendar.png')} style={{ width: 38, height: 38, resizeMode: 'contain' }} />
                            <Text style={{ top: 5,color: 'gray', fontWeight: '900',fontFamily:'Montserrat-Bold' }}>Calendar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: 'white', width: 100, height: 100, justifyContent: 'center',borderRadius:20, alignItems: 'center', color: 'black', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} onPress={() => navigation.navigate('HolidayHome')}>
                            <Image source={require('../assets/holiday_calendar.png')} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                            <Text style={{ top: 5,color: 'gray', fontWeight: '900',fontFamily:'Montserrat-Bold' }}>Holiday Home</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={{ backgroundColor: 'white', width: 100, height: 100, justifyContent: 'center',borderRadius:20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} >
                            <Image source={require('../assets/calculator.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                            <Text style={{ top: 5,color: 'gray', fontWeight: '900',fontFamily:'Montserrat-Bold' }}>Calculator</Text>
                        </TouchableOpacity> */}

                    </View>
                    <View style={{ height: rptBgCont,  width: 'screenWidth', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <TouchableOpacity style={{ backgroundColor: 'white', width: 100, height: 100, justifyContent: 'center',borderRadius:20, alignItems: 'center', color: 'black', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} onPress={() => navigation.navigate('Download')}>
                            <Image source={require('../assets/download.png')} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                            <Text style={{ top: 5,color: 'gray', fontWeight: '900',fontFamily:'Montserrat-Bold' }}>Download</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: 'white', width: 100, height: 100, justifyContent: 'center',borderRadius:20, alignItems: 'center', colshadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} onPress={() => navigation.navigate('Contacts')}>
                            <Image source={require('../assets/contact.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                            <Text style={{ top: 5,color: 'gray', fontWeight: '900',fontFamily:'Montserrat-Bold' }}>Contact</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ height: rptBgCont,  width: 'screenWidth', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                        {/* <TouchableOpacity style={{ backgroundColor: 'white', width: 100, height: 100, justifyContent: 'center',borderRadius:20, alignItems: 'center', color: 'black', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} onPress={() => navigation.navigate('HolidayHome')}>
                            <Image source={require('../assets/holiday_calendar.png')} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                            <Text style={{ top: 5,color: 'gray', fontWeight: '900',fontFamily:'Montserrat-Bold' }}>Holiday Home</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity style={{ backgroundColor: 'white', width: 100, height: 100, justifyContent: 'center',borderRadius:20, alignItems: 'center', colshadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} onPress={() => navigation.navigate('Feedback')}>
                            <Image source={require('../assets/feedback.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                            <Text style={{ top: 5,color: 'gray', fontWeight: '900',fontFamily:'Montserrat-Bold' }}>Feedback</Text>
                        </TouchableOpacity>

                    </View>
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

export default Home;
