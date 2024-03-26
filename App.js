import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Login from './src/Pages/Login';
import Registration from './src/Pages/Registration';
import Home from './src/Components/Home';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import HeaderComponent from './src/Components/HeaderComponent';
import BottomNavigator from './src/Components/BottomNavigator';
import Demand from './src/Pages/Demand';
import Networth from './src/Pages/Networth';
import { Calendar } from 'react-native-calendars';
import CalendarComponent from './src/Pages/CalendarComponent';
import MainRoute from './src/Components/MainRoute';
import RouteGaurdProvider from './src/Context/AuthGuardProvider';
import { SocketProvider } from './src/Context/Socket';

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  // success: (props) => (
  //   <BaseToast
  //     {...props}
  //     style={{
  //       borderLeftColor:'green',
  //       borderLeftWidth: 7,
  //       width:'90%',
  //       height:70,
  //       borderRightColor: 'green',
  //       borderLeftWidth: 7
  //     }}
  //     contentContainerStyle={{
  //       paddingHorizontal:15
  //     }}
  //     text1Style={{
  //       fontSize:17,
  //       fontWeight:'700',
  //     }}
  //     text2Style={{
  //       fontSize:14
  //     }}
     
  //   />
  // ),
  success: (props) => (
    <ErrorToast
      {...props}
      style={{      
        width:'70%',
        height:45,
        backgroundColor:'white',
        borderleftWidth:5,
        borderLeftColor:'green',
        alignItems:'center',
      }}
      contentContainerStyle={{
        paddingHorizontal:40,
        alignItems:'center'
      }}
      text1Style={{
        fontSize:14,
        fontWeight:'500',
        color:'black',
        fontFamily:'Roboto'
      }}
    />
  ),
  
  error: (props) => (
    <ErrorToast
      {...props}
      style={{      
        width:'70%',
        height:45,
        backgroundColor:'white',
        borderleftWidth:5,
        borderLeftColor:'red',
        // borderRadius:50,
        alignItems:'center',
        
      }}
      contentContainerStyle={{
        paddingHorizontal:40,
        alignItems:'center'
      }}
      text1Style={{
        fontSize:14,
        fontWeight:'700',
        color:'black',
        fontFamily:'Roboto'
      }}
    />
  ),
 
};

const Stack = createNativeStackNavigator()
function App() {

    return (
      <SocketProvider>
      <RouteGaurdProvider>
        <NavigationContainer>
          <MainRoute/>
          {/* <Stack.Navigator>
            <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
            <Stack.Screen name='Reg' component={Registration} options={{headerShown: false}}/>
            <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
            <Stack.Screen name='Header' component={HeaderComponent} options={{headerShown:false}}/>
            <Stack.Screen name='bottomNav' component={BottomNavigator} optio={{headerShown:false}}/>
            <Stack.Screen name='Demand' component={Demand} options={{headerShown:false}}/>
            <Stack.Screen name='Networth' component={Networth} options={{headerShown:false}}/>
            <Stack.Screen name='Calendar' component={CalendarComponent} options={{headerShown:false}}/>
          </Stack.Navigator> */}
          <Toast config={toastConfig}/>
        </NavigationContainer>
      </RouteGaurdProvider>
      </SocketProvider>
    )
  };
export default App;