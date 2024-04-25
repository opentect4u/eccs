import { StyleSheet, Text, View } from 'react-native';
import React,{createContext, useEffect, useState,useContext} from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false); 
  const [bankid,setbankid] = useState(null);
  const [empCode, setEmpCode] = useState(null);
  const [countNoti,setCountNoti] = useState(null);
  const [socketOndata,setSocketOnData] = useState(null);


  useEffect(() => {
    GetStorage();
    
    const newSocket = io("http://202.21.38.178:3002");
    setSocket(newSocket);
    newSocket.on('connect', () => {
      setIsConnected(true); 
      console.log('connect')
    });
    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    if (bankid !== null) {
      handleEmit(); // Call handleEmit only when bankid and empCode are available
    }
  }, [bankid, empCode]);
  const GetStorage = async () => {
    try {
        const asyncData = await AsyncStorage.getItem(`login_data`);
        // console.log('async data ',asyncData)
        setbankid(JSON.parse(asyncData)?.bank_id)
        // console.log(bankid,'bankid getstorage~')
        setEmpCode(JSON.parse(asyncData).emp_code)
        // console.log(empCode,'empcode')
        // console.log('GetStorage calling.....')

    }
    catch (err) {
        // console.log(err);
    }

}
  // const emitEvent = (eventName, bankId, data) => {
  //   if (socket) {
  //     const eventData = { bank_id: bankId, ...data };
  //     socket.emit(eventName, eventData);
  //   } else {
  //     console.error("Socket is not connected!");
  //   }
  // };
  
  const handleEmit = async () => {
    try {
      var socket = io("http://202.21.38.178:3002")
      // emitEvent('notification', bankid, { message: 'Update bank data!' })
      // console.log('bankid in socket',bankid)
      socket.emit('notification',{bank_id:bankid, message: 'Update bank data!' })
      socket.on('send notification', data => {
          // console.log('Response data notification:', data.msg);
          setSocketOnData(data.msg)
          // console.log('ON')
          // console.log(bankid,'bankid emitttttt')
          const v = data.msg.filter(dt=>(dt.send_user_id==empCode || dt.send_user_id==0) && dt.view_flag != "Y").length
          setCountNoti(v)
          // console.log(countNoti,'length countNoti')
          // console.log('handleEmit calling.....')
        })
     
      // console.log('dt ',dt.result)
        // console.log('emit')
        
       
     
      // console.log(bankid,'bankid emit')
      
    } catch (error) {
      console.error('Error retrieving bank_id from AsyncStorage:', error);
    }
  };
  const onEvent = (eventName) => {
    
    // if (socket) {
      socket.on(eventName, (data) => {
          // console.log(eventName)
          callback(data);
          // console.log('Response data:', data.JSON);
          // console.log('ON')

      });
     
    // } 
    // else {
    //   console.error("Socket is not connected!");
    // }
  };
  const handleEvent=async()=>{
    onEvent('Event')
  }
  

  return (
    <SocketContext.Provider value={{socket,isConnected,socketOndata,handleEmit,onEvent,GetStorage,handleEvent,countNoti }}>
      {children}
    </SocketContext.Provider>
  );
};

