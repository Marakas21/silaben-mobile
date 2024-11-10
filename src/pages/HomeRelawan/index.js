import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NavbarRelawan from '../../components/NavbarRelawan';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

const HomeMasyarakat = ({navigation, route}) => {
  const [distance, setDistance] = useState(null);
  // Mengambil data dari parameter atau default menjadi objek kosong
  const {jsonData = {}} = route.params || {};
  console.log('Ini json data:', jsonData);

  // Simpan data ke AsyncStorage saat pertama kali menerima
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@jsonData', JSON.stringify(jsonData));
      } catch (e) {
        console.error('Error saving data', e);
      }
    };

    if (Object.keys(jsonData).length > 0) {
      saveData();
    }
  }, [jsonData]);

  // Baca data dari AsyncStorage
  const [storedData, setStoredData] = useState(null);

  useEffect(() => {
    const readData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@jsonData');
        setStoredData(jsonValue != null ? JSON.parse(jsonValue) : {});
      } catch (e) {
        console.error('Error reading data', e);
      }
    };

    readData();
  }, []);

  const dataToUse = storedData || jsonData;
  console.log('Ini data to use:', dataToUse);

  const handleButtonPress = () => {
    Alert.alert(
      'Confirm Dialog',
      'Are you sure want to exit?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            console.log('Keluar Dilanjutkan dari HomeScreen.');
            navigation.navigate('SignIn');
          },
        },
      ],
      {cancelable: false},
    );
  };

  const [data, setData] = useState({
    tanggal: '',
    jam: '',
    magnitudo: '',
    kedalaman: '',
    lintang: '',
    bujur: '',
    lokasi: '',
    dirasakan: '',
    shakemap: '',
  });

  useEffect(() => {
    fetch('https://silaben.site/app/public/home/getDataGempaMobile')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log untuk memeriksa data yang diterima
        setData(data);
      })
      .catch(error => console.error(error));
  }, []);

  const TRACK_RADIUS = 13; // in kilometers

  function TrackUserLocation() {
    const [userLat, setUserLat] = useState(null);
    const [userLng, setUserLng] = useState(null);
    const [lastTimestamp, setLastTimestamp] = useState(null);

    useEffect(() => {
      // Get user's current position
      Geolocation.getCurrentPosition(
        position => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);

          // Fetch disaster data from Redis at intervals
          const intervalId = setInterval(() => {
            fetch(
              'https://silaben.site/app/public/home/getDisasterDataFromRedis',
            )
              .then(response => response.json())
              .then(data => {
                console.log('data redis:', data);
                if (
                  data.status === 'active' &&
                  data.timestamp !== lastTimestamp
                ) {
                  const disasterLat = data.latitude;
                  const disasterLng = data.longitude;
                  const message = data.message;

                  // Calculate distance
                  const distance = calculateDistance(
                    userLat,
                    userLng,
                    disasterLat,
                    disasterLng,
                  );
                  const distanceInKilometers = Math.floor(distance / 1000);
                  console.log('distance:', distanceInKilometers);

                  // If user is within the radius, send WhatsApp message
                  if (distanceInKilometers <= TRACK_RADIUS) {
                    sendMessage(message);
                  } else {
                    console.log("You're not in the radius");
                  }

                  // Update lastTimestamp after processing
                  setLastTimestamp(data.timestamp);
                }
              })
              .catch(error => {
                console.error('Error fetching disaster data:', error);
              });
          }, 60000); // Check every minute

          // Cleanup on component unmount
          return () => clearInterval(intervalId);
        },
        error => {
          console.error('Error getting location:', error);
          Alert.alert('Location Error', 'Could not retrieve your location.');
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    }, [lastTimestamp, userLat, userLng]); // Only run once when the component mounts

    return null; // or return a JSX component
  }

  async function sendMessage(message) {
    const target = dataToUse.whatsapp_number;
    console.log(target);
    const url = 'https://api.fonnte.com/send';
    const payload = new URLSearchParams({
      target: target,
      message: message,
      countryCode: '62', // Optional
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'GRnm9ah7XakS8sJnXhKQ', // Replace with your actual token
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.text(); // Change to `.json()` if response is JSON
      console.log(result);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  // Function to calculate distance between two coordinates using Haversine formula (jarak dalam satuan KM)
  const calculateDistance = useCallback((lat1, lon1) => {
    const lat2 = 1.4176958556026646; // koordinat latitude Universitas Klabat
    const lon2 = 124.98398510245137; // koordinat longitude Universitas Klabat
    const R = 6371; // radius of the earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000;
    setDistance(distance.toFixed(2)); // set the state of distance
  }, []);

  const toRad = value => {
    return (value * Math.PI) / 180;
  };

  TrackUserLocation();

  return (
    <View style={styles.container}>
      <View>
        <LinearGradient colors={['#0066CC', '#003366']} style={styles.header}>
          <Text style={styles.headerText}>Sigap Lapor Bencana</Text>
        </LinearGradient>
      </View>
      <View style={styles.userContainer}>
        <View style={styles.user}>
          <Image
            source={require('../../assets/images/big_profile.png')}
            style={styles.userIcon}
          />
          <View>
            <Text style={styles.userName}>{dataToUse.nama_relawan}</Text>
            <Text style={styles.userStatus}>{dataToUse.email}</Text>
          </View>
        </View>
      </View>
      {/* Button Grid */}
      <ScrollView>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate('MapsRelawan')}>
            <Image
              source={require('../../../src/assets/images/maps.png')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridText}>Peta Bencana</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() =>
              navigation.navigate('HistoryPelaporanRelawan', {jsonData})
            }>
            <Image
              source={require('../../../src/assets/images/report_history.png')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridText}>History Pelaporan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate('PelaporanRelawan', {jsonData})}>
            <Image
              source={require('../../../src/assets/images/add_report.png')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridText}>Buat Pelaporan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate('ProfileRelawan', {jsonData})}>
            <Image
              source={require('../../assets/images/big_profile.png')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() =>
              navigation.navigate('ChangePassRelawan', {jsonData})
            }>
            <Image
              source={require('../../../src/assets/images/change_pass.png')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={handleButtonPress}>
            <Image
              source={require('../../../src/assets/images/logout.png')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={handleButtonPress}>
            <Image
              source={require('../../../src/assets/images/logout.png')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerMap}>
          <Text style={styles.title}>
            <Text style={{fontWeight: 'bold'}}>Data Gempa Terkini</Text>
          </Text>

          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `https://data.bmkg.go.id/DataMKG/TEWS/${data.shakemap}`,
              }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={[styles.infoContainer, {alignContent: 'center'}]}>
            <Text
              style={
                (styles.timeInfo, {textAlign: 'center'}, {color: 'black'})
              }>{`${data.tanggal}, ${data.jam} WIB`}</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>Magnitudo:</Text> {data.magnitudo}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>Kedalaman:</Text> {data.kedalaman}{' '}
                km
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>Lokasi:</Text> {data.lintang} -{' '}
                {data.bujur}
              </Text>
            </View>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                Pusat gempa berada di {data.lokasi}
              </Text>
              <Text style={styles.summaryText}>
                Dirasakan: {data.dirasakan}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <NavbarRelawan style={styles.navbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 40,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
    marginBottom: 20,
  },
  userContainer: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    margin: 20,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: -45,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 50,
    height: 50,
  },
  userName: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  userStatus: {
    fontSize: 14,
    color: '#003366',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  buttonIconMap: {
    width: '40%',
    margin: 10,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#FCF0D2',
  },
  buttonIconReportHistory: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#E9FFF3',
  },
  buttonIconProfile: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#E1EFFF',
  },
  buttonIconAddReport: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#FFE9EA',
  },
  buttonIconChangePass: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#D2FCF7',
  },
  buttonIconLogout: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#F1E8FF',
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  imageButton: {
    width: 45,
    height: 45,
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
    color: '#003366',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 12,
    marginTop: 5,
    color: '#003366',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
  },
  gridItem: {
    backgroundColor: '#fff',
    width: '29%',
    height: '30%',
    padding: 10,
    alignItems: 'center',
    marginVertical: 9,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    elevation: 3,
  },
  gridIcon: {
    width: 30,
    height: 30,
    // marginBottom: 8,
  },
  gridText: {
    fontSize: 9,
    textAlign: 'center',
    color: '#003366',
    fontWeight: 'bold',
  },
  containerMap: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
    borderRadius: 10, // rounded corners
    padding: 10,
    marginBottom: 100,
    width: 350,
    marginLeft: 30,
    alignContent: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden', // to apply rounded corners to Image
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // semi-transparent white for better readability
    borderRadius: 10,
    padding: 10,
    alignContent: 'center',
  },
  timeInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: 'black',
  },
  boldText: {
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 10,
  },
  summaryText: {
    fontSize: 14,
    color: 'black',
  },
  contentContainer: {
    flex: 1,
  },
});

export default HomeMasyarakat;
