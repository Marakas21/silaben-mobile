import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navbar = ({route}) => {
  const navigation = useNavigation();
  // const {jsonData = {}} = route.params || {};
  // console.log('Ini json data:', jsonData);

  // // Simpan data ke AsyncStorage saat pertama kali menerima
  // useEffect(() => {
  //   const saveData = async () => {
  //     try {
  //       await AsyncStorage.setItem('@jsonData', JSON.stringify(jsonData));
  //     } catch (e) {
  //       console.error('Error saving data', e);
  //     }
  //   };

  //   if (Object.keys(jsonData).length > 0) {
  //     saveData();
  //   }
  // }, [jsonData]);

  // // Baca data dari AsyncStorage
  // const [storedData, setStoredData] = useState(null);

  // useEffect(() => {
  //   const readData = async () => {
  //     try {
  //       const jsonValue = await AsyncStorage.getItem('@jsonData');
  //       setStoredData(jsonValue != null ? JSON.parse(jsonValue) : {});
  //     } catch (e) {
  //       console.error('Error reading data', e);
  //     }
  //   };

  //   readData();
  // }, []);

  // const dataToUse = storedData || jsonData;

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('HomeMasyarakat')}>
        <Image
          source={require('../../../src/assets/images/maps2.png')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Pelaporan')}>
        <Image
          source={require('../../../src/assets/images/add_report2.png')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Profile')}>
        <Image
          source={require('../../../src/assets/images/profile_pict3.png')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 35,
    height: 30,
  },
});

export default Navbar;
