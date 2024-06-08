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
import Profile from '../Pages/Profile';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator()
const MainRoute = () => {
  const { authDT } = useContext(RouteGaurdContext);
  useEffect(() => {
      console.log(authDT, `authDT main`)
  }, [])
  
  console.log(authDT, `authDT2`)
  return (
    <Stack.Navigator>

      {
        !authDT ?
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='Registration' component={Registration}
            options={({ navigation }) => ({
              title: '',
              // headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-back" size={24} color="#000" />
                  {/* <Text style={styles.backButtonText}>Back</Text> */}
                </TouchableOpacity>
              ),
              headerTransparent: true,
              headerStyle: {
              borderBottomWidth: 0,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              },
            })}
            />
          </> :
          <>
            <Stack.Screen name='BottomNav' component={BottomNavigator} options={{ headerShown: false }} />
            <Stack.Screen name='Demand' component={Demand}
            options={({ navigation }) => ({
              title: '',
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-back" size={24} color="#000" />
                  {/* <Text style={styles.backButtonText}>Back</Text> */}
                </TouchableOpacity>
              ),
              headerTransparent: true,
              headerStyle: {
              borderBottomWidth: 0,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              },
            })}/>
            <Stack.Screen name='Networth' component={Networth} 
            options={({ navigation }) => ({
              title: '',
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-back" size={24} color="#000" />
                  {/* <Text style={styles.backButtonText}>Back</Text> */}
                </TouchableOpacity>
              ),
              headerTransparent: true,
              headerStyle: {
              borderBottomWidth: 0,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              },
            })} />
            <Stack.Screen name='Calendar' component={CalendarComponent}
            options={({ navigation }) => ({
              title: '',
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-back" size={24} color="#000" />
                  {/* <Text style={styles.backButtonText}>Back</Text> */}
                </TouchableOpacity>
              ),
              headerTransparent: true,
              headerStyle: {
              borderBottomWidth: 0,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              },
            })} />
            <Stack.Screen name='Contacts' component={Contacts}
            options={({ navigation }) => ({
              title: '',
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-back" size={24} color="#000" />
                  {/* <Text style={styles.backButtonText}>Back</Text> */}
                </TouchableOpacity>
              ),
              headerTransparent: true,
              headerStyle: {
              borderBottomWidth: 0,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              },
            })}/>
            <Stack.Screen name='Download' component={Download} 
            options={({ navigation }) => ({
              title: '',
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-back" size={24} color="#000" />
                  {/* <Text style={styles.backButtonText}>Back</Text> */}
                </TouchableOpacity>
              ),
              headerTransparent: true,
              headerStyle: {
              borderBottomWidth: 0,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              },
            })}/>
            <Stack.Screen name='HolidayHome' component={HolidayHome} options={{ headerShown: false}}/>
            <Stack.Screen name='Feedback' component={Feedback}
            
            options={({ navigation }) => ({
              title: '',
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-back" size={24} color="#000" />
                  {/* <Text style={styles.backButtonText}>Back</Text> */}
                </TouchableOpacity>
              ),
              headerTransparent: true,
              headerStyle: {
              borderBottomWidth: 0,
              elevation: 0, 
              shadowOpacity: 0, 
              },
            })}/>

<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          </>
      }
    </Stack.Navigator>
  );
};
// const screenWidth = Dimensions.get('window').width;
export default MainRoute;

const styles = StyleSheet.create({
  backButton: {
    // paddingHorizontal: 1,
  },
});