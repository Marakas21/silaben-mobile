import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Navbar from '../../components/Navbar';

const MapScreenRelawan = ({navigation}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const markers = [
    {
      coordinate: {latitude: 1.4153965, longitude: 124.9867153},
      title: 'Kebakaran',
      description: 'Sedang Terjadi',
      image: require('../../../src/assets/images/image_report.png'),
      tag: require('../../../src/assets/images/fire.png'),
    },
    {
      coordinate: {latitude: 1.4157411, longitude: 124.9829443},
      title: 'Pohon Tumbang',
      description: 'Sedang Terjadi',
      image: require('../../../src/assets/images/image_report.png'),
      tag: require('../../../src/assets/images/tree_fall.png'),
    },
    // Add more markers as needed
  ];

  const handleMarkerPress = marker => {
    setSelectedMarker(marker);
  };

  useEffect(() => {
    // You can add any fetching logic or data updates here
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
        {markers.map(marker => (
          <Marker
            key={marker.title}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onPress={() => handleMarkerPress(marker)}
            image={marker.tag}
            style={styles.tag}
          />
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
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#003366',
    padding: 30,
    alignItems: 'center',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  tag: {
    width: 20, // Adjust the width to make the tag larger
    height: 20, // Adjust the height to make the tag larger
  },
  map: {
    flex: 1,
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
  reportUser: {
    fontSize: 14,
    color: '#555555',
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
});

export default MapScreenRelawan;
