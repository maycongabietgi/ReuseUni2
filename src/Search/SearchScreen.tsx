// SearchScreen.tsx - FULL CODE HOÀN CHỈNH, CHỈ LẤY DỮ LIỆU TỪ API THẬT

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { styles } from './SearchScreen.styles';

// Interface cho API thật
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  description: string;
  condition_display: string;
  category_name: string;
}

export default function SearchScreen() {
  const navigation = useNavigation<any>();

  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // Filter state (giữ lại để sau mở rộng)
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500000);

  // Bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  // Categories từ API
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch('https://bkapp-mp8l.onrender.com/categories/');
        if (!response.ok) throw new Error('Network error');
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Lỗi fetch categories:', error);
        Alert.alert('Lỗi', 'Không thể tải danh mục. Vui lòng thử lại.');
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Hàm search sản phẩm từ API thật
  const performSearch = async (query: string) => {
    const q = query.trim();
    if (!q) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setSearchText(q);
    setIsSearching(true);
    setLoadingResults(true);

    try {
      const url = `https://bkapp-mp8l.onrender.com/products?search=${encodeURIComponent(q)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Lỗi search sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm sản phẩm. Vui lòng thử lại.');
      setSearchResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleSearchPress = () => performSearch(searchText);

  const handleCategoryPress = (categoryName: string) => {
    performSearch(categoryName);
  };

  const handleBack = () => {
    if (isSearching) {
      setIsSearching(false);
      setSearchText('');
      setSearchResults([]);
    } else {
      Keyboard.dismiss();
      navigation.goBack();
    }
  };

  const openFilter = () => bottomSheetRef.current?.expand();
  const closeFilter = () => bottomSheetRef.current?.close();

  // Render Category từ API
  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.trendingTag, { backgroundColor: '#4D5BFF' }]}
      onPress={() => handleCategoryPress(item.name)}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center', padding: 8 }}>
        <Text style={styles.trendingText} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render sản phẩm từ API
  const renderResultProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.resultProductCard}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        style={styles.resultProductImage}
        resizeMode="cover"
      />
      <View style={styles.resultInfo}>
        <Text style={styles.resultProductName} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.categoryName}>{item.category_name}</Text>
        <Text style={styles.resultCurrentPrice}>
          {parseInt(item.price).toLocaleString('vi-VN')} ₫
        </Text>
        <Text style={styles.conditionText}>{item.condition_display}</Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const DefaultContent = () => (
    <>
      {loadingCategories ? (
        <ActivityIndicator size="large" color="#4D5BFF" style={{ marginVertical: 40 }} />
      ) : categories.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#666', marginVertical: 40 }}>
          Không có danh mục nào
        </Text>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      )}
    </>
  );

  const ResultsContent = () => (
    <>
      <View style={styles.sortFilterRow}>
        <Text style={styles.sortText}>Kết quả tìm kiếm: "{searchText}"</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={openFilter}>
          <Image source={require('../assets/ic_filter.png')} style={styles.filterIcon} />
          <Text style={styles.filterText}>Lọc</Text>
        </TouchableOpacity>
      </View>

      {loadingResults ? (
        <ActivityIndicator size="large" color="#4D5BFF" style={{ marginTop: 50 }} />
      ) : searchResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderResultProduct}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.resultColumnWrapper}
          contentContainerStyle={styles.resultListContainer}
        />
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#5D7CFF', '#8FA8FF']} style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleBack}>
            <Image source={require('../assets/ic_back.png')} style={[styles.iconImage, { tintColor: '#ffffff' }]} />
          </TouchableOpacity>

          {isSearching ? (
            <View style={styles.resultTitleContainer}>
              <Text style={styles.resultHeaderTitle} numberOfLines={1}>
                {searchText}
              </Text>
            </View>
          ) : (
            <View style={styles.searchBar}>
              <TextInput
                style={styles.input}
                placeholder="Tìm sản phẩm..."
                placeholderTextColor="#9AA4D7"
                value={searchText}
                onChangeText={setSearchText}
                returnKeyType="search"
                onSubmitEditing={handleSearchPress}
              />
            </View>
          )}

          {!isSearching && (
            <TouchableOpacity style={[styles.iconBtn, { marginLeft: 8 }]} onPress={handleSearchPress}>
              <Image
                source={searchText.length > 0 ? require('../assets/ic_search.png') : require('../assets/ic_dot.png')}
                style={[styles.iconImage, { tintColor: '#ffffff' }]}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <FlatList
        data={[]}
        keyExtractor={() => 'dummy'}
        renderItem={null}
        ListHeaderComponent={() => (
          <>
            {isSearching ? <ResultsContent /> : <DefaultContent />}
          </>
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
      />

      {/* Bottom Sheet Filter - giữ lại để sau mở rộng */}
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose>
        <View style={styles.filterSheetContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Bộ lọc</Text>
            <TouchableOpacity onPress={closeFilter} style={{ marginLeft: 'auto' }}>
              <Text style={{ fontSize: 28, color: '#000' }}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterSectionTitle}>Giá (VND)</Text>
          <View style={styles.priceSliderContainer}>
            <Slider
              minimumValue={0}
              maximumValue={500000}
              step={10000}
              minimumTrackTintColor="#4D5BFF"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#4D5BFF"
              value={priceMax}
              onValueChange={setPriceMax}
            />
            <View style={styles.priceLabels}>
              <Text style={styles.priceLabel}>0đ</Text>
              <Text style={styles.priceLabel}>{priceMax.toLocaleString('vi-VN')}đ</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.applyBtn} onPress={closeFilter}>
            <Text style={styles.applyBtnText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}