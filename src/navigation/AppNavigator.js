import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
// Import Screens
import HomeScreen from '../screens/HomeScreen';
import ControlScreen from '../screens/ControlScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'dashboard' : 'dashboard';
            } else if (route.name === 'Control') {
              iconName = focused ? 'settings-remote' : 'settings-remote';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings';
            }

            // Anda dapat menyesuaikan ukuran dan warna ikon
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007bff', // Warna ikon aktif
          tabBarInactiveTintColor: 'gray', // Warna ikon tidak aktif
          tabBarStyle: {
            backgroundColor: 'white', // Warna latar belakang tab
            borderTopWidth: 0.5,
            borderTopColor: '#d1d1d1'
          },
          headerShown: false // Sembunyikan header default
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Beranda',
            tabBarLabel: 'Beranda' 
          }} 
        />
        <Tab.Screen 
          name="Control" 
          component={ControlScreen} 
          options={{ 
            title: 'Kontrol', 
            tabBarLabel: 'Kontrol'
          }} 
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ 
            title: 'Pengaturan', 
            tabBarLabel: 'Pengaturan'
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
