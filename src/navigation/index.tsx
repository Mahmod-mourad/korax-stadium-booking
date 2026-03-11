import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useStore } from '../store';

import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import SelectRoleScreen from '../screens/auth/SelectRoleScreen';

import PlayerTabNavigator from './PlayerTabNavigator';
import OwnerTabNavigator from './OwnerTabNavigator';

import StadiumDetailsScreen from '../screens/player/StadiumDetailsScreen';
import BookingScreen from '../screens/player/BookingScreen';
import BookingConfirmationScreen from '../screens/player/BookingConfirmationScreen';
import BookingHistoryScreen from '../screens/player/BookingHistoryScreen';
import RateStadiumScreen from '../screens/player/RateStadiumScreen';
import AllStadiumsScreen from '../screens/player/AllStadiumsScreen';
import EditProfileScreen from '../screens/player/EditProfileScreen';

import AddStadiumScreen from '../screens/owner/AddStadiumScreen';
import EditStadiumScreen from '../screens/owner/EditStadiumScreen';

// شاشة مشتركة بين اللاعب وصاحب الملعب
import HelpSupportScreen from '../screens/shared/HelpSupportScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, user } = useStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="SelectRole" component={SelectRoleScreen} />
          </>
        ) : user?.role === 'owner' ? (
          <>
            <Stack.Screen name="OwnerTabs" component={OwnerTabNavigator} />
            <Stack.Screen name="AddStadium" component={AddStadiumScreen} />
            <Stack.Screen name="EditStadium" component={EditStadiumScreen} />
            {/* مشترك */}
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="PlayerTabs" component={PlayerTabNavigator} />
            <Stack.Screen name="StadiumDetails" component={StadiumDetailsScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
            <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
            <Stack.Screen name="RateStadium" component={RateStadiumScreen} />
            <Stack.Screen name="AllStadiums" component={AllStadiumsScreen} />
            {/* شاشات الملف الشخصي */}
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
