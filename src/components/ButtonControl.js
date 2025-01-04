// src/components/ButtonControl.js
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { updateDeviceStatus } from '../services/FirebaseService';

const ButtonControl = ({ label, status, path, color = '#007bff' }) => {
  const toggleStatus = () => {
    console.log(`Toggling ${label}, Current status: ${status}`);
    updateDeviceStatus(path, !status)
      .then(() => console.log(`${label} status updated`))
      .catch((error) => console.error(`Error updating ${label} status:`, error));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <Switch 
        value={status}
        onValueChange={toggleStatus}
        trackColor={{ 
          false: `${color}50`, 
          true: `${color}80` 
        }}
        thumbColor={status ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ButtonControl;
