import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../components/Navbar';

class ProfileRelawanScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: null,
    };
  }

  componentDidMount() {
    // Mengambil jsonData dari AsyncStorage
    AsyncStorage.getItem('jsonData')
      .then(data => {
        if (data) {
          this.setState({jsonData: JSON.parse(data)});
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  renderContent() {
    const {jsonData} = this.state;
    if (!jsonData) {
      return (
        <SafeAreaView style={styles.container}>
          <Text>Loading...</Text>
        </SafeAreaView>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.container}>
          <LinearGradient colors={['#0066CC', '#003366']} style={styles.header}>
            <View style={styles.profileIconContainer}>
              <View style={styles.profileIcon}>
                <Image
                  source={require('../../../src/assets/images/profile_pict.png')}
                  style={styles.profileImage}
                />
              </View>
            </View>
          </LinearGradient>
          <Text style={styles.title}>{jsonData.nama_relawan}</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Alamat</Text>
            <TextInput
              style={styles.input}
              value={jsonData.alamat}
              editable={false}
            />
            <Text style={styles.inputTitle}>Bidang Keahlian</Text>
            <TextInput
              style={styles.input}
              value={jsonData.bidang_keahlian}
              editable={false}
            />
            <Text style={styles.inputTitle}>Email</Text>
            <TextInput
              style={styles.input}
              value={jsonData.email}
              editable={false}
            />
            <Text style={styles.inputTitle}>Jenis Kelamin</Text>
            <TextInput
              style={styles.input}
              value={jsonData.jenis_kelamin}
              editable={false}
            />
            <Text style={styles.inputTitle}>Ketersediaan</Text>
            <TextInput
              style={styles.input}
              value={jsonData.ketersediaan}
              editable={false}
            />
            <Text style={styles.inputTitle}>NIK</Text>
            <TextInput
              style={styles.input}
              value={jsonData.nik}
              editable={false}
            />
            <Text style={styles.inputTitle}>Nomor Whatsapp</Text>
            <TextInput
              style={styles.input}
              value={jsonData.no_whatsapp}
              editable={false}
            />
            <Text style={styles.inputTitle}>Tanggal Lahir</Text>
            <TextInput
              style={styles.input}
              value={jsonData.tanggal_lahir}
              editable={false}
            />
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => this.props.navigation.navigate('HomeRelawan')}>
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    );
  }

  render() {
    return this.renderContent();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  profileIconContainer: {
    position: 'absolute',
    top: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 50,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  inputTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#003366',
  },
  button: {
    width: '90%',
    height: 45,
    backgroundColor: '#FF5733',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 19,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    width: '90%',
    height: 45,
    backgroundColor: '#0066CC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 19,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileRelawanScreen;
