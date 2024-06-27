import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../components/Navbar';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jsonData: null,
    };
  }

  async componentDidMount() {
    try {
      const savedData = await AsyncStorage.getItem('jsonData');
      if (savedData) {
        this.setState({jsonData: JSON.parse(savedData)});
      } else {
        const {jsonData} = this.props.route.params;
        await AsyncStorage.setItem('jsonData', JSON.stringify(jsonData));
        this.setState({jsonData});
      }
    } catch (error) {
      console.error('Failed to load jsonData from AsyncStorage:', error);
    }
  }

  renderContent() {
    const {jsonData} = this.state;
    if (!jsonData) {
      return null;
    }

    return (
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
        <Text style={styles.title}>{jsonData.user_name}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Role</Text>
          <TextInput
            style={styles.input}
            value={jsonData.role}
            editable={false}
          />
          <Text style={styles.inputTitle}>Gender</Text>
          <TextInput
            style={styles.input}
            value={jsonData.gender}
            editable={false}
          />
          <Text style={styles.inputTitle}>Email</Text>
          <TextInput
            style={styles.input}
            value={jsonData.email}
            editable={false}
          />
          <Text style={styles.inputTitle}>Nomor Whatsapp</Text>
          <TextInput
            style={styles.input}
            value={jsonData.whatsapp_number}
            editable={false}
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => this.props.navigation.navigate('HomeMasyarakat')}>
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
    backgroundColor: '#7F7F7F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginHorizontal: 19,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
