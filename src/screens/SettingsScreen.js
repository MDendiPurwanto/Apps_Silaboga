import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Switch
} from 'react-native';
import { listenDeviceStatus, updateDeviceStatus } from '../services/FirebaseService';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    notifikasi: false,
    batasKelembaban: 50,
    batasSuhu: {
      min: 25,
      max: 35
    },
    intervalPengukuran: 15 // menit
  });

  useEffect(() => {
    const settingsListener = listenDeviceStatus('/device/settings', (data) => {
      setSettings(data);
    });

    return () => settingsListener.off();
  }, []);

  const updateSettings = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    updateDeviceStatus('/device/settings', newSettings);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pengaturan Perangkat</Text>

      <View style={styles.settingSection}>
        <Text style={styles.sectionTitle}>Notifikasi</Text>
        <View style={styles.settingItem}>
          <Text>Aktifkan Notifikasi</Text>
          <Switch 
            value={settings.notifikasi}
            onValueChange={(value) => updateSettings('notifikasi', value)}
          />
        </View>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.sectionTitle}>Batas Sensor</Text>
        <View style={styles.settingItem}>
          <Text>Batas Kelembaban Minimum (%)</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            value={settings.batasKelembaban.toString()}
            onChangeText={(value) => updateSettings('batasKelembaban', Number(value))}
          />
        </View>
        <View style={styles.settingItem}>
          <Text>Suhu Minimum (°C)</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            value={settings.batasSuhu.min.toString()}
            onChangeText={(value) => 
              updateSettings('batasSuhu', {
                ...settings.batasSuhu, 
                min: Number(value)
              })
            }
          />
        </View>
        <View style={styles.settingItem}>
          <Text>Suhu Maksimum (°C)</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            value={settings.batasSuhu.max.toString()}
            onChangeText={(value) => 
              updateSettings('batasSuhu', {
                ...settings.batasSuhu, 
                max: Number(value)
              })
            }
          />
        </View>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.sectionTitle}>Interval Pengukuran</Text>
        <View style={styles.settingItem}>
          <Text>Interval Pengukuran Sensor (menit)</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            value={settings.intervalPengukuran.toString()}
            onChangeText={(value) => updateSettings('intervalPengukuran', Number(value))}
          />
        </View>
      </View>
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
  },
  settingSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  input: {
    width: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    textAlign: 'center'
  }
});

export default SettingsScreen;
