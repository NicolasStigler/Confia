import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#93B6C8',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: '#1A2A32',
          borderTopWidth: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: 'Reservations',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name={Platform.OS === 'ios' ? 'calendar' : 'reservation.fill'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="set-horario"
        options={{
          title: 'Horario',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name={Platform.OS === 'ios' ? 'access-time' : 'access-time'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name={Platform.OS === 'ios' ? 'person.crop.circle.fill' : 'profile.fill'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
