import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TextInput, Text, Button, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator, Linking } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import HeaderComponent from '../Components/HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import Toast from 'react-native-toast-message';


function Download() {

    const [isLoading, setLoading] = useState(false)
    const welcomContHeight = 0.25 * SCREEN_HEIGHT;
    // const rptBodyHeight = 0.8 * SCREEN_HEIGHT;
    const [userName, setUserName] = useState(null);
    const [responseData, setResponseData] = useState([]);

    useEffect(() => {
        GetStorage()
        downloadRes()
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
    const downloadRes = async () => {
        setLoading(true)
        const asyncData = await AsyncStorage.getItem(`login_data`);
        const bankId = JSON.parse(asyncData)?.bank_id

        try {
            const response = await axios.get(`${BASE_URL}/api/get_download_form_dtls?bank_id=${bankId}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

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
            // setLoading(false)
            console.log(error);
        }
    };


    const handleDownload = (fileUrl) => {
        Linking.openURL(`${BASE_URL}/${fileUrl}`)
            .then(() => {
                // console.log('URL opened successfully');
            })
            .catch((err) => {
                console.error('An error occurred while opening the URL:', err);
            });
    };


    return (
        <>
            <HeaderComponent />
            <View>
                <ImageBackground
                    source={require('../assets/bg.png')} // Replace with the actual path to your image
                    style={{ resizeMode: 'cover' }}
                >
                    <View style={{ height: welcomContHeight, width: 'screenWidth', position: 'relative' }}>
                        <Text style={styles.containerText}>{`Hello! ${userName}`}</Text>
                        <View style={styles.mainContainer}>
                            <View style={styles.profileContainer}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={styles.mainContHeader}>
                                        Get Your Forms Here
                                    </Text>
                                </View>
                                {isLoading && <ActivityIndicator color={"teal"} size={"large"} />}
                                {responseData.map((document, index) => (
                                    <View style={styles.profileView} key={index}>

                                        <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                                            <Text style={styles.title}>{document.title} </Text>
                                            <TouchableOpacity onPress={() => handleDownload(document.file_path)}>
                                                <Image source={require('../assets/pdf.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                ))}
                            </View>
                            {/* </View> */}

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
        alignSelf: 'center',
        position: 'absolute',
        top: 120,
        padding: 20,
    },
    mainContHeader: {
        color: '#209fb2',
        fontSize: 18,
        fontWeight: '900',
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
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
    profileView: {
        width: '100%',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        paddingBottom: 15,
        paddingTop: 20,
    },
    title: {
        fontWeight: '700',
        color: 'black',
        fontSize: 17
    },
    content: {
        fontWeight: '800',
        color: '#ff8c00',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        fontSize: 14
    },
});

const screenWidth = Dimensions.get('window').width;


export default Download;