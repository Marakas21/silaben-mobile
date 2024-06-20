import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Header = ({navigation}) => {
  return (
    <View>
      <LinearGradient colors={['#0066CC', '#003366']} style={styles.header}>
        <Text style={styles.headerText}>Buat Pelaporan</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HomeMasyarakat')}>
          <Image
            source={require('../../../src/assets/images/home_white.png')}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007bff',
    padding: 40,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
    marginBottom: 20,
  },
});

export default Header;
