import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Callout} from 'react-native-maps';

const MapScreenRelawan = ({navigation}) => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

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
          image: require('../../../src/assets/images/image_report.png'), // Update as needed
          tag: getTagImage(item.jenis_bencana),
        }));

        setMarkers(fetchedMarkers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMarkers();
  }, []);

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
                  {marker.description}
                </Text>
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
        </View>
      )}

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('HomeRelawan')}>
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

export default MapScreenRelawan;
