import database from '@react-native-firebase/database';

// Export objek dengan fungsi
const FirebaseService = {
  updateDeviceStatus: (path, value) => {
    console.log(`Updating path: ${path}, Value: ${value}`);
    return database().ref(path).set(value);
  },

  listenDeviceStatus: (path, callback) => {
    console.log(`Listening to path: ${path}`);
    const ref = database().ref(path);
    
    ref.on('value', (snapshot) => {
      console.log(`Data from ${path}:`, snapshot.val());
      callback(snapshot.val());
    }, (error) => {
      console.error(`Error listening to ${path}:`, error);
    });

    return ref;
  }
};

// Export default dan named export
export default FirebaseService;
export const { updateDeviceStatus, listenDeviceStatus } = FirebaseService;
