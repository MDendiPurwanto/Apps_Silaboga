export const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  export const validateSensorData = (data) => {
    return data.suhu >= 0 && data.suhu <= 50 &&
           data.kelembaban >= 0 && data.kelembaban <= 100;
  };
  