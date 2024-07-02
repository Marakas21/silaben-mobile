import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
      <View>
        <LinearGradient
          colors={['#0066CC', '#003366']}
          style={styles.header}
          onPress={() => navigation.navigate('HomeMasyarakat')}>
          <Text style={styles.headerText}>History Pelaporan</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HomeRelawan')}>
            <Image
              source={require('../../../src/assets/images/home_white.png')}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <ScrollView>
        {reports.map((report, index) => (
          <View key={index} style={styles.reportCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.reportTitle}>
                {report.jenis_bencana || 'No Title'}
              </Text>
              <Text style={styles.status}>{report.status || 'unverified'}</Text>
            </View>
            <Text style={styles.date}>{report.report_date || 'No Date'}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.location}>
                {report.lokasi_bencana || 'No Location'}
              </Text>
            </View>
            {report.report_file_name_bukti ? (
              <Image
                source={{uri: getFullImageUrl(report.report_file_name_bukti)}}
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
      </ScrollView>
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
    marginBottom: 40,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
  reportCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
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
});
