import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NavbarRelawan from '../../components/NavbarRelawan';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import 'whatwg-fetch';

const DaftarKegiatan = ({navigation, route}) => {
  const [reports, setReports] = useState([]);
  const {jsonData = {}} = route.params || {};
  // console.log('Ini json data:', jsonData);

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
  // console.log('Ini data to use history:', dataToUse);

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

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://silaben.site/app/public/home/semuabencanamobile`,
      );
      const data = await response.json();
      //console.log('hasil fetch data', data);

      // Set data ke state reports
      if (data.message) {
        setReports(data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();

  // const fileName = reports.report_file_name_bukti;
  // console.log('ini report: ', reports);

  const getFullImageUrl = fileName => {
    return `https://silaben.site/app/public/fotobukti/${fileName}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <ImageBackground
          source={require('../../assets/images/bencana-splash.jpg')}
          style={styles.topImage}
          imageStyle={styles.imageStyle}>
          <View style={styles.overlay} />
          {/* <View style={styles.header}>
          <Text style={styles.headerText}>SILABEN</Text>
        </View> */}
          <Text style={styles.headerText}>History Pelaporan</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HomeRelawan')}>
            <Image
              source={require('../../../src/assets/images/home_white.png')}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>

      <View style={styles.curvedContainer}>
        <ScrollView>
          <View style={styles.reportContainer}>
            {Array.isArray(reports) && reports.length > 0 ? (
              reports.map((report, index) => (
                <View key={index} style={styles.reportCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.reportTitle}>
                      {report.jenis_bencana || 'No Title'}
                    </Text>
                    <Text style={styles.status}>
                      {report.status || 'unverified'}
                    </Text>
                  </View>
                  <Text style={styles.date}>
                    {report.report_date || 'No Date'}
                  </Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.location}>
                      {report.lokasi_bencana || 'No Location'}
                    </Text>
                  </View>
                  {report.report_file_name_bukti ? (
                    <Image
                      source={{
                        uri: getFullImageUrl(report.report_file_name_bukti),
                      }}
                      style={styles.reportImage}
                    />
                  ) : (
                    <Text>No Image Available</Text>
                  )}
                  <Text style={styles.description}>
                    {report.deskripsi_singkat_ai || 'No Description'}
                  </Text>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() =>
                      navigation.navigate('DetailDaftarKegiatanRelawan', {
                        laporanId: report.laporan_id, // Kirim laporan_id ke halaman detail
                        jsonData,
                      })
                    }>
                    <Text style={styles.completeButtonText}>Selengkapnya</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>Tidak ada laporan tersedia.</Text>
            )}
          </View>
        </ScrollView>
      </View>
      <NavbarRelawan style={styles.navbar} />
    </View>
  );
};

export default DaftarKegiatan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  buttonIcon: {
    width: 24,
    height: 24,
    marginTop: 35,
    marginRight: 35,
  },
  reportContainer: {
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    overflow: 'hidden', // Ensures content doesn't exceed rounded corners
    backgroundColor: '#fff', // Background color of the report section
    padding: 10,
    // eslint-disable-next-line no-dupe-keys
    overflow: 'hidden',
  },
  curvedContainer: {
    backgroundColor: 'white',
    marginTop: -20, // Adjust to overlap with the top image
    borderTopLeftRadius: 30, // Apply a curve to the top-left corner
    borderTopRightRadius: 30, // Apply a curve to the top-right corner
    padding: 20,
  },
  reportCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 4,
    width: 350,
    marginBottom: 30,
    bottom: 150,
    top: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: 'red',
  },
  date: {
    fontSize: 14,
    color: 'grey',
    marginTop: 5,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  location: {
    fontSize: 14,
    color: 'grey',
  },
  reportImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: 'black',
    marginTop: 10,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
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
  completeButton: {
    marginTop: 10,
    backgroundColor: '#0066CC',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
