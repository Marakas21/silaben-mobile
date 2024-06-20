import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const Navbar = ({navigation}) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('MapScreen')}>
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
    marginTop: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default Navbar;
