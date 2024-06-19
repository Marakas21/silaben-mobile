import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput as RNTextInput,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const SignIn = ({navigation}) => {
  const [selectedRole, setSelectedRole] = useState('Anggota Reguler');

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/bencana-splash.jpg')} // replace with your image path
        style={styles.topImage}
        imageStyle={styles.imageStyle}>
        <View style={styles.overlay} />
        <View style={styles.header}>
          <Text style={styles.headerText}>SILABEN</Text>
        </View>
      </ImageBackground>
      <View style={styles.contentWrapper}>
        <Text style={styles.signInText}>LOG IN</Text>
        <Text style={styles.subHeaderText}>
          Tanggap Cepat, Selamatkan Nyawa
        </Text>

        <View style={styles.pickerWrapper}>
          <Image
            source={require('../../assets/images/Role.png')}
            style={styles.inputIcon}
          />
          <Picker
            selectedValue={selectedRole}
            onValueChange={itemValue => setSelectedRole(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Select your Role" value="" />
            <Picker.Item label="Anggota Reguler" value="Anggota Reguler" />
            <Picker.Item label="Relawan" value="Relawan" />
            <Picker.Item label="Admin" value="Admin" />
          </Picker>
        </View>
        <View style={styles.inputWrapper}>
          <Image
            source={require('../../assets/images/Username.png')}
            style={styles.inputIcon}
          />
          <RNTextInput placeholder="Type your User Name" style={styles.input} />
        </View>
        <View style={styles.inputWrapper}>
          <Image
            source={require('../../assets/images/Pass.png')}
            style={styles.inputIcon}
          />
          <RNTextInput
            placeholder="Type your Password"
            secureTextEntry
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.sub3HeaderText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HomeMasyarakat')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignupMasyarakat')}>
          <Text style={styles.buttonText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topImage: {
    height: 200,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    height: 260,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 51, 102, 0.3)', // Softer #003366 with 30% opacity
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
    height: 120,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: -40,
  },
  signInText: {
    fontFamily: 'Poppins-BoldItalic',
    fontSize: 33,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  sub2HeaderText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
    marginBottom: 8,
  },
  sub3HeaderText: {
    fontSize: 15,
    color: 'grey',
    textAlign: 'right',
    marginBottom: 24,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10, // Adjusted for icon spacing
  },
  pickerIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    fontSize: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 10,
    height: 50, // Adjusted for icon spacing
    marginTop: 25,
  },
  inputIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 12,
  },
  button: {
    width: '90%',
    height: 45,
    backgroundColor: '#003366',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 19,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
