import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TextInput, Text, Button, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator, Linking, ScrollView } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { SCREEN_HEIGHT } from 'react-native-normalize';
import HeaderComponent from '../Components/HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import Toast from 'react-native-toast-message';
import PDFView from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import { ScreenHeight } from 'react-native-elements/dist/helpers';


function Download() {
    const [isLoading, setLoading] = useState(false)
    const welcomContHeight = 0.25 * SCREEN_HEIGHT;
    // const rptBodyHeight = 0.8 * SCREEN_HEIGHT;
    const [userName, setUserName] = useState(null);
    const [responseData, setResponseData] = useState([]);

    const [pdfUri, setPdfUri] = useState(null);

    const loadPDF = async () => {
        setLoading(true)
        try {
            const pdfUrl = 'http://202.21.38.178:3002/forms/10001/loan_form.pdf';

            const response = await RNFetchBlob.config({
                fileCache: true,
                appendExt: 'pdf',
            }).fetch('GET', pdfUrl);

            const pdfPath = `file://${response.path()}`;
            setPdfUri(pdfPath);
            setLoading(false);
        } catch (error) {
            console.error('Error loading PDF:', error);
            setLoading(false);
        }
    };
    useEffect(() => {
        loadPDF();
    }, []);
    useEffect(() => {
        loadPDF();
    }, []);

    // useEffect(() => {
    //     GetStorage()
    //     downloadRes()
    // }, [])
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
            <View style={styles.bgContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {isLoading && <ActivityIndicator color={'#3f50b5'} size={"large"} />}
                {pdfUri && (
                    <PDFView
                        fadeInDuration={250.0}
                        style={{ flex: 1, width: '100%', height: 500 }}
                        source={{ uri: pdfUri }} // Provide the source prop correctly
                    />
                )}
                
            </ScrollView>
            </View>
        </>

    )
}

const styles = StyleSheet.create({
    bgContainer:{ height: ScreenHeight, width: '100%', backgroundColor: '#ffffff', borderTopLeftRadius: 50,borderTopRightRadius: 50, },
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
        // color: '#209fb2',
        // color:'#a20a3a',
        color: '#3f50b5',
        fontSize: 18,
        fontWeight: '900',
        padding: 15,
        borderBottomWidth: 1,
        // borderBottomColor: 'black',
        borderBottomColor: '#a20a3a',
    },
    profileContainer: {
        position: 'relative',
    },
    containerText: {
        fontSize: 20,
        fontWeight: '900',
        color: 'white',
        // color:'#fdbd30',
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
        // color: 'black',
        color: '#a20a3a',
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