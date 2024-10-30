import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
import Logo from '../../assets/icon/Logo.svg';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('HistoryPelaporan');
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/bencana-splash.jpg')} // replace with your image path
        style={styles.image}>
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Logo width={160} height={130} fill="currentColor" />
            <Text style={styles.text}>SIGAP LAPOR BENCANA</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 51, 102, 0.5)', // Softer #003366 with 50% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 100, // adjust as needed
  },
  text: {
    fontSize: 25,
    fontFamily: 'Poppins-BoldItalic',
    color: '#FFFFFF', // Softer color for the text
    fontWeight: 'bold',
    marginTop: 10,
    height: 230,
  },
});
