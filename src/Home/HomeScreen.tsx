import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { styles, CARD_WIDTH } from './HomeScreen.styles';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const products = [
  {
    id: '1',
    name: 'Nike React Flyknit',
    price: 120,
    sold: 18,
    maxSold: 40,
    image:
      'https://static.nike.com/a/images/t_prod/f_auto,q_auto:eco/1a8c3b6b-0a2b-4b0f-9f7f-2a8d6b3d8b0b/react-runner.jpg',
    discount: 60,
  },
  {
    id: '2',
    name: 'iPhone XR',
    price: 360,
    sold: 8,
    maxSold: 40,
    image:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-xr-blue-select-2018?wid=940&hei=1112&fmt=png-alpha&.v=1566956144788',
    discount: 0,
  },
  // ... các sản phẩm khác
];

export default function HomeScreen({ navigation }: Props) {
  const renderProduct = ({ item }: { item: typeof products[0] }) => {
    const soldPercent = Math.min(1, item.sold / (item.maxSold || 40));
    return (
      <View style={styles.card}>
        {item.discount > 0 && (
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.soldText}>{item.sold} sold</Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${soldPercent * 100}%` }]}
          />
        </View>
        <Text style={styles.priceText}>USD {item.price.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={require('../assets/ic_menu.png')} style={styles.icon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Shop</Text>

        <TouchableOpacity style={styles.cartBtn}>
          <Image source={require('../assets/ic_bag.png')} style={styles.icon} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <LinearGradient colors={['#6C8CFF', '#8FB1FF']} style={styles.banner}>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>NEW YEAR, NEW ME</Text>
          <Text style={styles.bannerSubtitle}>BEST DEALS UP TO 80% OFF</Text>
        </View>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/2086/2086578.png',
          }}
          style={styles.bannerImage}
        />
      </LinearGradient>

      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Search Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Search')}
        testID="floating-search-btn"
      >
        <Image source={require('../assets/ic_search.png')} style={styles.searchIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
