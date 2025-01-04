import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SensorDisplay = ({ suhu, kelembaban }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sensorItem}>
        <Text>Suhu</Text>
        <Text style={styles.sensorValue}>{suhu}°C</Text>
      </View>
      <View style={styles.sensorItem}>
        <Text>Kelembaban</Text>
        <Text style={styles.sensorValue}>{kelembaban}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  sensorItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center'
  },
  sensorValue: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default SensorDisplay;
