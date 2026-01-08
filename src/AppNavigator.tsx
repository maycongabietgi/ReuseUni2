import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

// Import Screens
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
import ReviewScreen from './Activity/ReviewScreen';
import MyShopScreen from './MyShop/MyShopScreen';
import SideBar from './components/SideMenu/SideBar';
import AddProductScreen from './MyShop/AddProductScreen';
import ShopSettingsScreen from './MyShop/ShopSettingsScreen';
import SearchResultsScreen from './SearchResult/SearchResultsScreen';
import ProductDetailScreen from './ProductDetail/ProductDetailScreen';
import CartScreen from './Cart/CartScreen';
import ChatDetailScreen from './ChatDetail/ChatDetailScreen';
import ChatListScreen from './ChatList/ChatListScreen';
import ShopScreen from './Shop/ShopScreen';

export const navIntegration = Sentry.reactNavigationIntegration();

// Định nghĩa kiểu dữ liệu cho các tham số điều hướng
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
  Shop: { sellerId: number };
  AddProduct: undefined;
  ShopSettings: undefined;
  Orders: { defaultTab?: 'requested' | 'meeting' | 'completed' | 'cancelled' };
  Review: { tradeId: number };
  EditAddress: { address?: any };
  Cart: undefined;
  ChatList: undefined;
  ChatDetail: { chatId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const navigationRef = useNavigationContainerRef();
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');

        // Nếu đã từng mở app rồi (biến = '1') -> Vào Home
        // Nếu chưa từng mở (biến = null) -> Vào Splash
        if (hasLaunched === '1') {
          setInitialRoute('Home');
        } else {
          setInitialRoute('Splash');
        }
      } catch (error) {
        console.error("Lỗi đọc AsyncStorage:", error);
        setInitialRoute('Home'); // Fallback vào Home nếu lỗi
      }
    };

    checkFirstLaunch();
  }, []);

  // Trong khi chờ đợi AsyncStorage đọc dữ liệu, hiển thị màn hình chờ tạm thời
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#506EFF' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        navIntegration.registerNavigationContainer(navigationRef);
      }}
    >
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        {/* Auth & Intro */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Waiting" component={WaitingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Main Flow */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />

        {/* Profile & Settings */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="EditAddress" component={EditAddressScreen} />
        <Stack.Screen name="SideBar" component={SideBar} />

        {/* Activity & Orders */}
        <Stack.Screen name="Activity" component={ActivityScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />

        {/* Seller / My Shop */}
        <Stack.Screen name="Store" component={StoreScreen} />
        <Stack.Screen name="MyShop" component={MyShopScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="ShopSettings" component={ShopSettingsScreen} />

        {/* Chat */}
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}