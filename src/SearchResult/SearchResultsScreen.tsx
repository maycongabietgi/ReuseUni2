// SearchResultsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // ← Thay thế SafeAreaView
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './SearchResultsScreen.styles';

type RouteParams = {
    query: string;
    discountOnly: boolean;
};

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    oldPrice?: string;
    rating: number;
    reviewCount: number;
    image_url: string;
}

export default function SearchResultsScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { query = '', discountOnly = false } = (route.params as RouteParams) || {};
    const insets = useSafeAreaInsets(); // ← Lấy insets để xử lý safe area

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const fixHttpToHttps = (url: string | null | undefined): string => {
        if (!url) return url || ''; // Giữ nguyên nếu null/undefined

        // Nếu bắt đầu bằng http:// → thay bằng https://
        if (url.startsWith('http://')) {
            return url.replace(/^http:\/\//i, 'https://');
        }

        // Các trường hợp khác giữ nguyên
        return url;
    };
    useEffect(() => {
        fetchProducts();
    }, [query, discountOnly]);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            // TODO: Thay bằng API thật khi backend sẵn sàng
            // const params = new URLSearchParams();
            // if (query) params.append('q', query);
            // if (discountOnly) params.append('discount_only', 'true');
            // const res = await fetch(`https://bkapp-mp8l.onrender.com/products?${params}`);
            // const data = await res.json();
            // setProducts(data.results || data);

            // Demo data giống Figma
            await new Promise(resolve => setTimeout(resolve, 800)); // Giả lập loading
            setProducts([
                {
                    id: '1',
                    name: 'Xiaomi Running Shoes for Men',
                    description: '',
                    price: 'USD 80.00',
                    rating: 4.5,
                    reviewCount: 38,
                    image_url: 'https://example.com/xiaomi-running.jpg',
                },
                {
                    id: '2',
                    name: 'Nike Air Zoom Vomer 14',
                    description: '',
                    price: 'USD 60.00',
                    rating: 4.5,
                    reviewCount: 38,
                    image_url: 'https://example.com/nike-zoom.jpg',
                },
                {
                    id: '3',
                    name: 'Nike Epic React Flyknit Pink Blast',
                    description: '',
                    price: 'USD 60.00',
                    rating: 4.5,
                    reviewCount: 38,
                    image_url: 'https://example.com/nike-react.jpg',
                },
                {
                    id: '4',
                    name: 'Nike Air Max 95 Premium',
                    description: '',
                    price: 'USD 180.00',
                    oldPrice: 'USD 220.00',
                    rating: 4.5,
                    reviewCount: 38,
                    image_url: 'https://example.com/nike-airmax.jpg',
                },
            ]);
        } catch (error) {
            console.error('Fetch products error:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity style={styles.productCard}>
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            <View style={styles.info}>
                <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                </Text>
                {item.description ? (
                    <Text style={styles.description}>{item.description}</Text>
                ) : null}
                <View style={styles.priceRow}>
                    <Text style={styles.currentPrice}>{item.price}</Text>
                    {item.oldPrice && <Text style={styles.oldPrice}>{item.oldPrice}</Text>}
                </View>
                <View style={styles.ratingRow}>
                    <Text style={styles.rating}>★★★★☆</Text>
                    <Text style={styles.reviewCount}>({item.reviewCount})</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const getTitle = () => {
        if (discountOnly) return 'Bulk Discounts';
        if (query) return query;
        return 'Search Results';
    };

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                },
            ]}
        >
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient colors={['#5D7CFF', '#8FA8FF']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Image
                            source={require('../assets/ic_back.png')}
                            style={[styles.icon, { tintColor: '#fff' }]}
                        />
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {getTitle()}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.moreBtn}>
                        <Image
                            source={require('../assets/ic_dot.png')}
                            style={[styles.icon, { tintColor: '#fff' }]}
                        />
                    </TouchableOpacity>
                </View>

                {/* Sort & Filter (đã comment trong code gốc, giữ nguyên) */}
                {/* <View style={styles.sortFilterRow}>
                    <Text style={styles.sortText}>Sort By: Popularity</Text>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Image
                            source={require('../assets/ic_filter.png')}
                            style={styles.filterIcon}
                        />
                        <Text style={styles.filterText}>Filter</Text>
                    </TouchableOpacity>
                </View> */}
            </LinearGradient>

            {/* Product List */}
            {loading ? (
                <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#4D5BFF" />
            ) : products.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No products found</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={[
                        styles.listContainer,
                        { paddingBottom: insets.bottom + 80 } // Buffer để tránh che bởi home indicator
                    ]}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}