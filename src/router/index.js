import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigator} from '../components/';
import HomeMasyarakat from '../pages/HomeMasyarakat';
import HomeRelawan from '../pages/HomeRelawan';
import MapScreen from '../pages/Maps';
import MapScreenRelawan from '../pages/MapsRelawan';
import Pelaporan from '../pages/Pelaporan';
import PelaporanRelawan from '../pages/PelaporanRelawan';
import ProfileScreen from '../pages/Profile';
import Splash from '../pages/Splash';
import SignIn from '../pages/SignIn';
import SignupMasyarakat from '../pages/SignupMasyarakat';
import SignupRelawan from '../pages/SignupRelawan';
import HistoryPelaporan from '../pages/HistoryPelaporan';
import HistoryPelaporanRelawan from '../pages/HistoryPelaporanRelawan';
import HistoryRelawan from '../pages/HistoryRelawan';
import ProfileRelawanScreen from '../pages/ProfileRelawan';
import ChangePasswordScreen from '../pages/ChangePass';
import ChangePasswordRelawanScreen from '../pages/ChangePassRelawan';
import EditProfileScreen from '../pages/ChangeProfile';
import EditProfileRelawanScreen from '../pages/ChangeProfileRelawan';
import DaftarKegiatan from '../pages/DaftarKegiatanRelawan';
import HistoryKegiatan from '../pages/HistoryKegiatanRelawan';
import DetailKegiatan from '../pages/DetailDaftarKegiatanRelawan';

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
          name="HistoryPelaporanRelawan"
          component={HistoryPelaporanRelawan}
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
          name="MapsRelawan"
          component={MapScreenRelawan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Pelaporan"
          component={Pelaporan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PelaporanRelawan"
          component={PelaporanRelawan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileRelawan"
          component={ProfileRelawanScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangePass"
          component={ChangePasswordScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangePassRelawan"
          component={ChangePasswordRelawanScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangeProfile"
          component={EditProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangeProfileRelawan"
          component={EditProfileRelawanScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DaftarKegiatanRelawan"
          component={DaftarKegiatan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HistoryKegiatanRelawan"
          component={HistoryKegiatan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailDaftarKegiatanRelawan"
          component={DetailKegiatan}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
