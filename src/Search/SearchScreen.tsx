// SearchScreen.tsx
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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './SearchScreen.styles';

const SEARCH_HISTORY_KEY = 'search_history';

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

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500000);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingAllProducts, setLoadingAllProducts] = useState(true);

  // Lịch sử tìm kiếm từ local
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Mảng màu cho category
  const categoryColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#48DBFB', '#A0A6FF', '#FF8B94',
  ];

  // Trending giả lập
  const trendingSearches = [
    'FILA Sweater',
    'Anello Messenger Bags',
    'Windows Surface 10',
    'FILA Sweater',
  ];

  // Load lịch sử khi mở màn hình
  useEffect(() => {
    loadSearchHistory();
    fetchCategories();
    fetchAllProducts();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (historyJson) {
        const history = JSON.parse(historyJson);
        setSearchHistory(history);
      }
    } catch (error) {
      console.error('Lỗi load lịch sử tìm kiếm:', error);
    }
  };

  const saveSearchHistory = async (newHistory: string[]) => {
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    } catch (error) {
      console.error('Lỗi lưu lịch sử tìm kiếm:', error);
    }
  };

  const addToHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // Xóa nếu đã có, rồi thêm lên đầu
    const filtered = searchHistory.filter(item => item !== trimmed);
    const newHistory = [trimmed, ...filtered].slice(0, 10); // Giới hạn 10 mục

    saveSearchHistory(newHistory);
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
      setSearchHistory([]);
    } catch (error) {
      console.error('Lỗi xóa lịch sử:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch('https://bkapp-mp8l.onrender.com/categories/');
      if (!response.ok) throw new Error('Network error');
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Lỗi fetch categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoadingAllProducts(true);
      const response = await fetch('https://bkapp-mp8l.onrender.com/products?search=');
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      const productList: Product[] = data.results || data || [];
      setAllProducts(productList);
    } catch (error) {
      console.error('Lỗi fetch all products:', error);
      setAllProducts([]);
    } finally {
      setLoadingAllProducts(false);
    }
  };

  const performSearch = async (query: string) => {
    const q = query.trim();
    if (!q) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    // Lưu vào lịch sử trước khi search
    addToHistory(q);

    setSearchText(q);
    setIsSearching(true);
    setLoadingResults(true);

    try {
      const url = `https://bkapp-mp8l.onrender.com/products?search=${encodeURIComponent(q)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setSearchResults(data.results || data || []);
    } catch (error) {
      console.error('Lỗi search:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm. Vui lòng thử lại.');
      setSearchResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleSearchPress = () => performSearch(searchText);

  const handleCategoryPress = (categoryName: string) => {
    setSearchText(categoryName);
    performSearch(categoryName);
  };

  const handleBack = () => {
    if (isSearching || searchText.length > 0) {
      setIsSearching(false);
      setSearchText('');
      setSearchResults([]);
    } else {
      navigation.goBack();
    }
  };

  const openFilter = () => bottomSheetRef.current?.expand();
  const closeFilter = () => bottomSheetRef.current?.close();

  // 3 sản phẩm rẻ nhất
  const cheapestProducts = allProducts.length > 0
    ? [...allProducts]
      .sort((a, b) => parseInt(a.price) - parseInt(b.price))
      .slice(0, 3)
    : [];

  // Sản phẩm nổi bật (ID = 1)
  const featuredProduct = allProducts.find(p => p.id === 1);

  const renderCategory = ({ item, index }: { item: Category; index: number }) => {
    const color = categoryColors[index % categoryColors.length];
    return (
      <TouchableOpacity
        style={[styles.categoryTag, { backgroundColor: color }]}
        onPress={() => handleCategoryPress(item.name)}
      >
        <Text style={styles.categoryTagText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderHistoryItem = (history: string) => (
    <TouchableOpacity style={styles.historyItem} onPress={() => performSearch(history)}>
      <Text style={styles.historyText}>{history}</Text>
    </TouchableOpacity>
  );

  const renderTrending = (trend: string, index: number) => (
    <View style={[styles.trendingTag, { backgroundColor: categoryColors[index % categoryColors.length] }]}>
      <Text style={styles.trendingText}>{trend}</Text>
    </View>
  );

  const renderResultProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.resultImage} resizeMode="cover" />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.resultPrice}>{parseInt(item.price).toLocaleString('vi-VN')} ₫</Text>
      </View>
    </TouchableOpacity>
  );

  const DefaultContent = () => (
    <View style={styles.defaultContainer}>
      {/* Danh mục */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danh mục</Text>
        {loadingCategories ? (
          <ActivityIndicator color="#4D5BFF" />
        ) : categories.length === 0 ? (
          <Text style={styles.emptyText}>Không có danh mục</Text>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* 3 sản phẩm rẻ nhất */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm rẻ nhất</Text>
        {loadingAllProducts ? (
          <ActivityIndicator color="#4D5BFF" />
        ) : cheapestProducts.length === 0 ? (
          <Text style={styles.emptyText}>Không có sản phẩm</Text>
        ) : (
          <View style={styles.cheapestRow}>
            {cheapestProducts[0] && (
              <TouchableOpacity
                style={styles.cheapestBigCard}
                onPress={() => navigation.navigate('ProductDetail', { productId: cheapestProducts[0].id })}
              >
                <Image source={{ uri: cheapestProducts[0].image }} style={styles.cheapestBigImage} />
                <View style={styles.cheapestInfo}>
                  <Text style={styles.cheapestTitle} numberOfLines={2}>{cheapestProducts[0].title}</Text>
                  <Text style={styles.cheapestPrice}>{parseInt(cheapestProducts[0].price).toLocaleString('vi-VN')} ₫</Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.cheapestSmallColumn}>
              {cheapestProducts.slice(1, 3).map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.cheapestSmallCard}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                >
                  <Image source={{ uri: product.image }} style={styles.cheapestSmallImage} />
                  <View style={styles.cheapestInfo}>
                    <Text style={styles.cheapestSmallTitle} numberOfLines={2}>{product.title}</Text>
                    <Text style={styles.cheapestSmallPrice}>{parseInt(product.price).toLocaleString('vi-VN')} ₫</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Sản phẩm nổi bật */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
        {featuredProduct ? (
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate('ProductDetail', { productId: featuredProduct.id })}
          >
            <Image source={{ uri: featuredProduct.image }} style={styles.featuredImage} />
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredTitle} numberOfLines={2}>{featuredProduct.title}</Text>
              <Text style={styles.featuredPrice}>{parseInt(featuredProduct.price).toLocaleString('vi-VN')} ₫</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={styles.emptyText}>Không có sản phẩm nổi bật</Text>
        )}
      </View>
    </View>
  );

  const InputFocusedContent = () => (
    <View style={styles.inputFocusedContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Lịch sử tìm kiếm</Text>
        {searchHistory.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.historyList}>
        {searchHistory.map((item, index) => (
          <View key={index}>{renderHistoryItem(item)}</View>
        ))}
      </View>

      <View style={styles.trendingHeader}>
        <Text style={styles.trendingTitle}>Tìm kiếm phổ biến</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.trendingList}>
        {trendingSearches.map((item, index) => (
          <View key={index}>{renderTrending(item, index)}</View>
        ))}
      </View>
    </View>
  );

  const ResultsContent = () => (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Kết quả tìm kiếm: "{searchText}"</Text>
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
        //contentContainerStyle={styles.resultListContainer}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#5D7CFF', '#8FA8FF']} style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Image source={require('../assets/ic_back.png')} style={styles.backIcon} />
          </TouchableOpacity>

          <View style={styles.searchBarContainer}>
            <View style={styles.searchInputWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm sản phẩm..."
                placeholderTextColor="#bbb"
                value={searchText}
                onChangeText={setSearchText}
                returnKeyType="search"
                onSubmitEditing={handleSearchPress}
              />
              {searchText.length > 0 && (
                <TouchableOpacity style={styles.clearBtn} onPress={() => setSearchText('')}>
                  <Text style={styles.clearText}>×</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.searchBtn} onPress={handleSearchPress}>
              <Image source={require('../assets/ic_search.png')} style={styles.searchBtnIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={[]}
        keyExtractor={() => 'dummy'}
        renderItem={null}
        ListHeaderComponent={() => (
          <>
            {isSearching ? (
              <ResultsContent />
            ) : searchText.length > 0 ? (
              <InputFocusedContent />
            ) : (
              <DefaultContent />
            )}
          </>
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose>
        <View style={styles.filterContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Bộ lọc</Text>
            <TouchableOpacity onPress={closeFilter}>
              <Text style={styles.closeFilter}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.filterLabel}>Giá (VND)</Text>
          <Slider
            minimumValue={0}
            maximumValue={500000}
            step={10000}
            value={priceMax}
            onValueChange={setPriceMax}
            minimumTrackTintColor="#4D5BFF"
            thumbTintColor="#4D5BFF"
          />
          <View style={styles.priceRange}>
            <Text>0đ</Text>
            <Text>{priceMax.toLocaleString('vi-VN')}đ</Text>
          </View>
          <TouchableOpacity style={styles.applyBtn} onPress={closeFilter}>
            <Text style={styles.applyText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}