import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavbarRelawan from '../../components/NavbarRelawan';

const DetailLaporan = ({navigation, route}) => {
  const [laporan, setReports] = useState([]);
  //const {laporan} = route.params; // Data laporan dari navigasi
  const [isModalVisible, setModalVisible] = useState(false);
  const [alasan, setAlasan] = useState('');
  const {laporanId = {}} = route.params || {};
  const {jsonData = {}} = route.params || {};
  console.log('Ini json data detail:', jsonData);
  console.log('Ini laporanId detail:', laporanId);

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
  console.log('Ini data to use detail:', dataToUse);

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

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const fetchData = async () => {
    // if (!dataToUse.relawan_id) {
    //   console.error('relawan_id is missing');
    //   return;
    // }

    try {
      //const relawan_id = dataToUse.relawan_id;
      // Use fetch instead of axios
      const response = await fetch(
        `https://silaben.site/app/public/home/detailbencanamobile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({laporanId}),
        },
      );

      // Check if the response is ok (status 200-299)
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      fetchData();

      // Parse JSON response
      const data = await response.json();
      console.log('ini data', data);

      if (data.message) {
        setReports(data.message);
      } else {
        // console.error(data.message);
      }

      // Optionally handle the data
      // if (data.status === 'success') {
      //   setReports(data.data.datalaporan);
      // } else {
      //   console.error(data.message);
      // }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const sendRegistration = async () => {
    const data = {
      relawan_id: dataToUse.relawan_id, // Ganti dengan ID pengguna sebenarnya
      laporan_id: laporan.laporan_id,
      alasan: alasan,
    };

    try {
      const response = await fetch(
        'https://silaben.site/app/public/home/daftarRelawan',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      const result = await response.text();
      Alert.alert('Info', result);
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Gagal mengirim pendaftaran');
    }
  };

  return (
    <ScrollView style={styles.container}>
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
          <TouchableOpacity onPress={() => navigation.navigate('HomeRelawan')}>
            <Image
              source={require('../../../src/assets/images/home_white.png')}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>

      <View style={styles.curvedContainer}>
        <ScrollView>
          <View style={styles.detailContainer}>
            <Image
              source={{
                uri: `https://silaben.site/app/public/fotobukti/${laporan.report_file_name_bukti}`,
              }}
              style={styles.imagePreview}
            />

            <Text style={styles.detailText}>
              <Text style={styles.bold}>Deskripsi:</Text>{' '}
              {laporan.report_description}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Jumlah Relawan yang Dibutuhkan:</Text>{' '}
              {laporan.jumlah_relawan_dibutuhkan}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Jumlah Relawan yang Terdaftar:</Text>{' '}
              {laporan.jumlah_relawan_terdaftar}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Lokasi:</Text> {laporan.lokasi_bencana}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Tanggal:</Text>{' '}
              {`${laporan.report_date}, ${laporan.report_time}`}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Pelapor:</Text> {laporan.pelapor_name}
            </Text>

            {laporan.jumlah_relawan_dibutuhkan > 0 ? (
              <TouchableOpacity style={styles.button} onPress={openModal}>
                <Text style={styles.buttonText}>Jadi Relawan</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.button, styles.buttonDisabled]}>
                <Text style={styles.buttonText}>Relawan Penuh</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Daftar Aktivitas</Text>
            <Text style={styles.modalLabel}>
              Kenapa Anda tertarik untuk menjadi relawan pada aktivitas ini?
            </Text>
            <TextInput
              style={styles.textArea}
              placeholder="Tulis jawaban Anda..."
              multiline
              value={alasan}
              onChangeText={setAlasan}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={sendRegistration}>
                <Text style={styles.submitButtonText}>Kirim Pendaftaran</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <NavbarRelawan />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    backgroundColor: '#031846',
    padding: 20,
    alignItems: 'center',
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
  curvedContainer: {
    backgroundColor: 'white',
    marginTop: -20, // Adjust to overlap with the top image
    borderTopLeftRadius: 30, // Apply a curve to the top-left corner
    borderTopRightRadius: 30, // Apply a curve to the top-right corner
    padding: 20,
  },
  detailContainer: {
    // borderTopLeftRadius: 100,
    // borderTopRightRadius: 100,
    overflow: 'hidden', // Ensures content doesn't exceed rounded corners
    //backgroundColor: '#fff', // Background color of the report section
    padding: 10,
    // eslint-disable-next-line no-dupe-keys
    //overflow: 'hidden',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    //padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 6},
    elevation: 4,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 4,
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
  bold: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 12,
  },
  closeButtonText: {
    color: '#007bff',
  },
});

export default DetailLaporan;
