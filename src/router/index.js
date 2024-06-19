import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigator} from '../components/';
import HomeMasyarakat from '../pages/HomeMasyarakat';
import HomeRelawan from '../pages/HomeRelawan';
import MapScreen from '../pages/Maps';
import Pelaporan from '../pages/Pelaporan';
import Profile from '../pages/Profile';
import Splash from '../pages/Splash';
import SignIn from '../pages/SignIn';
import SignupMasyarakat from '../pages/SignupMasyarakat';
import SignupRelawan from '../pages/SignupRelawan';
import HistoryPelaporan from '../pages/HistoryPelaporan';
import HistoryRelawan from '../pages/HistoryRelawan';

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="SplashScreen"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignupMasyarakat"
          component={SignupMasyarakat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignupRelawan"
          component={SignupRelawan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HistoryPelaporan"
          component={HistoryPelaporan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HistoryRelawan"
          component={HistoryRelawan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeMasyarakat"
          component={HomeMasyarakat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeRelawan"
          component={HomeRelawan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Pelaporan"
          component={Pelaporan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
