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
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';

const SignIn = ({navigation}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setName('');
      setPassword('');
      setRole('');
    }, []),
  );

  const handleSignIn = () => {
    if (!name || !password || !role) {
      Alert.alert('Error Message', 'Fields cannot be empty');
      return;
    }

    const requestBody = {
      name: name,
      password: password,
      role: role,
    };

    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'));
      }, 10000);
    });

    Promise.race([
      fetch('https://silaben.site/app/public/login/loginmobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: Object.keys(requestBody)
          .map(
            key =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                requestBody[key],
              )}`,
          )
          .join('&'),
      }),
      timeoutPromise,
    ])
      .then(response => response.text())
      .then(textData => {
        const parsedData = JSON.parse(textData);
        const jsonData = parsedData['status-login'][0];

        if (textData.includes('ERROR')) {
          Alert.alert(
            'Error Message',
            'Sorry, login failed. Please try again.',
          );
          return;
        }

        if (role === 'relawan') {
          Alert.alert('Login Success', 'Welcome to Silaben.');
          navigation.navigate('HomeRelawan', {jsonData});
        } else if (role === 'user') {
          Alert.alert('Login Success', 'Welcome to Silaben.');
          navigation.navigate('HomeMasyarakat', {jsonData});
        }
      })
      .catch(error => {
        Alert.alert('Error Message', error.message);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/bencana-splash.jpg')}
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
            selectedValue={role}
            onValueChange={itemValue => setRole(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Select your Role" value="" />
            <Picker.Item label="user" value="user" />
            <Picker.Item label="admin" value="admin" />
            <Picker.Item label="relawan" value="relawan" />
          </Picker>
        </View>
        <View style={styles.inputWrapper}>
          <Image
            source={require('../../assets/images/Username.png')}
            style={styles.inputIcon}
          />
          <RNTextInput
            placeholder="Type your User Name"
            placeholderTextColor="#707070"
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            keyboardType="default"
            autoCompleteType="username"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Image
            source={require('../../assets/images/Pass.png')}
            style={styles.inputIcon}
          />
          <RNTextInput
            placeholder="Type your Password"
            placeholderTextColor="#707070"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCompleteType="password"
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.sub3HeaderText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
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
    backgroundColor: 'rgba(0, 51, 102, 0.3)',
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
    paddingLeft: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#707070',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 10,
    height: 50,
    marginTop: 20,
  },
  inputIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
    color: '#707070',
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 12,
    color: '#707070',
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

export default SignIn;
