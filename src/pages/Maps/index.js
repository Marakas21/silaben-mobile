/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useState,
  useEffect,
  useCallback,
  PermissionsAndroid,
  Linking,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const MapScreen = ({navigation}) => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);

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

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch(
          'https://silaben.site/app/public/home/datalaporanmobile',
        );
        const data = await response.json();
        console.log('Fetched data:', data); // Debugging log

        const fetchedMarkers = data.map(item => ({
          coordinate: {
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          },
          title: item.jenis_bencana,
          description: item.deskripsi_singkat_ai,
          location: item.lokasi,
          status: item.status,
          image: {uri: getFullImageUrl(item.report_file_name_bukti)}, // Update as needed
          tag: getTagImage(item.jenis_bencana),
        }));

        setMarkers(fetchedMarkers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMarkers();
  }, []);

  // Function to get permission for location
  const requestLocationPermission = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      return granted === 'granted';
    } catch (err) {
      return false;
    }
  }, []);

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

  // Function to check permissions and get Location
  const getLocation = useCallback(async () => {
    const res = await requestLocationPermission();
    console.log('res is:', res);
    if (res) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          setLocation(position);
          calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        error => {
          console.log(error.code, error.message);
          setLocation(null);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );

      // Watch for location changes
      Geolocation.watchPosition(
        position => {
          console.log(position);
          setLocation(position);
          calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        error => {
          console.log(error.code, error.message);
          setLocation(null);
        },
        {enableHighAccuracy: true, distanceFilter: 10},
      );
    }
  }, [requestLocationPermission, calculateDistance]);

  useEffect(() => {
    getLocation();
    console.log('Fungsi useEffect sudah dipanggil.');
  }, [getLocation]);

  return (
    <View style={styles.container}>
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="Get Location" onPress={getLocation} />
      </View>
      <Text>Latitude: {location ? location.coords.latitude : '?'}</Text>
      <Text>Longitude: {location ? location.coords.longitude : '?'}</Text>
      <Text>Jarak dengan Unklab: {distance ? distance : '?'} meter.</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 1.4153965,
          longitude: 124.9867153,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            onPress={() => setSelectedMarker(marker)}
            image={marker.tag}
            style={styles.tag}>
            <Callout>
              <View style={styles.callout}>
                <Image source={marker.image} style={styles.calloutImage} />
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutLocation}>{marker.location}</Text>
                <Text style={styles.calloutDescription}>
                  {marker.description}
                </Text>
                <Text style={styles.calloutStatus}>{marker.status}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {selectedMarker && (
        <View style={styles.markerDetails}>
          <Image source={selectedMarker.image} style={styles.markerImage} />
          <Text style={styles.markerTitle}>{selectedMarker.title}</Text>
          <Text style={styles.markerDescription}>
            {selectedMarker.description}
          </Text>
          <Text style={styles.markerDescription}>
            {selectedMarker.location}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('HomeMasyarakat')}>
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
  calloutImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
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
  calloutLocation: {
    fontSize: 14,
    marginTop: 4,
    color: '#707070',
  },
  calloutStatus: {
    fontSize: 14,
    marginTop: 4,
    color: 'red',
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
    padding: 10,
    borderRadius: 50,
    shadowColor: '#003366',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  homeIcon: {
    width: 30,
    height: 30,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default MapScreen;
