import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../components/Navbar';
import {useFocusEffect} from '@react-navigation/native';
import 'whatwg-fetch';

const ChangePasswordScreen = ({navigation, route}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');
  const [userToken, setUserToken] = useState('');
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
  // console.log('Ini data to use profile:', dataToUse);

  const handleChangePass = async () => {
    const updatedProfile = {
      user_id: dataToUse.user_id,
      old_password: currentPassword,
      new_password: newPassword,
      confirm_password: retypeNewPassword,
    };

    console.log(updatedProfile);

    try {
      const response = await fetch(
        'https://silaben.site/app/public/login/changePassword',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProfile),
        },
      );

      const result = await response.json();
      console.log('Response:', result);

      if (result.success) {
        Alert.alert(
          'Success',
          result.message || 'Password updated successfully',
        );
        navigation.goBack();
      } else {
        Alert.alert('Error', result.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error Message', error.message);
    }
  };

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
      <Text style={styles.username}>{dataToUse.user_name}</Text>
      <Text style={styles.title}>Change Password</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Current Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter current password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <Text style={styles.inputLabel}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.inputLabel}>Retype New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Retype new password"
          secureTextEntry
          value={retypeNewPassword}
          onChangeText={setRetypeNewPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleChangePass}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('HomeMasyarakat')}>
        <Text style={styles.homeButtonText}>Home</Text>
      </TouchableOpacity>
      <Navbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
    // marginTop: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40,
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: 'white',
    color: 'black',
  },
  button: {
    backgroundColor: '#FF5733',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
