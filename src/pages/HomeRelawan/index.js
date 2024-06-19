import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const App = () => {
  return (
    <View style={styles.container}>
      <View>
        <LinearGradient colors={['#0066CC', '#003366']} style={styles.header}>
          <Text style={styles.headerText}>Sigap Lapor Bencana</Text>
        </LinearGradient>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../../src/assets/images/maps.png')}
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
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../../src/assets/images/add_report.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Buat Pelaporan</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../../src/assets/images/report_history.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>History Relawan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../../src/assets/images/change_pass.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../../src/assets/images/logout.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../../src/assets/images/profile_pict.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Profile</Text>
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
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  buttonIcon: {
    width: 25,
    height: 25,
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
    color: '#003366',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
