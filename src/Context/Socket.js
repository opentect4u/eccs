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
    // const newSocket = io("http://202.21.38.178:3002");
    const newSocket = io ("https://pnbeccs.synergicbanking.in")
    setSocket(newSocket);
    newSocket.on('connect', () => {
      setIsConnected(true);
    });
    newSocket.on('disconnect', () => {
      setIsConnected(false); 
    });
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    
  }, []);
  const GetStorage = async () => {
    try {
        const asyncData = await AsyncStorage.getItem(`login_data`);
        setbankid(JSON.parse(asyncData)?.bank_id)
        setEmpCode(JSON.parse(asyncData).emp_code)
    }
    catch (err) {
    }

}
  
  const handleEmit = async () => {
    try {
      // var socket = io("http://202.21.38.178:3002")
      var socket = io ("https://pnbeccs.synergicbanking.in")
      socket.emit('notification',{bank_id:0, message: 'Update bank data!' })

      socket.on('send notification', data => {
            console.log('socket_data:' + JSON.stringify(data));
            console.log(empCode,'empCode')
            // const filteredObjects = []
            const filteredObjects = data.msg.filter(dt => dt.send_user_id == empCode)
            console.log(filteredObjects,'next')
          // data.msg.forEach(item => {
          //   console.log(item.send_user_id,'item.send_user_id')
          //       if (item.send_user_id === empCode) {
          //         filteredObjects.push(item);
          //       }
          //     })
          setSocketOnData(filteredObjects)
          
          const v = socketOndata.filter(dt=>(dt.send_user_id==empCode || dt.send_user_id==0) && dt.view_flag != "Y").length
          setCountNoti(v)
        })
     
      
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

