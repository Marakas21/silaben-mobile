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
  const [nik, setNik] = useState('');
  const [fullName, setfullName] = useState('');
  const [genderrelawan, setGenderRelawan] = useState('');
  const [dob, setDob] = useState('');
  const [emailrelawan, setEmailrelawan] = useState('');
  const [current_address, setCurrentAddress] = useState('');
  const [whatsapp_number_relawan, setWhatsappNumbeRelawan] = useState('');
  const [job, setJob] = useState('');
  const [passwordrelawan, setPasswordRelawan] = useState('');

  const handleCreateAccount = () => {
    // check if input fields are not empty or only spaces
    if (
      !nik.trim() ||
      !fullName.trim() ||
      !genderrelawan.trim() ||
      !dob.trim() ||
      !emailrelawan.trim() ||
      !current_address.trim() ||
      !whatsapp_number_relawan.trim() ||
      !job.trim() ||
      !passwordrelawan.trim()
    ) {
      Alert.alert(
        'Empty Input Field',
        'Check again, all fields cannot be empty or contain only spaces.',
      );
      return;
    }

    // check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailrelawan)) {
      Alert.alert('Error Message', 'Invalid email format.');
      return;
    }

    if (passwordrelawan !== passwordrelawan) {
      Alert.alert('Student Password', 'Please re-type the same password.');
      return;
    }

    if (password !== repassword) {
      Alert.alert(
        'Student Password',
        'Passwords do not match. Please enter the same password in both fields.',
      );
      return;
    }

    if (password.length < 8 || repassword.length < 8) {
      Alert.alert(
        'Student Password',
        'Password length must be at least 8 characters.',
      );
      return;
    }

    // create request body with email and password input values
    const requestBody = {
      reg_number: regist,
      nim_number: nim,
      email: email,
      fullname: name,
      password: password,
    };

    // Time out request data
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 5000); // 5000 (5 detik)
    });

    Promise.race([
      fetch('http://103.31.38.67/unkpresent/public/mobile/registration', {
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

        if (textData.includes('SUCCESS')) {
          // message
          Alert.alert(
            'User Account',
            'New account of the student was created successfully.',
          );

          // Set empty field
          setName('');
          setEmail('');
          setRegist('');
          setNim('');
          setPassword('');
          setRePassword('');
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
          <RNTextInput placeholder="Type your User Name" style={styles.input} />
        </View>
        <View style={styles.inputWrapper}>
          <Image
            source={require('../../assets/images/email.png')}
            style={styles.inputIcon}
          />
          <RNTextInput
            placeholder="Type your Email Address"
            style={styles.input}
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
          />
        </View>
        <View style={styles.pickerWrapper}>
          <Image
            source={require('../../assets/images/gender.png')}
            style={styles.pickerIcon}
          />
          <Picker
            selectedValue={selectedGender}
            onValueChange={itemValue => setSelectedGender(itemValue)}
            style={styles.picker}>
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
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignIn')}>
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
