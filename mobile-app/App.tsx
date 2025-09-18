import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import GroupBuysScreen from './src/screens/GroupBuysScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import { PrivacyPolicyScreen, TermsOfServiceScreen } from './src/screens/LegalScreens';
import { AuthProvider, useAuth } from './src/lib/auth-context';
import * as Linking from 'expo-linking';
import { registerForPushNotificationsAsync } from './src/lib/notifications';
import { initSentry } from './src/sentry';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProductsStack = createNativeStackNavigator();
const DashboardStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
const OrdersStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function ProductsStackScreen() {
  return (
    <ProductsStack.Navigator screenOptions={{ headerLargeTitle: true, headerShadowVisible: false }}>
      <ProductsStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
      <ProductsStack.Screen name="ProductsHome" component={ProductsScreen} options={{ title: 'Products' }} />
      <ProductsStack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
      <ProductsStack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product' }} />
      <ProductsStack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
    </ProductsStack.Navigator>
  );
}

function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerLargeTitle: true, headerShadowVisible: false }}>
      <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <DashboardStack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <DashboardStack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Orders' }} />
      <DashboardStack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Order' }} />
      <DashboardStack.Screen name="Privacy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
      <DashboardStack.Screen name="Terms" component={TermsOfServiceScreen} options={{ title: 'Terms of Service' }} />
    </DashboardStack.Navigator>
  );
}

function ChatStackScreen() {
  return (
    <ChatStack.Navigator screenOptions={{ headerLargeTitle: true, headerShadowVisible: false }}>
      <ChatStack.Screen name="ChatHome" component={ChatScreen} options={{ title: 'Chat' }} />
      <ChatStack.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'Wishlist' }} />
      <ChatStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <ChatStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ChatStack.Screen name="GroupBuys" component={GroupBuysScreen} options={{ title: 'Group Buys' }} />
    </ChatStack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'Products' ? 'pricetag-outline' : route.name === 'Dashboard' ? 'grid-outline' : 'chatbubble-ellipses-outline';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: { height: 58 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Products" component={ProductsStackScreen} />
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
      <Tab.Screen name="Chat" component={ChatStackScreen} />
    </Tab.Navigator>
  );
}

const linking = {
  prefixes: [Linking.createURL('/'), 'mobileapp://'],
  config: {
    screens: {
      Home: {
        screens: {
          Products: {
            screens: {
              ProductDetail: 'product/:id',
              Orders: 'orders',
              OrderDetail: 'order/:orderNumber',
              Checkout: 'checkout',
            },
          },
        },
      },
    },
  },
};

function RootNavigator() {
  const { userId, loading } = useAuth();
  React.useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  return (
    <Stack.Navigator initialRouteName={userId ? 'Home' : 'Login'}>
      {!userId ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerLargeTitle: true, title: 'Create Account' }} />
        </>
      ) : null}
      <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer linking={linking} theme={{
          ...DefaultTheme,
          colors: { ...DefaultTheme.colors, primary: '#007AFF', background: '#F2F2F7' },
        }}>
          {initSentry()}
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
