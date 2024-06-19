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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker'; // Corrected import
import {useNavigation} from '@react-navigation/native'; // Import useNavigation

const CashonOvo = () => {
  const [gender, setGender] = useState('');
  const [expertise, setExpertise] = useState('');
  const [address, setAddress] = useState('');
  const [nik, setNik] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [currentResidence, setCurrentResidence] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [job, setJob] = useState('');
  const [pass, setPass] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const navigation = useNavigation(); // Initialize navigation

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShow(Platform.OS === 'ios');
    setBirthDate(currentDate);
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
            onPress={() => setGender('Laki-laki')}>
            <View
              style={
                gender === 'Laki-laki'
                  ? styles.radioSelected
                  : styles.radioUnselected
              }
            />
            <Text style={styles.radioText}>Laki-laki</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setGender('Perempuan')}>
            <View
              style={
                gender === 'Perempuan'
                  ? styles.radioSelected
                  : styles.radioUnselected
              }
            />
            <Text style={styles.radioText}>Perempuan</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.formGroup}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={expertise}
            style={styles.picker}
            onValueChange={itemValue => setExpertise(itemValue)}>
            <Picker.Item label="Pilih Bidang Keahlian" value="" />
            <Picker.Item label="Medis" value="Medis" />
            <Picker.Item label="Teknis" value="Teknis" />
            <Picker.Item label="Logistik" value="Logistik" />
            {/* Add more expertise options as needed */}
          </Picker>
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
          value={address}
          onChangeText={text => setAddress(text)}
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
          value={fullName}
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
            {birthDate ? birthDate.toLocaleDateString() : 'Tanggal Lahir'}
          </Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={onChange}
            minimumDate={new Date(1900, 0, 1)}
            maximumDate={new Date(2100, 11, 31)}
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
          value={email}
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/address1.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Tempat tinggal sekarang ini"
          value={currentResidence}
          onChangeText={text => setCurrentResidence(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Image
          source={require('../../assets/images/whatsapp.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nomor Whatsapp aktif"
          value={whatsapp}
          onChangeText={text => setWhatsapp(text)}
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
          value={pass}
          onChangeText={text => setPass(text)}
          secureTextEntry
        />
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => navigation.navigate('SignIn')} // Navigate on button press
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
