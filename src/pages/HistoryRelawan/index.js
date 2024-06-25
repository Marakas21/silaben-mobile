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
import Navbar from '../../components/Navbar';
import HistoryPelaporan from '../HistoryPelaporan';

const HistoryRelawan = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View>
        <LinearGradient colors={['#0066CC', '#003366']} style={styles.header}>
          <Text style={styles.headerText}>History Relawan</Text>
          <Image
            source={require('../../../src/assets/images/home_white.png')}
            style={styles.buttonIcon}
            onPress={() => navigation.navigate('HomeMasyarakat')}
          />
        </LinearGradient>
      </View>
      <View style={styles.reportCard}>
        <View style={styles.cardHeader}>
          <Image
            source={require('../../../src/assets/images/bob-marley.png')} // Add your profile image here
            style={styles.profileImage1}
          />
          <Text style={styles.reportTitle}>BPBD Minut</Text>
          <Text style={styles.status}>Airmadidi</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.location}>6/10/2024</Text>
        </View>
        <View>
          <Text style={styles.location1}>Banjir Airmadidi</Text>
          <Text style={styles.location2}>6/10/2024</Text>
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
  profileImage1: {
    width: 50,
    height: 50,
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
    marginRight: 120,
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
    padding: 2,
    marginLeft: 58,
    marginTop: -15,
  },
  location1: {
    fontSize: 20,
    color: 'black',
    padding: 2,
    marginLeft: 1,
    marginTop: 10,
  },
  location2: {
    fontSize: 14,
    color: 'black',
    padding: 2,
    marginLeft: 1,
    marginTop: 10,
  },
  date: {
    fontSize: 14,
    color: 'grey',
  },
  reportImage: {
    marginTop: 15,
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 75,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
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
});

export default HistoryRelawan;
