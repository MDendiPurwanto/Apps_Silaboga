// src/services/SensorService.js
import database from '@react-native-firebase/database';

export const simulateSensorData = () => {
  const suhu = Math.floor(Math.random() * 10) + 25; // 25-35
  const kelembaban = Math.floor(Math.random() * 20) + 50; // 50-70

  database()
    .ref('/device/sensor')
    .update({
      suhu,
      kelembaban,
      timestamp: new Date().toISOString()
    })
    .then(() => console.log('Data sensor diperbarui'))
    .catch((error) => console.error('Gagal memperbarui sensor', error));
};

// Panggil di HomeScreen atau buat tombol untuk simulasi
