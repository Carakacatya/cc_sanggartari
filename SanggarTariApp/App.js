import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Platform } from 'react-native';
import { COLORS } from './src/config/api';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen   from './src/screens/HomeScreen';
import MapScreen    from './src/screens/MapScreen';
import DetailScreen from './src/screens/DetailScreen';
import InfoScreen   from './src/screens/InfoScreen';
import AboutScreen  from './src/screens/AboutScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="Detail"   component={DetailScreen} />
    </Stack.Navigator>
  );
}

function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapMain" component={MapScreen} />
      <Stack.Screen name="Detail"  component={DetailScreen} />
    </Stack.Navigator>
  );
}

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.paper,
          borderTopColor: 'rgba(184,134,11,0.25)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 82 : 62,
          paddingBottom: Platform.OS === 'ios' ? 22 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <Text style={{ fontSize:22, lineHeight:26 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{
          tabBarLabel: 'Peta',
          tabBarIcon: () => <Text style={{ fontSize:22, lineHeight:26 }}>🗺️</Text>,
        }}
      />
      {/* ✅ Tab baru Info */}
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          tabBarLabel: 'Info',
          tabBarIcon: () => <Text style={{ fontSize:22, lineHeight:26 }}>🎪</Text>,
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: 'Tentang',
          tabBarIcon: () => <Text style={{ fontSize:22, lineHeight:26 }}>ℹ️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      )}
    </>
  );
}