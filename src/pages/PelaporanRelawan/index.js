/* eslint-disable no-undef */
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
  Alert,
  ImageBackground,
  Button,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker, Circle} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import NavbarRelawan from '../../components/NavbarRelawan';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from 'react-native-geolocation-service';

const Pelaporan = ({navigation, route}) => {
  const [report_title, setReportTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [input_long_location, setInputLongLocation] = useState('');
  const [input_lat_location, setInputLatLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [lapor_instansi, setLaporInstansi] = useState('');
  const [locationText, setLocationText] = useState('Pilih Lokasi di Peta');
  const [searchText, setSearchText] = useState('');
  const [input_lokasi_bencana, setInputLokasiBencana] = useState('');
  const [report_file, setReportFile] = useState('');
  const [anonim, setAnonim] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  [fileName, setFileName] = useState('');

  // Mengambil data dari parameter atau default menjadi objek kosong
  const {jsonData = {}} = route.params || {};
  console.log('Ini json data Pelaporan:', jsonData);

  const mapRef = useRef(null);

  const handleCreatePelaporan = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      storageOptions: {
        path: 'images',
      },
    };

    if (
      !report_title ||
      !description ||
      !selectedImage ||
      !location ||
      !date ||
      !time ||
      !lapor_instansi ||
      !locationText
    ) {
      Alert.alert(
        'Empty Input Field',
        'Check again, all fields cannot be empty or contain only spaces.',
      );
      return;
    }

    const formData = new FormData();
    formData.append('report-title', report_title);
    formData.append('report-description', description);
    formData.append('input-long-location', location.longitude);
    formData.append('input-lat-location', location.latitude);
    formData.append('input-lokasi-bencana', locationText);
    formData.append('lapor-instansi', lapor_instansi);
    formData.append('report-date', date);
    formData.append('report-time', time);
    // formData.append('identity', 'tidak anonim');
    formData.append('user-id', jsonData.user_id);
    formData.append('user-role', jsonData.role);
    formData.append('user-name', jsonData.nama_relawan);
    formData.append('email', jsonData.email);
    formData.append('report-file', {
      uri: selectedImage.uri,
      name: selectedImage.fileName,
      type: selectedImage.type,
    }); // Append image correctly

    console.log('Ini formData', formData);

    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 100000);
    });

    //const boundary = 'boundary-' + Math.random().toString(36).substring(2);
    Promise.race([
      fetch('https://silaben.site/app/public/home/submitlaporanmobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }),
      timeoutPromise,
    ])
      .then(response => response.text())
      .then(textData => {
        console.log(textData);

        if (textData.includes('LAPOR FAILED')) {
          Alert.alert(
            'Error Message',
            'Sorry, create new account failed. Please try again.',
          );
          return;
        }

        // if (textData.includes('DUPLICATE')) {
        //   Alert.alert(
        //     'Error Message',
        //     'Sorry, duplicate email/nim/reg.number were found in database. Please contact the administrator.',
        //   );
        //   return;
        // }

        if (textData.includes('LAPOR SUCCESS')) {
          Alert.alert('Laporan anda berhasil dikirim.');

          setReportTitle('');
          setDescription('');
          setLocation({latitude: 0, longitude: 0});
          setInputLongLocation('');
          setInputLatLocation('');
          setLocationText('');
          setDate('');
          setTime('');
          setLaporInstansi('');
          setReportFile('');
          setAnonim('');
          setSelectedImage('');
        }
      })
      .catch(error => {
        Alert.alert('Error Message', error.message);
        console.log('Error in fetch request:', error);
        return;
      });
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      storageOptions: {
        path: 'images',
      },
    };

    launchImageLibrary(options, async response => {
      if (response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0];
        setSelectedImage({
          uri: selectedAsset.uri,
          fileName: selectedAsset.fileName,
          type: selectedAsset.type,
        });
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
    setLocation({
      ...location,
      latitude: latitude,
      longitude: longitude,
    });
    updateLocationText(latitude, longitude);
  };

  const handleMarkerDragEnd = async event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setLocation({
      ...location,
      latitude: latitude,
      longitude: longitude,
    });
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

  const updateLocation = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'silaben/1.0 (https://silaben.site)',
          },
        },
      );
      const address = response.data.address;
      console.log(address);
      const addressText = `${address.road}, ${address.county}, ${address.state}, ${address.country}`;
      setLocationText(addressText);
    } catch (error) {
      console.warn(error);
      setLocationText(
        `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
      );
    }
  };

  // const searchLocation = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${searchText}`,
  //     );
  //     if (response.data.length > 0) {
  //       const {lat, lon, display_name} = response.data[0];
  //       setLocation({
  //         ...location,
  //         latitude: parseFloat(lat),
  //         longitude: parseFloat(lon),
  //       });
  //       setLocationText(display_name);
  //     } else {
  //       setLocationText('Lokasi tidak ditemukan');
  //     }
  //   } catch (error) {
  //     console.warn(error);
  //     setLocationText('Error mencari lokasi');
  //   }
  // };

  useEffect(() => {
    // Get current location
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          locationName: '',
        });
      },
      error => setErrorMsg(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  // const updateLocation = async (lat, lng) => {
  //   setLocation({...location, latitude: lat, longitude: lng});

  //   try {
  //     const response = await fetch(
  //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
  //       {
  //         headers: {
  //           'User-Agent': 'silaben/1.0 (https://silaben.site)',
  //         },
  //       },
  //     );
  //     const address = await response.json();
  //     console.log(address);
  //     const addressText = `${address.road}, ${address.city}, ${address.state}, ${address.country}`;
  //     // setLocationText(addressText);
  //     setLocation(prevState => ({
  //       ...prevState,
  //       locationName: address.display_name,
  //     }));
  //   } catch (err) {
  //     console.error('ini error 1', err);
  //     setLocationText(
  //       `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
  //     );
  //   }
  // };

  const handleSearch = async query => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${query}, North Sulawesi`,
        {
          headers: {
            'User-Agent': 'silaben/1.0 (https://silaben.site)',
          },
        },
      );
      const data = await response.json();
      // console.log(data);
      if (data.length > 0) {
        updateLocation(parseFloat(data[0].lat), parseFloat(data[0].lon));
        const {lat, lon, display_name} = response.data[0];
        setLocation({
          ...location,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
        setLocationText(display_name);
      } else {
        Alert.alert('Location not found');
      }
    } catch (err) {
      console.error('ini error', err);
    }
  };

  const handleSubmit = () => {
    if (!location.locationName) {
      Alert.alert('Error', 'Location is required');
    } else {
      // Proceed with form submission
      console.log('Form submitted');
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
      <View style={styles.topImageContainer}>
        <ImageBackground
          source={require('../../assets/images/bencana-splash.jpg')}
          style={styles.topImage}
          imageStyle={styles.imageStyle}>
          <View style={styles.overlay} />
          {/* <View style={styles.header}>
          <Text style={styles.headerText}>SILABEN</Text>
        </View> */}
          <Text style={styles.headerText}>Buat Pelaporan</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeMasyarakat')}>
            <Image
              source={require('../../../src/assets/images/home_white.png')}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View style={styles.curvedContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* <View>
            <LinearGradient
              colors={['#0D85FE', '#003366']}
              style={styles.header}>
              <Text style={styles.headerText}>Buat Pelaporan</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('HomeRelawan', {jsonData: jsonData})
                }>
                <Image
                  source={require('../../../src/assets/images/home_white.png')}
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
            </LinearGradient>
          </View> */}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Judul Laporan"
              placeholderTextColor="#707070"
              value={report_title}
              onChangeText={text => setReportTitle(text)}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={lapor_instansi}
                onValueChange={itemValue => setLaporInstansi(itemValue)}
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
                  label="BPBD"
                  value="BPBD"
                />
                <Picker.Item
                  style={styles.inputText}
                  label="Pemadam Kebakaran"
                  value="Pemadam Kebakaran"
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
              <Text
                style={styles.inputText}
                value={date}
                onChangeText={text => setDate(text)}>
                {date ? date : 'Tanggal Kejadian Bencana'}
              </Text>
              <Image
                source={require('../../../src/assets/images/calendar.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={showTimePicker} style={styles.dateInput}>
              <Text
                style={styles.inputText}
                value={time}
                onChangeText={text => setTime(text)}>
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
            {/* <TextInput
              style={styles.input}
              placeholder="Cari Lokasi"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#707070"
            /> */}
            <TextInput
              value={location.locationName}
              onChangeText={text =>
                setLocation({...location, locationName: text})
              }
              placeholder="Cari Lokasi"
              style={{borderWidth: 1, padding: 8, margin: 10}}
            />
            <Button
              title="Search"
              onPress={() => handleSearch(location.locationName)}
              style={{marginBottom: 50}}
            />
            {/* <Button title="Submit" onPress={handleSubmit} />
            {errorMsg && <Text>{errorMsg}</Text>} */}
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
                }}
                urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap tiles URL
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors">
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
            {/* <View style={{flex: 1}}>
              <MapView
                style={{flex: 1}}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={e =>
                  updateLocation(
                    e.nativeEvent.coordinate.latitude,
                    e.nativeEvent.coordinate.longitude,
                  )
                }>
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  draggable
                  onDragEnd={e =>
                    updateLocation(
                      e.nativeEvent.coordinate.latitude,
                      e.nativeEvent.coordinate.longitude,
                    )
                  }
                />
                <Circle
                  center={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  radius={300}
                  strokeColor="red"
                  fillColor="rgba(255, 0, 0, 0.3)"
                />
              </MapView>

              <TextInput
                value={location.locationName}
                onChangeText={text =>
                  setLocation({...location, locationName: text})
                }
                placeholder="Search Location"
                style={{borderWidth: 1, padding: 8, margin: 10}}
              />
              <Button
                title="Search"
                onPress={() => handleSearch(location.locationName)}
              />

              <Button title="Submit" onPress={handleSubmit} />
              {errorMsg && <Text>{errorMsg}</Text>}
            </View> */}
            <View style={styles.locationTextContainer}>
              <Text
                style={styles.locationText}
                value={input_lokasi_bencana}
                onChangeText={text => setLocationText(text)}>
                {location.name}
              </Text>
            </View>
            <View style={styles.locationInputContainer}>
              <View style={styles.inputLanLong}>
                <Text style={styles.label}>Latitude:</Text>
                <TextInput
                  style={styles.input}
                  value={location.latitude.toString()}
                  onChangeText={text =>
                    setLocation({...location, latitude: parseFloat(text)})
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputLanLong}>
                <Text style={styles.label}>Longitude:</Text>
                <TextInput
                  style={styles.input}
                  value={location.longitude.toString()}
                  onChangeText={text =>
                    setLocation({...location, longitude: parseFloat(text)})
                  }
                  keyboardType="numeric"
                />
              </View>
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
                  source={{uri: selectedImage.uri}}
                  style={styles.imagePreview}
                />
              )}
            </TouchableOpacity>
            {fileName ? (
              <Text style={styles.label}>Nama File: {fileName}</Text>
            ) : null}
            {/* <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setAnonim('Anonim')}>
                <View
                  style={
                    anonim === 'Anonim'
                      ? styles.radioSelected
                      : styles.radioUnselected
                  }
                />
                <Text style={styles.radioText}>Anonim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setAnonim('Tidak Anonim')}>
                <View
                  style={
                    anonim === 'Tidak Anonim'
                      ? styles.radioSelected
                      : styles.radioUnselected
                  }
                />
                <Text style={styles.radioText}>Tidak Anonim</Text>
              </TouchableOpacity>
            </View> */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreatePelaporan}>
              <LinearGradient
                colors={['#0D85FE', '#0000FF']}
                style={styles.buttonBackground}
                onPress={handleCreatePelaporan}>
                <Text style={styles.buttonText}>Laporkan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <NavbarRelawan navigation={navigation} />
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
    backgroundColor: '#003366',
    padding: 30,
    alignItems: 'center',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    padding: 35,
  },
  curvedContainer: {
    backgroundColor: 'white',
    marginTop: -20, // Adjust to overlap with the top image
    borderTopLeftRadius: 30, // Apply a curve to the top-left corner
    borderTopRightRadius: 30, // Apply a curve to the top-right corner
    padding: 20,
  },
  topImage: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0066CC',
    opacity: 0.5, // Adjust the opacity as needed
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginTop: 35,
    marginRight: 35,
  },
  inputContainer: {
    overflow: 'hidden', // Ensures content doesn't exceed rounded corners
    backgroundColor: '#fff', // Background color of the report section
    padding: 10,
    // eslint-disable-next-line no-dupe-keys
    overflow: 'hidden',
    marginBottom: 200,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginBottom: 15,
    color: '#707070',
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
    justifyContent: 'space-between',
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
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 15,
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
    color: '#707070',
  },
  locationInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  label: {
    color: '#707070',
  },
});

export default Pelaporan;
