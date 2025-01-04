import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Switch, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import FirebaseService from '../services/FirebaseService';

const ControlScreen = () => {
  const [deviceControls, setDeviceControls] = useState({
    pompa: { 
      status: false, 
      mode: 'manual' 
    },
    lampuGanjil: { 
      status: false, 
      mode: 'manual' 
    },
    lampuGenap: { 
      status: false, 
      mode: 'manual' 
    }
  });

  useEffect(() => {
    const controlsListener = FirebaseService.listenDeviceStatus('/device/controls', (data) => {
      console.log('Received controls data:', data);
      
      // Pastikan data tidak undefined dan memiliki struktur yang benar
      setDeviceControls(prevState => ({
        pompa: data?.pompa || prevState.pompa || { status: false, mode: 'manual' },
        lampuGanjil: data?.lampuGanjil || prevState.lampuGanjil || { status: false, mode: 'manual' },
        lampuGenap: data?.lampuGenap || prevState.lampuGenap || { status: false, mode: 'manual' }
      }));
    });

    return () => controlsListener.off();
  }, []);

  const toggleDeviceStatus = (device) => {
    try {
      // Pastikan deviceControls[device] ada
      if (!deviceControls[device]) {
        console.error(`Device ${device} not found in controls`);
        return;
      }

      const newStatus = !deviceControls[device].status;
      
      FirebaseService.updateDeviceStatus(`/device/controls/${device}`, {
        status: newStatus,
        mode: deviceControls[device].mode || 'manual'
      });
      
      // Sinkronkan dengan path status utama jika dalam mode manual
      if (deviceControls[device].mode === 'manual') {
        FirebaseService.updateDeviceStatus(`/device/status/${device}`, newStatus);
      }
    } catch (error) {
      console.error(`Error toggling ${device} status:`, error);
      Alert.alert('Error', `Gagal mengubah status ${device}`);
    }
  };

  const toggleDeviceMode = (device) => {
    try {
      // Pastikan deviceControls[device] ada
      if (!deviceControls[device]) {
        console.error(`Device ${device} not found in controls`);
        return;
      }

      const newMode = deviceControls[device].mode === 'manual' ? 'otomatis' : 'manual';
      
      FirebaseService.updateDeviceStatus(`/device/controls/${device}`, {
        status: deviceControls[device].status,
        mode: newMode
      });
    } catch (error) {
      console.error(`Error toggling ${device} mode:`, error);
      Alert.alert('Error', `Gagal mengubah mode ${device}`);
    }
  };

  const renderDeviceControl = (device, label, isGanjil) => {
    // Tambahkan pengecekan tambahan
    const deviceData = deviceControls[device] || { 
      status: false, 
      mode: 'manual' 
    };
    
    return (
      <View style={[
        styles.deviceContainer, 
        isGanjil ? styles.ganjilContainer : styles.genapContainer
      ]}>
        <View style={styles.deviceHeader}>
          <Text style={[
            styles.deviceLabel, 
            isGanjil ? styles.ganjilLabel : styles.genapLabel
          ]}>
            {label}
          </Text>
          <Text style={styles.modeText}>
            Mode: {deviceData.mode === 'manual' ? 'Manual' : 'Otomatis'}
          </Text>
        </View>
        
        <View style={styles.controlRow}>
          <Text>Status</Text>
          <Switch 
            value={deviceData.status}
            onValueChange={() => toggleDeviceStatus(device)}
            disabled={deviceData.mode === 'otomatis'}
            trackColor={{ 
              false: isGanjil ? '#ff6b6b' : '#4ecdc4', 
              true: isGanjil ? '#ff6b6b' : '#4ecdc4' 
            }}
            thumbColor={deviceData.status ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.controlRow}>
          <Text>Ubah Mode</Text>
          <TouchableOpacity 
            style={[
              styles.modeButton, 
              isGanjil ? styles.ganjilMode : styles.genapMode,
              deviceData.mode === 'manual' ? styles.manualModeStyle : styles.otomatisModeStyle
            ]}
            onPress={() => toggleDeviceMode(device)}
          >
            <Text style={styles.modeButtonText}>
              {deviceData.mode === 'manual' ? 'Manual' : 'Otomatis'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderDeviceControl('pompa', 'Pompa Air', true)}
      {renderDeviceControl('lampuGanjil', 'Lampu Ganjil', true)}
      {renderDeviceControl('lampuGenap', 'Lampu Genap', false)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  deviceContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  ganjilContainer: {
    backgroundColor: '#ff6b6b1a', // Warna merah muda transparan
  },
  genapContainer: {
    backgroundColor: '#4ecdc41a', // Warna hijau muda transparan
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  deviceLabel: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  ganjilLabel: {
    color: '#ff6b6b'
  },
  genapLabel: {
    color: '#4ecdc4'
  },
  modeText: {
    fontSize: 14,
    color: '#666'
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center'
  },
  ganjilMode: {
    backgroundColor: '#ff6b6b'
  },
  genapMode: {
    backgroundColor: '#4ecdc4'
  },
  manualModeStyle: {
    opacity: 0.7
  },
  otomatisModeStyle: {
    opacity: 1
  },
  modeButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default ControlScreen;
