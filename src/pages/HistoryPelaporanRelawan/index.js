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

const CashonDigital = ({navigation, route}) => {
  const [reports, setReports] = useState([]);
  const {jsonData = {}} = route.params || {};

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

  // Save data to AsyncStorage
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

  const dataToUse = storedData || jsonData;
  console.log('Ini data to use profile:', dataToUse);

  // Fetch data from API
  const fetchData = async () => {
    if (!dataToUse.user_id) {
      console.error('user_id is missing');
      return;
    }

    try {
      const user_id = dataToUse.relawan_id;
      // Use fetch instead of axios
      const response = await fetch(
        `https://silaben.site/app/public/home/datalaporanmobile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({user_id}),
        },
      );

      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // fetchData();

      // Parse JSON response
      const data = await response.json();
      // console.log(data);

      if (data.status === 'success') {
        setReports(data.data);
      } else {
        // console.error(data.message);
      }

      // Optionally handle the data
      // if (data.status === 'success') {
      //   setReports(data.data.datalaporan);
      // } else {
      //   console.error(data.message);
      // }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();

  // Trigger fetching data if reports data is empty
  useEffect(() => {
    if (reports) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

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
      {/* <View>
        <LinearGradient
          colors={['#0066CC', '#003366']}
          style={styles.header}
          onPress={() => navigation.navigate('HomeMasyarakat')}>
          <Text style={styles.headerText}>History Pelaporan</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeMasyarakat')}>
            <Image
              source={require('../../../src/assets/images/home_white.png')}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View> */}
      <View style={styles.curvedContainer}>
        <ScrollView>
          <View style={styles.reportContainer}>
            {Array.isArray(reports) &&
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
                </View>
              ))}
          </View>
        </ScrollView>
      </View>
      <NavbarRelawan style={styles.navbar} />

      {/* <View style={styles.navbar}>
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
      </View> */}
    </View>
  );
};

export default CashonDigital;

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
});
