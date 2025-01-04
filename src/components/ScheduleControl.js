import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateDeviceStatus } from '../services/FirebaseService';

const ScheduleControl = () => {
  const [schedules, setSchedules] = useState({
    pompa: {
      mulai: new Date(),
      selesai: new Date(),
      aktif: false
    },
    lampuGanjil: {
      mulai: new Date(),
      selesai: new Date(),
      aktif: false
    },
    lampuGenap: {
      mulai: new Date(),
      selesai: new Date(),
      aktif: false
    }
  });

  const [activeDevice, setActiveDevice] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState({
    mulai: false,
    selesai: false
  });

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const updateSchedule = (device) => {
    updateDeviceStatus(`/device/jadwal/${device}`, {
      mulai: formatTime(schedules[device].mulai),
      selesai: formatTime(schedules[device].selesai),
      aktif: schedules[device].aktif
    });
  };

  const toggleScheduleActive = (device) => {
    const newSchedules = {...schedules};
    newSchedules[device].aktif = !newSchedules[device].aktif;
    setSchedules(newSchedules);
    updateSchedule(device);
  };

  const openTimePicker = (device, timeType) => {
    setActiveDevice(device);
    setShowTimePicker({
      mulai: timeType === 'mulai',
      selesai: timeType === 'selesai'
    });
  };

  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate && activeDevice) {
      const newSchedules = {...schedules};
      if (showTimePicker.mulai) {
        newSchedules[activeDevice].mulai = selectedDate;
      } else if (showTimePicker.selesai) {
        newSchedules[activeDevice].selesai = selectedDate;
      }
      setSchedules(newSchedules);
      setShowTimePicker({ mulai: false, selesai: false });
      updateSchedule(activeDevice);
    }
  };

  const renderScheduleSection = (device, label, color) => {
    const deviceSchedule = schedules[device];
    
    return (
      <View style={[styles.scheduleContainer, { borderColor: color }]}>
        <View style={styles.headerContainer}>
          <Text style={[styles.deviceTitle, { color }]}>{label}</Text>
          <TouchableOpacity 
            style={[
              styles.activeToggle, 
              { backgroundColor: deviceSchedule.aktif ? color : '#ccc' }
            ]}
            onPress={() => toggleScheduleActive(device)}
          >
            <Text style={styles.activeToggleText}>
              {deviceSchedule.aktif ? 'Aktif' : 'Non-Aktif'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeRowContainer}>
          <Text>Mulai:</Text>
          <TouchableOpacity 
            style={styles.timeButton}
            onPress={() => openTimePicker(device, 'mulai')}
          >
            <Text>{formatTime(deviceSchedule.mulai)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeRowContainer}>
          <Text>Selesai:</Text>
          <TouchableOpacity 
            style={styles.timeButton}
            onPress={() => openTimePicker(device, 'selesai')}
          >
            <Text>{formatTime(deviceSchedule.selesai)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Pengaturan Jadwal</Text>
      
      {renderScheduleSection('pompa', 'Pompa Air', '#ff6b6b')}
      {renderScheduleSection('lampuGanjil', 'Lampu Ganjil', '#ff6b6b')}
      {renderScheduleSection('lampuGenap', 'Lampu Genap', '#4ecdc4')}

      {(Platform.OS === 'android' && (showTimePicker.mulai || showTimePicker.selesai)) && (
        <DateTimePicker
          value={activeDevice ? schedules[activeDevice][showTimePicker.mulai ? 'mulai' : 'selesai'] : new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {Platform.OS === 'ios' && (showTimePicker.mulai || showTimePicker.selesai) && (
        <Modal 
          transparent={true} 
          visible={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={activeDevice ? schedules[activeDevice][showTimePicker.mulai ? 'mulai' : 'selesai'] : new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={handleTimeChange}
              />
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowTimePicker({ mulai: false, selesai: false })}
              >
                <Text style={styles.modalCloseButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  scheduleContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  deviceTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  activeToggle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  activeToggleText: {
    color: 'white',
    fontWeight: 'bold'
  },
  timeRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5
  },
  timeButton: {
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    paddingBottom: 20
  },
  modalCloseButton: {
    backgroundColor: '#007bff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default ScheduleControl;
