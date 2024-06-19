import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Linking,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import LinearGradient from 'react-native-linear-gradient';

const App = ({navigation}) => {
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [locationText, setLocationText] = useState('');
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to report a disaster.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        getCurrentLocation();
        // Update the UI to display the current location
        setLocationText('Getting current location...');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log('Error getting location:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleImagePicker = () => {
    const options = {
      storageOptions: {
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = selectedDate => {
    const currentDate = selectedDate || date;
    setDate(currentDate.toLocaleDateString());
    hideDatePicker();
  };

  const handleMapPress = event => {
    setLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
    setMapModalVisible(false);
  };

  const toggleMapModal = () => {
    setMapModalVisible(!mapModalVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <LinearGradient colors={['#0066CC', '#003366']} style={styles.header}>
          <Text style={styles.headerText}>Buat Pelaporan</Text>
          <Image
            source={require('../../../src/assets/images/home_white.png')}
            style={styles.buttonIcon}
            onPress={() => navigation.navigate('HomeMasyarakat')}
          />
        </LinearGradient>
      </View>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Judul Laporan" />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={disasterType}
            onValueChange={itemValue => setDisasterType(itemValue)}
            style={styles.picker}>
            <Picker.Item
              style={styles.textPicker}
              label="Pilih Jenis Bencana"
              value=""
            />
            <Picker.Item
              style={styles.textPicker}
              label="Banjir"
              value="banjir"
            />
            <Picker.Item
              style={styles.textPicker}
              label="Gempa Bumi"
              value="gempa"
            />
            <Picker.Item
              style={styles.textPicker}
              label="Kebakaran"
              value="kebakaran"
            />
          </Picker>
        </View>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
          <Text>{date ? date : 'Tanggal Kejadian Bencana'}</Text>
          <Image
            source={require('../../../src/assets/images/calender.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <TextInput
          style={styles.input}
          placeholder="Deskripsi bencana..."
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={requestLocationPermission}
            style={styles.iconButton}>
            {location ? (
              <Text style={styles.buttonText}>
                {location.latitude}, {location.longitude}
              </Text>
            ) : (
              <Text style={styles.buttonText}>{locationText}</Text>
            )}
            <Image
              source={require('../../../src/assets/images/location.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Lokasi Bencana</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.iconButton}>
            <Image
              source={require('../../../src/assets/images/image.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Upload Foto</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#003366',
    padding: 30,
    alignItems: 'center',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 13,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    fontSize: 0.5,
  },
  textPicker: {
    fontSize: 13,
    color: '#929292',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 5,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
    color: '#333333',
  },
  submitButton: {
    backgroundColor: '#003366',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    marginTop: 170,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default App;
