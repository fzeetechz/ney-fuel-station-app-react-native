import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../pages/LoginScreen';
import SplashScreen from '../pages/SplashScreen';
import WelcomeScreen from '../pages/WelcomeScreen';
import {RootStackParamList} from '../routes/types';
import SuccessScreen from '../pages/SuccessScreen';
import ProfileScreen from '../pages/ProfileScreen';
import HomeScreen from '../pages/HomeScreen';
import OrderScreen from '../pages/NewOrderScreen';
import OrdersHistoryScreen from '../pages/OrdersHistoryScreen';
import ReviewOrderScreen from '../pages/ReviewOrderScreen';
import WalletScreen from '../pages/WalletScreen';
import AddMoneyScreen from '../pages/AddMoneyScreen';
import AllTransactionScreen from '../pages/AllTransactionScreen';
import TrackOrderScreen from '../pages/TrackOrderScreen';
import MyAddressScreen from '../pages/MyAddressScreen';
import AddAddressScreen from '../pages/AddAddressScreen';
import {navigationRef} from './navigationService';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen name="OrdersHistory" component={OrdersHistoryScreen} />
        <Stack.Screen name="ReviewOrder" component={ReviewOrderScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
        <Stack.Screen name="AllTransactions" component={AllTransactionScreen} />
        <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MyAddress" component={MyAddressScreen} />
        <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
