import React,{useEffect,useContext} from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import Login from '../Pages/Login';
import Registration from '../Pages/Registration';
import Home from './Home';
import BottomNavigator from './BottomNavigator';
import Demand from '../Pages/Demand';
import Networth from '../Pages/Networth';
import CalendarComponent from '../Pages/CalendarComponent';
import RouteGaurdContext from '../Context/AuthGuard';
import Contacts from '../Pages/Contacts';
import Download from '../Pages/Download';
import HolidayHome from '../Pages/HolidayHome';
import Feedback from '../Pages/Feedback';

const Stack = createNativeStackNavigator()
const MainRoute = () => {

  const { authDT } = useContext(RouteGaurdContext);

  useEffect(() => {
      console.log(authDT, `authDT`)
  }, [])
  

  return (
    <Stack.Navigator>

      {
        !authDT ?
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Reg" component={Registration} options={{ headerShown: false }} />
          </> :
          <>
            <Stack.Screen name='BottomNav' component={BottomNavigator} options={{ headerShown: false }} />
            <Stack.Screen name='Demand' component={Demand} options={{ headerShown: false }} />
            <Stack.Screen name='Networth' component={Networth} options={{ headerShown: false }} />
            <Stack.Screen name='Calendar' component={CalendarComponent} options={{ headerShown: false }} />
            <Stack.Screen name='Contacts' component={Contacts} options={{ headerShown: false}}/>
            <Stack.Screen name='Download' component={Download} options={{ headerShown: false}}/>
            <Stack.Screen name='HolidayHome' component={HolidayHome} options={{ headerShown: false}}/>
            <Stack.Screen name='Feedback' component={Feedback} options={{ headerShown: false}}/>
          </>
      }


    </Stack.Navigator>


  );
};

// const screenWidth = Dimensions.get('window').width;



export default MainRoute;