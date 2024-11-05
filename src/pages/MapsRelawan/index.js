import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
// import xml2js from 'xml2js';

const MapScreen = ({navigation, route}) => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const {jsonData = {}} = route.params || {};
  const [forecastData, setForecastData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherData, setWeatherData] = useState([]);

  // Fungsi untuk mengkalkulasi jarak antara dua koordinat geografis
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius Bumi dalam kilometer
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    const initializeLocation = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        getLocation();
      }
    };
    initializeLocation();
  }, [getLocation]);

  // Fungsi untuk meminta izin akses lokasi
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function requestLocationPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission to Access Location',
            message:
              'We need access to your location to show your position on the map.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // Assume iOS permissions are granted
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  // useEffect(() => {
  //   const fetchWeatherData = async () => {
  //     try {
  //       const response = await fetch(
  //         'https://api.bmkg.go.id/publik/prakiraan-cuaca?adm2=71.06',
  //       );
  //       const data = await response.json();
  //       console.log(data.cuaca);

  //       if (Array.isArray(data.data)) {
  //         setForecastData(data.data);

  //         // Determine the closest weather forecast to the current time
  //         const now = new Date();
  //         data.data.forEach(item => {
  //           const cuacaList = item.cuaca;

  //           const closestWeather = cuacaList.reduce((closest, weather) => {
  //             const weatherTime = new Date(weather.local_datetime);
  //             return Math.abs(weatherTime - now) <
  //               Math.abs(new Date(closest.local_datetime) - now)
  //               ? weather
  //               : closest;
  //           });

  //           setCurrentWeather(closestWeather);
  //         });
  //       } else {
  //         console.error('Data not in array format:', data.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data', error);
  //     }
  //   };

  //   fetchWeatherData();
  // }, []);
  // Fungsi untuk memulai tracking dan foreground service
  // async function startTracking() {
  //   const hasPermission = await requestLocationPermission();
  //   if (!hasPermission) return;

  //   ForegroundService.start({
  //     id: 1,
  //     title: 'Disaster Alert Tracking',
  //     message: 'Tracking your location in background.',
  //   });

  //   const radius = 13; // Radius dalam kilometer

  //   // Watch Position untuk update lokasi secara berkala
  //   Geolocation.watchPosition(
  //     async position => {
  //       const {latitude, longitude} = position.coords;

  //       try {
  //         // Ambil data bencana dari API
  //         const response = await fetch(
  //           'https://silaben.site/app/public/home/getDisasterDataFromRedis',
  //         );
  //         const data = await response.json();

  //         if (data.status === 'active') {
  //           const disasterLat = data.latitude;
  //           const disasterLng = data.longitude;
  //           const message = data.message;

  //           // Kalkulasi jarak pengguna dari lokasi bencana
  //           const distance = calculateDistance(
  //             latitude,
  //             longitude,
  //             disasterLat,
  //             disasterLng,
  //           );

  //           // Jika jarak dalam radius, kirim notifikasi WhatsApp
  //           if (distance <= radius) {
  //             Alert.alert('Peringatan!', message);
  //             sendMessage(message);
  //           }
  //         }
  //       } catch (error) {
  //         console.error('Error fetching disaster data:', error);
  //       }
  //     },
  //     error => {
  //       console.error('Error watching position:', error);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       distanceFilter: 50, // Update lokasi setiap kali jarak berubah sejauh 50 meter
  //     },
  //   );
  // }

  // useEffect(() => {
  //   startTracking();
  // }, []);

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
  // const [setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         'https://silaben.site/app/public/home/getDataGempaMobile',
  //       );

  //       console.log(response);

  //       setData({
  //         tanggal: response.Tanggal[0],
  //         jam: response.Jam[0],
  //         magnitudo: response.Magnitude[0],
  //         kedalaman: response.Kedalaman[0],
  //         lintang: response.Lintang[0],
  //         bujur: response.Bujur[0],
  //         lokasi: response.Wilayah[0],
  //         dirasakan: response.Dirasakan[0],
  //         shakemap: response.Shakemap[0],
  //       });
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Failed to fetch data:', error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [setLoading]);

  // if (loading) {
  //   return <ActivityIndicator size="large" color="#0000ff" />;
  // }

  useEffect(() => {
    fetch('https://silaben.site/app/public/home/getDataGempaMobile')
      .then(response => response.json())
      .then(data => {
        // console.log(data); // Log untuk memeriksa data yang diterima
        setData(data);
      })
      .catch(error => console.error(error));
  }, []);

  const getTagImage = jenisBencana => {
    switch (jenisBencana.toLowerCase()) {
      case 'gempa bumi':
        return require('../../../src/assets/images/gempa.png');
      case 'tsunami':
        return require('../../../src/assets/images/tsunami.png');
      case 'gunung meletus':
        return require('../../../src/assets/images/gunung_meletus.png');
      case 'banjir':
        return require('../../../src/assets/images/banjir.png');
      case 'angin topan':
        return require('../../../src/assets/images/angin_topan.png');
      case 'tanah longsor':
        return require('../../../src/assets/images/tanah_longsor.png');
      case 'pohon tumbang':
        return require('../../../src/assets/images/pohon_tumbang.png');
      case 'kebakaran hutan dan lahan':
        return require('../../../src/assets/images/kebakaran_hutan.png');
      case 'kecelakaan transportasi':
        return require('../../../src/assets/images/kecelakaan_transportasi.png');
      case 'wabah penyakit':
        return require('../../../src/assets/images/wabah_penyakit.png');
      case 'polusi':
        return require('../../../src/assets/images/polusi.png');
      case 'pencemaran lingkungan':
        return require('../../../src/assets/images/pencemaran_lingkungan.png');
      case 'kerusakan jalan':
        return require('../../../src/assets/images/kerusakan_jalan.png');
      case 'kemacetan':
        return require('../../../src/assets/images/kemacetan.png');
      case 'konflik sosial':
        return require('../../../src/assets/images/konflik_sosial.png');
      case 'pencurian':
        return require('../../../src/assets/images/pencurian.png');
      case 'kekerasan':
        return require('../../../src/assets/images/kekerasan.png');
      default:
        return require('../../../src/assets/images/default.png');
    }
  };

  const getFullImageUrl = filename => {
    return `https://silaben.site/app/public/fotobukti/${filename}`;
  };

  // const requestLocationPermission = useCallback(async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Geolocation Permission',
  //           message: 'Can we access your location?',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       return granted === PermissionsAndroid.RESULTS.GRANTED;
  //     }
  //     return true;
  //   } catch (err) {
  //     console.warn(err);
  //     return false;
  //   }
  // }, []);

  // const calculateDistance = useCallback((lat1, lon1) => {
  //   const lat2 = 1.4309050145865363;
  //   const lon2 = 124.96914782576363;
  //   const R = 6371;
  //   const dLat = toRad(lat2 - lat1);
  //   const dLon = toRad(lon2 - lon1);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(toRad(lat1)) *
  //       Math.cos(toRad(lat2)) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   const distance = R * c * 1000;
  //   setDistance(distance.toFixed(2));
  // }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const getLocation = useCallback(async () => {
    const res = await requestLocationPermission();
    if (res) {
      Geolocation.getCurrentPosition(
        position => {
          setLocation(position);
        },
        error => {
          console.log(error.code, error.message);
          setLocation(null);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );

      Geolocation.watchPosition(
        position => {
          setLocation(position);
        },
        error => {
          console.log(error.code, error.message);
          setLocation(null);
        },
        {enableHighAccuracy: true, distanceFilter: 10},
      );
    }
  }, [requestLocationPermission]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch(
          'https://silaben.site/app/public/home/datalaporanmobile',
        );
        const data = await response.json();
        // console.log('Fetched data:', data);

        const fetchedMarkers = data.map(item => ({
          coordinate: {
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          },
          title: item.jenis_bencana,
          description: item.deskripsi_singkat_ai,
          image: {uri: getFullImageUrl(item.report_file_name_bukti)},
          tag: getTagImage(item.jenis_bencana),
          lokasi: item.lokasi_bencana,
          level: item.level_kerusakan_infrastruktur,
          Status: item.status,
          date: item.report_date,
          time: item.report_time,
        }));

        setMarkers(fetchedMarkers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMarkers();
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          'https://api.bmkg.go.id/publik/prakiraan-cuaca?adm2=71.06',
        );
        const data = await response.json();

        if (Array.isArray(data.data)) {
          setWeatherData(data.data);
        } else {
          console.error('Data tidak dalam format array:', data.data);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  const renderWeatherMarkers = () => {
    return weatherData.map((item, index) => {
      const lokasi = item.lokasi;
      const cuacaList = item.cuaca;
      // console.log(cuacaList);

      // Ambil waktu sekarang
      const date = new Date();

      // Filter cuaca yang paling dekat dengan waktu saat ini
      const currentWeather = cuacaList.reduce((closest, weather) => {
        const weatherTime = new Date(weather.local_datetime);
        return Math.abs(weatherTime - date) <
          Math.abs(new Date(closest.local_datetime) - date)
          ? weather
          : closest;
      });

      if (currentWeather) {
        // Menyiapkan konten popup
        let forecast = `Prakiraan Cuaca Hari Ini\n`;

        cuacaList.forEach(weather => {
          const weatherTime = new Date(weather.local_datetime);
          const time = weatherTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          forecast += `${time}: ${weather[0].weather}, ${weather[0].t}°C, ${weather[0].tcc}% awan, ${weather[0].tp} mm curah hujan\n`;
        });

        const weatherIcon = currentWeather[0].image || 'default-icon.svg';
        // console.log(weatherIcon);

        return lokasi && lokasi.lat && lokasi.lon ? (
          <Marker
            key={index}
            coordinate={{latitude: lokasi.lat, longitude: lokasi.lon}}
            title={`Kecamatan ${lokasi.kecamatan}`}
            description={forecast}
            image={{uri: weatherIcon}} // Gunakan URL gambar cuaca
          />
        ) : null;
      } else {
        console.error('Cuaca untuk waktu saat ini tidak ditemukan');
        return null;
      }
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 1.4153965,
          longitude: 124.9867153,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {renderWeatherMarkers()}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            onPress={() => setSelectedMarker(marker)}
            image={marker.tag}
            style={styles.tag}>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutDescription}>
                  <Text style={{fontWeight: 'bold'}}>Deskripsi: </Text>{' '}
                  {marker.description}
                </Text>
                <Text style={styles.calloutDescription}>
                  <Text style={{fontWeight: 'bold'}}>Lokasi: </Text>
                  {marker.lokasi}
                </Text>
                <Text style={styles.calloutDescription}>
                  <Text style={{fontWeight: 'bold'}}>Level Kerusakan: </Text>
                  {marker.level}
                </Text>
                <Text style={styles.calloutDescription}>
                  <Text style={{fontWeight: 'bold'}}>Status: </Text>
                  {marker.Status}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {/* {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            onPress={() => setSelectedMarker(marker)}
            // image={data[0].image || 'default-icon.svg'}
            style={styles.tag}>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutDescription}>
                  <Text style={{fontWeight: 'bold'}}>Deskripsi: </Text>{' '}
                  {marker.description}
                </Text>
                <Text style={styles.calloutDescription}>
                  <Text style={{fontWeight: 'bold'}}>Lokasi: </Text>
                  {marker.lokasi}
                </Text>
                <Text style={styles.calloutDescription}>
                  <Text style={{fontWeight: 'bold'}}>Level Kerusakan: </Text>
                  {marker.level}
                </Text>
                <Text style={styles.calloutDescription}>
                  <Text style={{fontWeight: 'bold'}}>Status: </Text>
                  {marker.Status}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))} */}
        {/* Current Location Marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}>
            <Image
              source={{
                uri: 'https://silaben.site/app/public/a/assets/img/here.png',
              }}
              style={{width: 60, height: 60}} // Sesuaikan ukuran di sini
              resizeMode="contain" // Sesuaikan ukuran sesuai kebutuhan
            />
          </Marker>
        )}
      </MapView>

      {selectedMarker && (
        <View style={styles.markerDetails}>
          <Image source={selectedMarker.image} style={styles.markerImage} />
          <View style={styles.dateTimeRow}>
            <Text style={styles.markerTime}>{selectedMarker.date}</Text>
            <Text style={styles.markerDate}>{selectedMarker.time}</Text>
          </View>
          <Text style={styles.markerTitle}>{selectedMarker.title}</Text>
          <Text style={styles.markerDescription}>
            {selectedMarker.description}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() =>
          navigation.navigate('HomeMasyarakat', {jsonData: jsonData})
        }>
        <Image
          source={require('../../../src/assets/images/home.png')}
          style={styles.homeIcon}
        />
      </TouchableOpacity>

      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Maps')}>
          <Image
            source={require('../../../src/assets/images/maps2.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Home')}>
          <Image
            source={require('../../../src/assets/images/add_report2.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../../../src/assets/images/profile_pict3.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  map: {
    flex: 1,
  },
  tag: {
    width: 20,
    height: 20,
  },
  callout: {
    width: 150,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  calloutDescription: {
    fontSize: 12,
    color: 'black',
  },
  markerDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 63,
  },
  markerImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  markerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#000000',
  },
  markerDescription: {
    fontSize: 14,
    marginTop: 4,
    color: '#707070',
  },
  homeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  homeIcon: {
    width: 24,
    height: 24,
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
  },
  navButton: {
    padding: 10,
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  markerTime: {
    fontSize: 14,
    color: '#707070',
  },
  markerDate: {
    fontSize: 14,
    color: '#707070',
  },
});

export default MapScreen;
