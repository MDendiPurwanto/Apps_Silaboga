import React from 'react';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    // Pastikan channel dibuat
    this.createNotificationChannel();
    
    // Konfigurasi push notification
    this.configurePushNotification();
  }

  createNotificationChannel() {
    // Hanya untuk Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: "iot_channel", // ID unik untuk channel
          channelName: "IoT Notifications", // Nama channel yang terlihat di pengaturan
          channelDescription: "Notifikasi untuk kontrol IoT", // Deskripsi channel
          playSound: true, 
          soundName: "default", 
          importance: 4, // IMPORTANCE_HIGH
          vibrate: true,
        },
        (created) => console.log(`Notification channel created: ${created}`)
      );
    }
  }

  configurePushNotification() {
    PushNotification.configure({
      // Dipanggil saat token dibuat
      onRegister: function (token) {
        console.log("Notification Token:", token);
      },

      // Dipanggil saat notifikasi diterima atau dibuka
      onNotification: function (notification) {
        console.log("Notification received:", notification);
        
        // Pastikan notifikasi ditampilkan di foreground
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // Tangani error registrasi
      onRegistrationError: function(err) {
        console.error("Notification Registration Error:", err.message, err);
      },

      // Pengaturan spesifik Android
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Konfigurasi tambahan
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',

      // Pastikan channel ID diatur
      channelId: "iot_channel",
    });
  }

  // Metode kirim notifikasi lokal
  sendLocalNotification(title, message, options = {}) {
    PushNotification.localNotification({
      channelId: "iot_channel", // Pastikan channel ID selalu ada
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      visibility: 'public', // Membuat notifikasi terlihat di layar terkunci
      ...options // Memungkinkan opsi tambahan
    });
  }

  // Metode untuk notifikasi berulang (opsional)
  sendRepeatedNotification(title, message, repeatTime) {
    PushNotification.localNotificationSchedule({
      channelId: "iot_channel",
      title: title,
      message: message,
      date: new Date(Date.now() + repeatTime), // Misalnya setiap 1 menit
      allowWhileIdle: true,
      repeatType: 'time', // 'time', 'minute', 'hour', dll
      repeatTime: repeatTime
    });
  }

  // Metode untuk membersihkan semua notifikasi
  clearAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Implementasi sebelumnya untuk cek kondisi sensor dan status perangkat
  checkSensorConditions(sensorData, settings) {
    const { suhu, kelembaban } = sensorData;
    const { batasSuhu, batasKelembaban, notifikasi } = settings;

    if (!notifikasi) return;

    let notificationMessage = '';

    if (suhu < batasSuhu.min) {
      notificationMessage += `Suhu terlalu rendah: ${suhu}°C. `;
    } else if (suhu > batasSuhu.max) {
      notificationMessage += `Suhu terlalu tinggi: ${suhu}°C. `;
    }

    if (kelembaban < batasKelembaban) {
      notificationMessage += `Kelembaban rendah: ${kelembaban}%. `;
    }

    if (notificationMessage) {
      this.sendLocalNotification(
        'Peringatan Kondisi Sensor', 
        notificationMessage
      );
    }
  }

  checkDeviceStatus(deviceStatus, previousStatus) {
    const devices = ['pompa', 'lampuGanjil', 'lampuGenap'];
    
    devices.forEach(device => {
      if (deviceStatus[device] !== previousStatus[device]) {
        this.sendLocalNotification(
          'Status Perangkat Berubah',
          `Status ${device} berubah menjadi ${deviceStatus[device] ? 'Aktif' : 'Non-Aktif'}`
        );
      }
    });
  }
}

export default new NotificationService();
