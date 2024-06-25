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

const SignUp = ({navigation}) => {
  const [selectedGender, setSelectedGender] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp_number, setWhatsappNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = () => {
    // check if input fields are not empty or only spaces
    if (!name || !gender || !email || !whatsapp_number || !password) {
      Alert.alert(
        'Empty Input Field',
        'Check again, all fields cannot be empty or contain only spaces.',
      );
      return;
    }

    // check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error Message', 'Invalid email format.');
      return;
    }

    // if (passwordrelawan !== passwordrelawan) {
    //   Alert.alert('Student Password', 'Please re-type the same password.');
    //   return;
    // }

    // if (password !== repassword) {
    //   Alert.alert(
    //     'Student Password',
    //     'Passwords do not match. Please enter the same password in both fields.',
    //   );
    //   return;
    // }

    // if (password.length < 8 || repassword.length < 8) {
    //   Alert.alert(
    //     'Student Password',
    //     'Password length must be at least 8 characters.',
    //   );
    //   return;
    // }

    // create request body with email and password input values
    const requestBody = {
      name: name,
      gender: gender,
      email: email,
      whatsapp_number: whatsapp_number,
      password: password,
    };

    // Time out request data
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 5000); // 5000 (5 detik)
    });

    Promise.race([
      fetch('https://silaben.site/app/public/login/regist_mobile_reguler', {
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
        // handle response data
        console.log(textData);

        // check if textData contains "ERROR"
        if (textData.includes('ERROR')) {
          // handle error case
          //console.error("Login failed:", textData);
          Alert.alert(
            'Error Message',
            'Sorry, create new account failed. Please try again.',
          );
          return;
        }

        // check if textData contains "INCORRECT"
        if (textData.includes('DUPLICATE')) {
          // handle INCORRECT case
          Alert.alert(
            'Error Message',
            'Sorry, duplicate email/nim/reg.number were found in database. Please contact the administrator.',
          );
          return;
        }

        if (textData.includes(textData)) {
          // message
          Alert.alert('User Account', 'New account was created successfully.');
          navigation.navigate('SignIn');

          // Set empty field
          setName('');
          setGender('');
          setEmail('');
          setWhatsappNumber('');
          setPassword('');
        }
      })
      .catch(error => {
        //console.error(error);
        Alert.alert('Error Message', error.message);
        return;
      });
  };

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
        <Text style={styles.signUpText}>Create an Account</Text>
        <View style={styles.inputWrapper}>
          <Image
            source={require('../../assets/images/Username.png')}
            style={styles.inputIcon}
          />
          <RNTextInput
            placeholder="Type your User Name"
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
            source={require('../../assets/images/email.png')}
            style={styles.inputIcon}
          />
          <RNTextInput
            placeholder="Type your Email Address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
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
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            keyboardType="default"
            autoCompleteType="username"
          />
        </View>
        <View style={styles.pickerWrapper}>
          <Image
            source={require('../../assets/images/gender.png')}
            style={styles.pickerIcon}
          />
          <Picker
            selectedValue={gender}
            onValueChange={itemValue => setGender(itemValue)}
            style={styles.picker}
            value={gender}
            onChangeText={setGender}
            autoCapitalize="none"
            keyboardType="default"
            autoCompleteType="gender">
            <Picker.Item label="Select your gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </View>
        <View style={styles.inputWrapper}>
          <Image
            source={require('../../assets/images/whatsapp.png')}
            style={styles.inputIcon}
          />
          <RNTextInput
            placeholder="Type your Whatsapp Number"
            style={styles.input}
            value={whatsapp_number}
            onChangeText={setWhatsappNumber}
            autoCapitalize="none"
            keyboardType="default"
            autoCompleteType="whatsapp_number"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          // eslint-disable-next-line no-undef
          onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUp;

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
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  signUpText: {
    fontFamily: 'Poppins-BoldItalic',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10, // Adjusted for icon spacing
    marginBottom: 16,
    padding: 6,
  },
  inputIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  pickerWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10, // Adjusted for icon spacing
  },
  pickerIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
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
