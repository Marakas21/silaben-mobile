import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';

const CashonDigital = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View>
        <LinearGradient colors={['#0066CC', '#003366']} style={styles.header}>
          <Text style={styles.headerText}>History Pelaporan</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeMasyarakat')}>
            <Image
              source={require('../../../src/assets/images/home_white.png')}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <View style={styles.reportCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.reportTitle}>Pohon Tumbang</Text>
          <Text style={styles.status}>Sementara</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.location}>Airmadidi</Text>
          <Text style={styles.date}>6/8/2024</Text>
        </View>
        <Image
          source={require('../../../src/assets/images/image_report.png')} // Add your report image here
          style={styles.reportImage}
        />
      </View>
      <Navbar />
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
  profileContainer: {
    flexDirection: 'row',
    marginRight: 180,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  profileTitle: {
    fontSize: 18,
    color: 'white',
  },
  navigationTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
  },
  activeTab: {
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  inactiveTab: {
    fontSize: 16,
    color: 'grey',
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
  },
  status: {
    fontSize: 14,
    color: 'red',
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
  date: {
    fontSize: 14,
    color: 'grey',
  },
  reportImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 180,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    marginTop: 50,
  },

  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f58220',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  addIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    marginTop: 270,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});
