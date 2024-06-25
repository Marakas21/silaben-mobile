import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker'; // Corrected import
import {useNavigation} from '@react-navigation/native'; // Import useNavigation

const CashonOvo = () => {
  const [show, setShow] = useState(false);

  const [nik, setNik] = useState('');
  const [full_name, setFullName] = useState('');
  const [genderrelawan, setGenderRelawan] = useState('');
  const [dob, setDob] = useState('');
  const [emailrelawan, setEmailrelawan] = useState('');
  const [current_address, setCurrentAddress] = useState('');
  const [whatsapp_number_relawan, setWhatsappNumbeRelawan] = useState('');
  const [job, setJob] = useState('');
  const [passwordrelawan, setPasswordRelawan] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());

  const navigation = useNavigation(); // Initialize navigation

  const handleCreateAccount = () => {
    // check if input fields are not empty or only spaces
    if (
      !nik ||
      !full_name ||
      !genderrelawan ||
      !dob ||
      !emailrelawan ||
      !current_address ||
      !whatsapp_number_relawan ||
      !job ||
      !passwordrelawan
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
      full_name: full_name,
      nik: nik,
      genderrelawan: genderrelawan,
      dob: dob,
      emailrelawan: emailrelawan,
      current_address: current_address,
      whatsapp_number_relawan: whatsapp_number_relawan,
      job: job,
      passwordrelawan: passwordrelawan,
    };

    // Time out request data
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 5000); // 5000 (5 detik)
    });

    Promise.race([
      fetch('https://silaben.site/app/public/login/regist_mobile_relawan', {
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
        console.log(textData);
        console.log(requestBody);

        if (textData.includes(textData)) {
          // message
          Alert.alert('User Account', 'New account was created successfully.');
          navigation.navigate('SignIn');

          // Set empty field
          setNik('');
          setFullName('');
          setGenderRelawan('');
          setDob('');
          setEmailrelawan('');
          setCurrentAddress('');
          setWhatsappNumbeRelawan('');
          setJob('');
          setPasswordRelawan('');
        }
      })
      .catch(error => {
        //console.error(error);
        Alert.alert('Error Message', error.message);
        return;
      });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShow(Platform.OS === 'ios');
    setDob(currentDate);
  };
  const showMode = currentMode => {
    setShow(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Daftar Relawan</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Jenis Kelamin</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setGenderRelawan('Laki-laki')}>
            <View
              style={
                genderrelawan === 'Laki-laki'
                  ? styles.radioSelected
                  : styles.radioUnselected
              }
            />
            <Text style={styles.radioText}>Laki-laki</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setGenderRelawan('Perempuan')}>
            <View
              style={
                genderrelawan === 'Perempuan'
                  ? styles.radioSelected
                  : styles.radioUnselected
              }
            />
            <Text style={styles.radioText}>Perempuan</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/address.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Alamat"
          value={current_address}
          onChangeText={text => setCurrentAddress(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/id-card.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="NIK (No.KTP)"
          value={nik}
          onChangeText={text => setNik(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          value={full_name}
          onChangeText={text => setFullName(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/calendar.png')}
          style={styles.icon}
        />
        <TouchableOpacity
          onPress={() => showMode('date')}
          style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>
            {dob ? dob.toLocaleDateString() : 'Tanggal Lahir'}
          </Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={dob ? new Date(dob) : new Date()}
            mode="date"
            display="default"
            onChange={onChange}
            minimumDate={new Date(1900, 0, 1)}
            maximumDate={new Date(2100, 11, 31)}
            onChangeText={text => setDob(text)}
          />
        )}
      </View>
      <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/email.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={emailrelawan}
          onChangeText={text => setEmailrelawan(text)}
        />
      </View>
      {/* <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/address1.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Tempat tinggal sekarang ini"
          value={current_address}
          onChangeText={text => setCurrentAddress(text)}
        />
      </View> */}
      <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/whatsapp.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nomor Whatsapp aktif"
          value={whatsapp_number_relawan}
          onChangeText={text => setWhatsappNumbeRelawan(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/job.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Pekerjaan"
          value={job}
          onChangeText={text => setJob(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/password.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={passwordrelawan}
          onChangeText={text => setPasswordRelawan(text)}
          secureTextEntry
        />
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleCreateAccount} // Navigate on button press
      >
        <Text style={styles.submitButtonText}>Kirim</Text>
      </TouchableOpacity>
      <View>
        <Image
          source={require('../../assets/images/Down1.png')}
          style={styles.downImage}
        />
      </View>
    </ScrollView>
  );
};

export default CashonOvo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 30,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
    position: 'relative', // Added for icon positioning
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioSelected: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: '#003366',
    marginRight: 10,
  },
  radioUnselected: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#003366',
    marginRight: 10,
  },
  radioText: {
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 40, // Adjusted for icon spacing
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 20,
    height: 20,
  },
  datePickerButton: {
    height: 40,
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 40,
  },
  datePickerText: {
    fontSize: 16,
    color: '#aaa',
  },
  submitButton: {
    backgroundColor: '#003366',
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downImage: {
    width: 10, // Adjust the width as needed
    height: 30, // Adjust the height as needed
    marginVertical: 5,
    marginRight: -12,
  },
});
