import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './Home/HomeScreen';
import SplashScreen from './Splash/SplashScreen';
import WaitingScreen from './Waiting/WaitingScreen';
import LoginScreen from './Login/LoginScreen';
import SearchScreen from './Search/SearchScreen';
import ProfileScreen from './Profile/ProfileScreen';
import SettingsScreen from './Settings/SettingsScreen';
import AccountScreen from './Account/AccountScreen';
import EditAddressScreen from './Account/EditAddressScreen';
import StoreScreen from './Store/StoreScreen';
import ActivityScreen from './Activity/ActivityScreen';
import OrdersScreen from './Activity/OrdersScreen';
import OrdersShipped from './Activity/OrdersRequested';
import ReviewScreen from './Activity/ReviewScreen';
import MyShopScreen from './MyShop/MyShopScreen';
import SideBar from './components/SideMenu/SideBar';
import AddProductScreen from './MyShop/AddProductScreen';
import ShopSettingsScreen from './MyShop/ShopSettingsScreen';
import SearchResultsScreen from './SearchResult/SearchResultsScreen';
import ProductDetailScreen from './ProductDetail/ProductDetailScreen';
import CartScreen from './Cart/CartScreen';
export type RootStackParamList = {
  Home: undefined;
  Splash: undefined;
  Waiting: undefined;
  Login: undefined;
  Search: undefined;
  SearchResults: undefined;
  ProductDetail: { productId: number };
  Profile: undefined;
  Settings: undefined;
  SideBar: undefined;
  Account: undefined;
  Store: undefined;
  Activity: undefined;
  MyShop: undefined;
  AddProduct: undefined;
  ShopSettings: undefined;
  Orders: { defaultTab?: 'requested' | 'meeting' | 'completed' | 'cancelled' };
  Review: { tradeId: number };
  // OrdersArriving: undefined;
  EditAddress: { address?: AddressType };
  Cart: undefined;
};

export type AddressType = {
  id?: number;
  name: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  address: string;
  isPrimary: boolean;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Store" component={StoreScreen} />
        <Stack.Screen name="MyShop" component={MyShopScreen} />
        <Stack.Screen name="Waiting" component={WaitingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Activity" component={ActivityScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="ShopSettings" component={ShopSettingsScreen} />
        <Stack.Screen name="EditAddress" component={EditAddressScreen} />
        <Stack.Screen name="SideBar" component={SideBar} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
