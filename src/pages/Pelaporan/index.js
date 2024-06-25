import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

const App = ({navigation}) => {
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [locationText, setLocationText] = useState('Pilih Lokasi di Peta');
  const [searchText, setSearchText] = useState('');

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
    setLocation({latitude, longitude});
    updateLocationText(latitude, longitude);
  };

  const handleMarkerDragEnd = async event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setLocation({latitude, longitude});
    updateLocationText(latitude, longitude);
  };

  const updateLocationText = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      );
      const address = response.data.address;
      const specificAddress = `${address.road}, ${address.house_number}, ${address.city}, ${address.state}, ${address.country}`;
      setLocationText(specificAddress);
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
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${searchText}`,
      );
      if (response.data.length > 0) {
        const {lat, lon, display_name} = response.data[0];
        setLocation({
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

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <LinearGradient colors={['#0066CC', '#003366']} style={styles.header}>
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
              label="Pilih Jenis Bencana"
              value=""
            />
            <Picker.Item
              style={styles.inputText}
              label="Banjir"
              value="banjir"
            />
            <Picker.Item
              style={styles.inputText}
              label="Gempa Bumi"
              value="gempa"
            />
            <Picker.Item
              style={styles.inputText}
              label="Kebakaran"
              value="kebakaran"
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
                coordinate={location}
                draggable
                onDragEnd={handleMarkerDragEnd}
              />
            )}
          </MapView>
        </View>
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationText}>{locationText}</Text>
        </View>
        <View style={styles.buttonContainer}>
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
  inputText: {
    color: '#707070',
  },
  locationTextContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 13,
    minHeight: 60, // Minimum height for the TextArea
  },
  locationText: {
    color: '#707070',
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
    color: '#707070',
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
  },
  mapContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    marginBottom: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  buttonIcon: {
    width: 24,
    height: 24,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default App;
