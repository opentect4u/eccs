import React, { useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SCREEN_HEIGHT } from 'react-native-normalize';

import Home from './Home';
import Profile from '../Pages/Profile';
import Notification from '../Pages/Notification';
import { useSocket } from '../Context/Socket';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator()

const BottomNavigator = () => {
  const { countNoti } = useSocket();
  const bottomNav = 0.08 * SCREEN_HEIGHT;

  useEffect(() => {
    // console.log(countNoti,'countNoti bottom nav')
  },)

  const Badge = ({ count }) => (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>

  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          // backgroundColor: 'white',
          // backgroundColor: '#a20a3a',
          backgroundColor: '#3f50b5',

          height: bottomNav,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name={"Home"}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={require('../assets/home.png')} // Replace with the actual path to your image
              // style={{ width: 20, height: 20,tintColor: focused ? '#ff8c00' : '#209fb2' }}
              style={{ width: 20, height: 20, tintColor: focused ? '#ffffff' : '#bdbff5' }}
            />
          )
        }}
        component={Home}
      />
      <Tab.Screen
        name={"Profile"}
        options={({ navigation }) => ({
          title: '',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={26} color="#000" />
              {/* <Text style={styles.backButtonText}>Back</Text> */}
            </TouchableOpacity>
          ),
          headerTransparent: true,
          headerStyle: {
            borderBottomWidth: 0,
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
            },
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={require('../assets/user.png')}
              // style={{ width: 20, height: 20,tintColor: focused ? '#ff8c00' : '#209fb2' }} 
              style={{ width: 20, height: 20, tintColor: focused ? '#ffffff' : '#bdbff5' }}
            />
          )
        })}
        component={Profile}
      />
      <Tab.Screen
        name={"notification"}
        options={({ navigation }) => ({
          title: '',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={26} color="#000" />
              {/* <Text style={styles.backButtonText}>Back</Text> */}
            </TouchableOpacity>
          ),
          headerTransparent: true,
          headerStyle: {
            borderBottomWidth: 0,
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
            },
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Image
                source={require('../assets/notification.png')}
                // style={{ width: 20, height: 20,tintColor: focused ? '#ff8c00' : '#209fb2' }} 
                style={{ width: 20, height: 20, tintColor: focused ? '#ffffff' : '#bdbff5' }}
              />
              {countNoti > 0 && <Badge count={countNoti > 9 ? '9+' : countNoti} />}
            </View>
          )
        })}
        component={Notification}
      />
    </Tab.Navigator>

  );
};

// const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});


export default BottomNavigator;