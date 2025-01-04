import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Platform, 
  PermissionsAndroid 
} from 'react-native';
import { listenDeviceStatus } from '../services/FirebaseService';
import NotificationService from '../services/NotificationService';
import ButtonControl from '../components/ButtonControl';
import SensorDisplay from '../components/SensorDisplay';
import ScheduleControl from '../components/ScheduleControl';

const HomeScreen = () => {
  const [deviceStatus, setDeviceStatus] = useState({
    pompa: false,
    lampuGanjil: false,
    lampuGenap: false
  });

  const [sensorData, setSensorData] = useState({
    suhu: 0,
    kelembaban: 0
  });

  const [settings, setSettings] = useState({
    batasSuhu: { min: 25, max: 35 },
    batasKelembaban: 50,
    notifikasi: true
  });

  // Simpan status sebelumnya untuk perbandingan
  const previousStatusRef = useRef(deviceStatus);
  const previousSensorDataRef = useRef(sensorData);

  // Fungsi minta izin notifikasi
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "Izin Notifikasi",
            message: "Aplikasi membutuhkan izin untuk mengirim notifikasi",
            buttonNeutral: "Tanya Nanti",
            buttonNegative: "Tolak",
            buttonPositive: "Izinkan"
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Izin notifikasi diberikan");
          // Kirim notifikasi selamat datang
          NotificationService.sendLocalNotification(
            'Selamat Datang', 
            'Aplikasi IoT Kebun siap digunakan'
          );
        } else {
          console.log("Izin notifikasi ditolak");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Fungsi cek perubahan signifikan
  const checkSignificantChanges = (current, previous) => {
    const suhuPerubahan = Math.abs(current.suhu - previous.suhu);
    const kelembabanPerubahan = Math.abs(current.kelembaban - previous.kelembaban);

    // Kirim notifikasi jika perubahan cukup signifikan
    if (suhuPerubahan > 2 || kelembabanPerubahan > 5) {
      NotificationService.sendLocalNotification(
        'Perubahan Kondisi Sensor',
        `Suhu berubah ${suhuPerubahan.toFixed(1)}°C, Kelembaban berubah ${kelembabanPerubahan.toFixed(1)}%`
      );
    }
  };

  useEffect(() => {
    // Minta izin notifikasi saat komponen dimuat
    requestNotificationPermission();

    try {
      // Listen status perangkat
      const statusRef = listenDeviceStatus('/device/status', (data) => {
        const newStatus = data || { 
          pompa: false, 
          lampuGanjil: false,
          lampuGenap: false 
        };
        
        // Cek perubahan status untuk notifikasi
        Object.keys(newStatus).forEach(device => {
          if (newStatus[device] !== previousStatusRef.current[device]) {
            NotificationService.sendLocalNotification(
              'Status Perangkat Berubah',
              `Status ${device} berubah menjadi ${newStatus[device] ? 'Aktif' : 'Non-Aktif'}`
            );
          }
        });

        // Update status dan referensi
        setDeviceStatus(newStatus);
        previousStatusRef.current = newStatus;
      });

      // Listen data sensor
      const sensorRef = listenDeviceStatus('/device/sensor', (data) => {
        const newSensorData = data || { suhu: 0, kelembaban: 0 };
        
        // Cek perubahan signifikan
        checkSignificantChanges(
          newSensorData, 
          previousSensorDataRef.current
        );

        // Cek kondisi di luar batas
        if (settings.notifikasi) {
          if (newSensorData.suhu < settings.batasSuhu.min) {
            NotificationService.sendLocalNotification(
              'Peringatan Suhu',
              `Suhu terlalu rendah: ${newSensorData.suhu}°C`
            );
          }

          if (newSensorData.suhu > settings.batasSuhu.max) {
            NotificationService.sendLocalNotification(
              'Peringatan Suhu',
              `Suhu terlalu tinggi: ${newSensorData.suhu}°C`
            );
          }

          if (newSensorData.kelembaban < settings.batasKelembaban) {
            NotificationService.sendLocalNotification(
              'Peringatan Kelembaban',
              `Kelembaban rendah: ${newSensorData.kelembaban}%`
            );
          }
        }

        setSensorData(newSensorData);
        previousSensorDataRef.current = newSensorData;
      });

      // Listen pengaturan
      const settingsRef = listenDeviceStatus('/device/settings', (data) => {
        if (data) {
          setSettings(data);
        }
      });

      return () => {
        statusRef.off();
        sensorRef.off();
        settingsRef.off();
      };
    } catch (error) {
      console.error('Error in useEffect:', error);
      Alert.alert('Error', 'Gagal menginisialisasi data');
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>IoT Kontrol Kebun</Text>
      
      <SensorDisplay 
        suhu={sensorData.suhu} 
        kelembaban={sensorData.kelembaban} 
      />

      <ButtonControl 
        label="Pompa Air" 
        status={deviceStatus.pompa}
        path="/device/status/pompa"
        color="#ff6b6b"
      />

      <ButtonControl 
        label="Lampu Ganjil" 
        status={deviceStatus.lampuGanjil}
        path="/device/status/lampuGanjil"
        color="#ff6b6b"
      />

      <ButtonControl 
        label="Lampu Genap" 
        status={deviceStatus.lampuGenap}
        path="/device/status/lampuGenap"
        color="#4ecdc4"
      />

      <ScheduleControl />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  }
});

export default HomeScreen;
