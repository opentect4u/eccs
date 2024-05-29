import React, { useState, useEffect } from 'react';
import HeaderComponent from '../Components/HeaderComponent';
import { View, StyleSheet, Image, Text, Button, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import { AirbnbRating } from 'react-native-ratings';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import Toast from 'react-native-toast-message';




const Feedback = () => {

    const [rating, setRating] = React.useState(0);
    const [remarks, setremarks] = useState('');
    const [charCount, setCharCount] = useState(0);
    const welcomContHeight = 0.25 * SCREEN_HEIGHT;

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        console.log(newRating, 'rating')
    };

    useEffect(() => {
        // GetStorage()
        // notificationEmit()
    }, [])


    const remarksSubmit = async () => {
        const asyncData = await AsyncStorage.getItem(`login_data`);
        const bank_id = JSON.parse(asyncData)?.bank_id
        const emp_code = JSON.parse(asyncData)?.emp_code
        const user_name = JSON.parse(asyncData)?.user_name
        const date = new Date()
        const apidata = {
            bank_id: 0,
            emp_code: emp_code,
            user_name: user_name,
            rating: rating,
            remarks: remarks,
            date: date
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/save_feedback_dtls`, apidata, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data, 'feedback')
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

        console.log(apidata, 'feedback data')
    }
    const getSelectedColor = (rating) => {
        switch (rating) {
            case 1:
                return '#FF0000';
            case 2:
                return '#ffb234';
            case 3:
                return '#ffd934'; // Orange for rating 3
            case 4:
                return '#add633'; // Gold for rating 4
            case 5:
                return '#32CD32'; // Green for rating 5
            default:
                return '#FFA500'; // Default to orange for other cases
        }
    }
    const maxChars = 200
    const handleTextChange = (text) => {
        if (text.length <= maxChars) {
            setremarks(text)
            setCharCount(text.length);
        }
    };
    const isDisabled = charCount === 0 || charCount > maxChars;
    console.log(charCount, 'charCount')
    console.log(isDisabled, 'isDisabled')
    return (
        <View>
            <HeaderComponent />
            <View>
                <ImageBackground source={require('../assets/bg5.jpg')}style={{resizeMode: 'cover'}}>
                    <View style={{ height: welcomContHeight, width: 'screenWidth', position: 'relative' }}>
                        <Text style={Styles.containerText}>Feedback</Text>
                        <View style={Styles.mainContainer}>
                            <View style={Styles.profileContainer}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={Styles.mainContHeader}>
                                        {/* Would you like to rate us? */}
                                        Have a Comment or Correction?
                                    </Text>
                                    <Text style={Styles.mainContHeader}>Let Us Know!</Text>
                                </View>

                                <View>
                                    {/* <AirbnbRating
                                        count={5}
                                        reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
                                        defaultRating={0}
                                        size={30}
                                        color={'white'}
                                        onFinishRating={handleRatingChange}
                                        selectedColor={getSelectedColor(rating)}
                                        reviewColor={getSelectedColor(rating)}
                                    /> */}
                                    <TextInput
                                        mode="outlined"
                                        // label="Remarks"
                                        placeholder="Write It Here "
                                        style={Styles.textInputStyle}
                                        multiline={true}
                                        value={remarks}
                                        // onChangeText={text => setremarks(text)}
                                        onChangeText={handleTextChange}
                                        // outlineColor='#a20a3a'
                                        outlineColor='#3f50b5'
                                        activeOutlineColor='#3f50b5'
                                        placeholderTextColor={'#3f50b5'}
                                    />
                                    <Text style={Styles.charCountText}>({charCount}/{maxChars})</Text>
                                    <TouchableOpacity style={[Styles.submitBtn, isDisabled && Styles.disabledBtn]} onPress={remarksSubmit} disabled={isDisabled}>
                                        <Text style={Styles.submitBtnTxt}>Submit</Text>
                                    </TouchableOpacity>
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
        height: 700,borderTopLeftRadius: 40,borderTopRightRadius: 40,backgroundColor: 'white',
        width: '100%',alignSelf: 'center',position: 'absolute',top: 120,padding: 20,
        // backgroundColor:'#fdbd30',  
    },
    profileContainer: {
        position: 'relative',
    },
    containerText: {
        fontSize: 20,fontWeight: '900',color: 'white', top: 50,alignSelf: 'center'
        // color:'#fdbd30',
    },
    mainContHeader: {
        color: '#3f50b5',fontSize: 18,fontWeight: '900',padding: 15,borderBottomColor: '#a20a3a'
        // color: '#209fb2',// color:'#a20a3a',// borderBottomWidth: 0.5,// borderBottomWidth: 1,
        // borderBottomColor: 'black',
    },
    inputContainer: {
        width: '80%',height: 60,alignSelf: 'center',marginTop: 30
    },
    textInputStyle: {
        width: '80%',height: 100,alignSelf: 'center',marginTop: 20,
    },
    submitBtn: {
        // backgroundColor: '#04bbd6',
        // backgroundColor:'#a20a3a',
        backgroundColor: '#3f50b5',width: 100,padding: 10,borderRadius: 10,marginTop: 10,
        alignSelf: 'center',marginTop: 50
    },
    submitBtnTxt: {
        color: 'white',textAlign: 'center',fontSize: 15,fontWeight: '800'
    },
    disabledBtn: {
        // backgroundColor: 'lightblue', 
        // backgroundColor:'#c28090'
        backgroundColor: '#7985cb'
    },
    charCountText: {
        alignSelf: 'flex-end',marginTop: 5, color: '#3f50b5',fontWeight: '900',
        // color: '#a20a3a',
    },

});
// const screenWidth = Dimensions.get('window').width;
export default Feedback;