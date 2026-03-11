import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';

import OwnerDashboardScreen from '../screens/owner/OwnerDashboardScreen';
import MyStadiumsScreen from '../screens/owner/MyStadiumsScreen';
import OwnerBookingsScreen from '../screens/owner/OwnerBookingsScreen';
import OwnerStatsScreen from '../screens/owner/OwnerStatsScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function OwnerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="OwnerDashboard"
        component={OwnerDashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📊" label="الرئيسية" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="MyStadiums"
        component={MyStadiumsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏟️" label="ملاعبي" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="OwnerBookings"
        component={OwnerBookingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📅" label="الحجوزات" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="OwnerStats"
        component={OwnerStatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="💰" label="الإحصائيات" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 22, marginBottom: 2, opacity: 0.5 },
  tabIconActive: { opacity: 1 },
  tabLabel: { fontSize: 10, color: Colors.textSecondary },
  tabLabelActive: { color: Colors.primary, fontWeight: '700' },
});
