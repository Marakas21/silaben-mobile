import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Geolocation from 'react-native-geolocation-service';

const Pelaporan = ({navigation}) => {
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [locationText, setLocationText] = useState('Pilih Lokasi di Peta');
  const [searchText, setSearchText] = useState('');
  const [anonim, setAnonim] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Izin Lokasi',
            message: 'Aplikasi ini membutuhkan akses lokasi Anda.',
            buttonNeutral: 'Nanti',
            buttonNegative: 'Batal',
            buttonPositive: 'Izinkan',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        getCurrentLocation();
      }
    };

    requestLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        updateLocationText(latitude, longitude);
      },
      error => {
        console.log(error.code, error.message);
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
    setDate(selectedDate.toLocaleDateString());
    hideDatePicker();
  };

  const handleMapPress = async event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setLocation({...location, latitude, longitude});
    updateLocationText(latitude, longitude);
  };

  const handleMarkerDragEnd = async event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setLocation({...location, latitude, longitude});
    updateLocationText(latitude, longitude);
    mapRef.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      500,
    );
  };

  const updateLocationText = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      );
      const address = response.data.address;
      const addressText = `${address.road}, ${address.city}, ${address.state}, ${address.country}`;
      setLocationText(addressText);
    } catch (error) {
      console.warn(error);
      setLocationText(
        `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
      );
    }
  };

  const searchLocation = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${searchText}`,
      );
      if (response.data.length > 0) {
        const {lat, lon, display_name} = response.data[0];
        setLocation({
          ...location,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
        setLocationText(display_name);
      } else {
        setLocationText('Lokasi tidak ditemukan');
      }
    } catch (error) {
      console.warn(error);
      setLocationText('Error mencari lokasi');
    }
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true); // Show time picker modal
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false); // Hide time picker modal
  };

  const handleConfirmTime = selectedTime => {
    setTime(selectedTime.toLocaleTimeString()); // Handle time selection and format it
    hideTimePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <LinearGradient colors={['#0D85FE', '#003366']} style={styles.header}>
            <Text style={styles.headerText}>Buat Pelaporan</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('HomeMasyarakat')}>
              <Image
                source={require('../../../src/assets/images/home_white.png')}
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Judul Laporan"
            placeholderTextColor="#707070"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={disasterType}
              onValueChange={itemValue => setDisasterType(itemValue)}
              style={styles.picker}>
              <Picker.Item
                style={styles.inputText}
                label="Klasifikasi Laporan Bencana"
                value=""
              />
              <Picker.Item style={styles.inputText} label="Alam" value="Alam" />
              <Picker.Item
                style={styles.inputText}
                label="Non Alam"
                value="Non Alam"
              />
              <Picker.Item
                style={styles.inputText}
                label="Sosial"
                value="Sosial"
              />
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={disasterType}
              onValueChange={itemValue => setDisasterType(itemValue)}
              style={styles.picker}>
              <Picker.Item
                style={styles.inputText}
                label="Segera Lapor ke Instansi Terkait"
                value=""
              />
              <Picker.Item
                style={styles.inputText}
                label="Kepolisian"
                value="Kepolisian"
              />
              <Picker.Item
                style={styles.inputText}
                label="Rumah Sakit"
                value="Rumah Sakit"
              />
              <Picker.Item
                style={styles.inputText}
                label="Kelurahan"
                value="Kelurahan"
              />
              <Picker.Item
                style={styles.inputText}
                label="Tidak Mendesak"
                value="Tidak Mendesak"
              />
              <Picker.Item
                style={styles.inputText}
                label="Lainnya"
                value="Lainnya"
              />
            </Picker>
          </View>
          <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
            <Text style={styles.inputText}>
              {date ? date : 'Tanggal Kejadian Bencana'}
            </Text>
            <Image
              source={require('../../../src/assets/images/calendar.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={showTimePicker} style={styles.dateInput}>
            <Text style={styles.inputText}>
              {time ? time : 'Waktu Kejadian Bencana'}
            </Text>
            <Image
              source={require('../../../src/assets/images/clock.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePicker}
          />
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
            placeholderTextColor="#707070"
          />
          <TextInput
            style={styles.input}
            placeholder="Cari Lokasi"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={searchLocation}
            placeholderTextColor="#707070"
          />
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              onPress={handleMapPress}
              initialRegion={{
                latitude: 1.4153965,
                longitude: 124.9867153,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              {location.latitude !== 0 && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                />
              )}
            </MapView>
          </View>
          <TextInput
            style={styles.input}
            placeholder={locationText}
            placeholderTextColor="#707070"
          />
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.imageInput}>
            <Text style={styles.inputText}>Unggah Gambar</Text>
            {selectedImage && (
              <Image
                source={{uri: selectedImage}}
                style={styles.imagePreview}
              />
            )}
          </TouchableOpacity>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Laporkan sebagai anonim</Text>
            <Picker
              selectedValue={anonim}
              onValueChange={value => setAnonim(value)}
              style={styles.picker}>
              <Picker.Item label="Tidak" value="Tidak" />
              <Picker.Item label="Ya" value="Ya" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.button}>
            <LinearGradient
              colors={['#0D85FE', '#0000FF']}
              style={styles.buttonBackground}>
              <Text style={styles.buttonText}>Laporkan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Navbar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  inputText: {
    color: '#000',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  mapContainer: {
    height: 200,
    marginBottom: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  imageInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  switchLabel: {
    color: '#000',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
  buttonBackground: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Pelaporan;
