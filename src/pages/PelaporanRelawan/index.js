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

const Pelaporan = React.memo(
  ({
    navigation,
    defaultTitle = 'Default Title', // default parameter
    defaultDescription = 'Default Description', // default parameter
    ...props
  }) => {
    const [report_title, setReportTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState({latitude: 0, longitude: 0});
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
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [fileName, setFileName] = useState('');

    const mapRef = useRef(null);

    const handleCreatePelaporan = () => {
      // check if input fields are not empty or only spaces
      if (
        !report_title ||
        !description ||
        !selectedImage ||
        !location ||
        !date ||
        !time ||
        !lapor_instansi ||
        !locationText ||
        !anonim
      ) {
        Alert.alert(
          'Empty Input Field',
          'Check again, all fields cannot be empty or contain only spaces.',
        );
        return;
      }

      // Convert latitude and longitude to strings
      const latitudeString = location.latitude.toString();
      const longitudeString = location.longitude.toString();

      // create request body with input values
      const requestBody = {
        'report-title': report_title,
        'report-description': description,
        'input-long-location': longitudeString,
        'input-lat-location': latitudeString,
        'input-lokasi-bencana': locationText,
        'lapor-instansi': lapor_instansi,
        'report-date': date,
        'report-time': time,
        identity: anonim,
        'user-id': '12345',
        'user-role': 'user',
        'report-file': selectedImageFile.uri,
      };

      // const formData = new FormData();
      // Object.keys(requestBody).forEach(key => {
      //   formData.append(key, requestBody[key]);
      // });
      // formData.append('report-file', {
      //   uri: selectedImageFile.uri,
      //   type: selectedImageFile.type,
      //   name: selectedImageFile.fileName,
      // });

      console.log('Ini requestBody', requestBody);

      // Time out request data
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out.'));
        }, 5000); // 5000 (5 detik)
      });
      Promise.race([
        fetch('https://silaben.site/app/public/home/submitlaporanmobile', {
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
          if (textData.includes('LAPOR FAILED')) {
            console.log('Ini textData', textData);
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
          console.log('Ini textData', textData);
          console.log('Ini requestBody', requestBody);

          if (textData.includes('LAPOR SUCCESS')) {
            // message
            Alert.alert('Laporan anda berhasil dikirim.');

            // Set empty field
            setReportTitle('');
            setDescription('');
            setLocation({latitude: '0', longitude: '0'});
            setInputLongLocation('');
            setInputLatLocation('');
            setLocationText('');
            setDate('');
            setTime('');
            setLaporInstansi('');
            setReportFile('');
            setAnonim('');
          }
        })
        .catch(error => {
          //console.error(error);
          Alert.alert('Error Message', error.message);
          return;
        });
    };

    // useEffect(() => {
    //   requestLocationPermission();
    //   Geolocation.getCurrentPosition(
    //     position => {
    //       console.log(position);
    //     },
    //     error => {
    //       console.log(error.code, error.message);
    //     },
    //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    //   );
    // }, []);

    // const requestLocationPermission = async () => {
    //   if (Platform.OS === 'android') {
    //     try {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //         {
    //           title: 'Location Permission',
    //           message: 'This app needs access to your location.',
    //           buttonNeutral: 'Ask Me Later',
    //           buttonNegative: 'Cancel',
    //           buttonPositive: 'OK',
    //         },
    //       );
    //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         console.log('You can use the location');
    //       } else {
    //         console.log('Location permission denied');
    //       }
    //     } catch (err) {
    //       console.warn(err);
    //     }
    //   }
    // };

    const handleImagePicker = () => {
      const options = {
        storageOptions: {
          path: 'images',
        },
      };

      launchImageLibrary(options, response => {
        if (response.assets && response.assets.length > 0) {
          const selectedAsset = response.assets[0];
          setSelectedImage(selectedAsset.uri);
          // Ambil nama file dan ekstensi dari URI menggunakan split('/') dan split('.')
          const uriParts = selectedAsset.uri.split('/');
          const fileNameParts = uriParts[uriParts.length - 1].split('.');
          const imageFileName = fileNameParts[0];
          const imageFileExt = fileNameParts[fileNameParts.length - 1];
          setFileName(`${imageFileName}.${imageFileExt}`);
          console.log(
            'Selected file name:',
            `${imageFileName}.${imageFileExt}`,
          );
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
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });
      updateLocationText(latitude, longitude);
    };

    const handleMarkerDragEnd = async event => {
      const {latitude, longitude} = event.nativeEvent.coordinate;
      setLocation({
        ...location,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
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
            <LinearGradient
              colors={['#0D85FE', '#003366']}
              style={styles.header}>
              <Text style={styles.headerText}>Buat Pelaporan</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('HomeRelawan')}>
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
                    setLocation({...location, latitude: text})
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
                    setLocation({...location, longitude: text})
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
                  source={{uri: selectedImage}}
                  style={styles.imagePreview}
                />
              )}
            </TouchableOpacity>
            {fileName ? <Text>Nama File: {fileName}</Text> : null}
            <View style={styles.radioGroup}>
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
            </View>
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
        <Navbar navigation={navigation} />
      </SafeAreaView>
    );
  },
);

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
    alignItems: 'right',
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
});

export default Pelaporan;
