import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { COLORS } from './src/config/api';

import HomeScreen   from './src/screens/HomeScreen';
import MapScreen    from './src/screens/MapScreen';
import DetailScreen from './src/screens/DetailScreen';
import AboutScreen  from './src/screens/AboutScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack untuk Home → Detail
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="Detail"   component={DetailScreen} />
    </Stack.Navigator>
  );
}

// Stack untuk Map → Detail
function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapMain" component={MapScreen} />
      <Stack.Screen name="Detail"  component={DetailScreen} />
    </Stack.Navigator>
  );
}

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: focused ? 22 : 18 }}>{emoji}</Text>
      <Text style={{
        fontSize: 10,
        fontWeight: focused ? '700' : '400',
        color: focused ? COLORS.gold : COLORS.muted,
        marginTop: 1,
      }}>{label}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: COLORS.paper,
            borderTopColor: 'rgba(184,134,11,0.18)',
            borderTopWidth: 1,
            height: 62,
            paddingBottom: 6,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🏠" label="Home" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={MapStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🗺️" label="Peta" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="About"
          component={AboutScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="ℹ️" label="Tentang" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}