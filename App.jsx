import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Firebase Configuration
import './src/services/firebase';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import ControlScreen from './src/screens/ControlScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Beranda' }}
        />
        <Tab.Screen 
          name="Control" 
          component={ControlScreen} 
          options={{ title: 'Kontrol' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Pengaturan' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
