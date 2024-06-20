import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const HomeMasyarakat = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View>
        <LinearGradient colors={['#0066CC', '#003366']} style={styles.header}>
          <Text style={styles.headerText}>Sigap Lapor Bencana</Text>
        </LinearGradient>
      </View>
      <View style={styles.userContainer}>
        <View style={styles.user}>
          <Image
            source={require('../../../src/assets/images/big_profile.png')}
            style={styles.userIcon}
          />
          <View>
            <Text style={styles.userName}>Bob Marley</Text>
            <Text style={styles.userStatus}>User</Text>
          </View>
        </View>
      </View>
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MapScreen')}>
          <Image
            source={require('../../../src/assets/images/map.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Peta Bencana</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../../src/assets/images/report_history.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>History Pelaporan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Pelaporan')}>
          <Image
            source={require('../../../src/assets/images/add_new_report.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Buat Pelaporan</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.buttonIconMap}
          onPress={() => navigation.navigate('MapScreen')}>
          <Image
            source={require('../../../src/assets/images/maps.png')}
            style={styles.imageButton}
          />
          <Text style={styles.menuItemText}>Peta Bencana</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonIconReportHistory}
          onPress={() => navigation.navigate('HistoryPelaporan')}>
          <Image
            source={require('../../../src/assets/images/report_history.png')}
            style={styles.imageButton}
          />
          <Text style={styles.menuItemText}>History Pelaporan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonIconReportHistory}
          onPress={() => navigation.navigate('HistoryPelaporan')}>
          <Image
            source={require('../../../src/assets/images/report_history.png')}
            style={styles.imageButton}
          />
          <Text style={styles.menuItemText}>History Relawan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonIconProfile}
          onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../../../src/assets/images/profile_pict2.png')}
            style={styles.imageButton}
          />
          <Text style={styles.menuItemText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonIconAddReport}
          onPress={() => navigation.navigate('Pelaporan')}>
          <Image
            source={require('../../../src/assets/images/add_report.png')}
            style={styles.imageButton}
          />
          <Text style={styles.menuItemText}>Buat Pelaporan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonIconChangePass}
          onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../../../src/assets/images/change_pass.png')}
            style={styles.imageButton}
          />
          <Text style={styles.menuItemText}>Ubah Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonIconLogout}
          onPress={() => navigation.navigate('SignIn')}>
          <Image
            source={require('../../../src/assets/images/logout.png')}
            style={styles.imageButton}
          />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('MapScreen')}>
          <Image
            source={require('../../../src/assets/images/maps2.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Pelaporan')}>
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 40,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
    marginBottom: 20,
  },
  userContainer: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    margin: 20,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: -45,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 40,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 50,
    height: 50,
  },
  userName: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  userStatus: {
    fontSize: 14,
    color: '#003366',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  buttonIconMap: {
    width: '40%',
    margin: 10,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#FCF0D2',
  },
  buttonIconReportHistory: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#E9FFF3',
  },
  buttonIconProfile: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#E1EFFF',
  },
  buttonIconAddReport: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#FFE9EA',
  },
  buttonIconChangePass: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#D2FCF7',
  },
  buttonIconLogout: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#F1E8FF',
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  imageButton: {
    width: 45,
    height: 45,
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
    color: '#003366',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  menuItem: {
    width: '40%',
    margin: 10,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  menuItemText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    marginTop: 35,
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

export default HomeMasyarakat;
