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
import Navbar from '../../components/Navbar';

const CashonDigital = ({navigation}) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch('https://silaben.site/app/public/home/datalaporanmobile')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log untuk memeriksa data yang diterima
        setReports(data);
      })
      .catch(error => console.error(error));
  }, []);

  const getFullImageUrl = filename => {
    return `https://silaben.site/app/public/fotobukti/${filename}`;
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
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeMasyarakat')}>
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
            {reports.map((report, index) => (
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
      <Navbar style={styles.navbar} />

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
