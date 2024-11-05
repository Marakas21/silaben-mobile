import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen = ({navigation, route}) => {
  const {data} = route.params;
  const [userName, setUserName] = useState(data.user_name || '');
  const [gender, setGender] = useState(data.gender || '');
  const [email, setEmail] = useState(data.email || '');
  const [whatsappNumber, setWhatsappNumber] = useState(
    data.whatsapp_number || '',
  );

  if (!data) {
    console.warn('Data not available');
    return null; // atau bisa juga memberikan feedback kepada user
  }

  const saveProfile = async () => {
    const updatedProfile = {
      user_id: data.user_id,
      user_name: userName,
      gender,
      email,
      role: data.role,
      whatsapp_number: whatsappNumber,
    };

    // console.log(updatedProfile);

    try {
      const response = await fetch(
        'https://silaben.site/app/public/login/updateUser',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProfile),
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Log the raw text response for debugging
      const text = await response.text();
      // console.log('Raw Response:', text);
      // // Extract the JSON part from the raw response
      // const jsonStartIndex = text.indexOf('{');
      // const result = JSON.parse(text.substring(jsonStartIndex));

      try {
        // const result = JSON.parse(text); // Manually parse JSON
        // // console.log('Parsed Response:', result);

        if (text) {
          Alert.alert('Success', 'Profile updated successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error', text.message || 'Failed to update profile');
        }
      } catch (jsonError) {
        console.error('JSON Parsing Error:', jsonError);
        Alert.alert('Error', 'Invalid response from server');
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
      <Text style={styles.username}>{userName}</Text>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Username</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
        />

        <Text style={styles.inputTitle}>Gender</Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
        />

        <Text style={styles.inputTitle}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.inputTitle}>Nomor Whatsapp</Text>
        <TextInput
          style={styles.input}
          value={whatsappNumber}
          onChangeText={setWhatsappNumber}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 35,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#003366',
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

export default EditProfileScreen;
