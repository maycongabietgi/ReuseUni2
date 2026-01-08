import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import useAuth from '../components/Header/Header';
import { styles } from './ProductDetailScreen.styles';
import * as Sentry from '@sentry/react-native';
import { Ionicons } from '@expo/vector-icons';
interface Product {
    id: number;
    title: string;
    price: string;
    image: string;
    description: string;
    category_name: string;
    condition_display: string;
    seller?: number;
}

export default function ProductDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const productId = route.params?.productId;
    const insets = useSafeAreaInsets();

    const { token: authToken, loading: authLoading } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [sellerName, setSellerName] = useState<string>('Đang tải...'); // Lưu tên người bán
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);

    // 1. Lấy thông tin cá nhân để so sánh ID
    useEffect(() => {
        const fetchMe = async () => {
            if (!authToken) return;
            try {
                const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
                    headers: { Authorization: `Token ${authToken}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCurrentUserId(data.id);
                }
            } catch (err) {
                console.error('Lỗi lấy user info:', err);
            }
        };
        fetchMe();
    }, [authToken]);

    // 2. Lấy chi tiết sản phẩm và Tên người bán
    useEffect(() => {
        if (!productId) {
            Alert.alert('Lỗi', 'Không có ID sản phẩm');
            navigation.goBack();
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                // Lấy sản phẩm
                const prodRes = await fetch(`https://bkapp-mp8l.onrender.com/products/${productId}/`);
                if (!prodRes.ok) throw new Error('Không thể tải sản phẩm');
                const prodData: Product = await prodRes.json();
                setProduct(prodData);

                // Lấy thêm thông tin người bán từ API users
                if (prodData.seller) {
                    const userRes = await fetch(`https://bkapp-mp8l.onrender.com/api/users/${prodData.seller}/`);
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setSellerName(userData.name || userData.username);
                    } else {
                        setSellerName('Người dùng BK');
                    }
                }
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm.');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const fixHttpToHttps = (url: string | null | undefined): string => {
        if (!url) return '';
        return url.startsWith('http://') ? url.replace(/^http:\/\//i, 'https://') : url;
    };

    // --- Actions ---

    const handleChat = async () => {
        if (!product?.seller || !authToken) {
            Alert.alert('Lỗi', 'Vui lòng đăng nhập để chat');
            return;
        }

        if (product.seller === currentUserId) {
            Alert.alert('Thông báo', 'Đây là sản phẩm của bạn, không thể chat với chính mình.');
            return;
        }

        try {
            const response = await fetch('https://bkapp-mp8l.onrender.com/chats/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${authToken}`,
                },
                body: JSON.stringify({ target_user_id: product.seller }),
            });

            const result = await response.json();
            if (response.ok && result.chat_id) {
                navigation.navigate('ChatDetail', { chatId: result.chat_id });
            } else {
                throw new Error(result.message || 'Lỗi khởi tạo chat');
            }
        } catch (error: any) {
            Alert.alert('Lỗi', error.message);
        }
    };

    const handleAddToCart = async () => {
        if (!product || !authToken) return;

        if (product.seller === currentUserId) {
            Alert.alert('Thông báo', 'Bạn không thể thêm sản phẩm của chính mình vào giỏ hàng.');
            return;
        }

        setAddingToCart(true);
        try {
            const response = await fetch('https://bkapp-mp8l.onrender.com/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${authToken}`,
                },
                body: JSON.stringify({ product_id: product.id, quantity: 1 }),
            });

            const result = await response.json();
            if (response.ok) {
                Alert.alert('Thành công', 'Đã thêm vào giỏ hàng!', [
                    { text: 'OK' },
                    { text: 'Xem giỏ hàng', onPress: () => navigation.navigate('Cart') },
                ]);
            } else {
                Alert.alert('Lỗi', result.message || 'Thao tác thất bại');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể kết nối máy chủ');
        } finally {
            setAddingToCart(false);
        }
    };

    if (authLoading || loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#4D5BFF" />
            </View>
        );
    }

    if (!product) return null;

    const isOwner = product.seller === currentUserId;

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                {/* Left */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.headerButton}
                >
                    <Image
                        source={require('../assets/ic_back.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>

                {/* Right icons */}
                <View style={styles.rightActions}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Image
                            source={require('../assets/ic_bag.png')}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => Sentry.showFeedbackWidget()}
                    >
                        <Ionicons name="bug-outline" size={24} color="#ff4d4d" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: fixHttpToHttps(product.image) }} style={styles.productImage} resizeMode="contain" />
                </View>

                <View style={styles.info}>
                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.price}>
                        {product.price ? parseInt(product.price).toLocaleString('vi-VN') + ' ₫' : ''}
                    </Text>

                    {/* KHỐI NGƯỜI BÁN MỚI THÊM VÀO */}
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingVertical: 12,
                            paddingHorizontal: 15,
                            backgroundColor: '#F8F9FA',
                            borderRadius: 10,
                            marginVertical: 15
                        }}
                        onPress={() => navigation.navigate('Shop', { sellerId: product.seller })}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9ECEF', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ color: '#adb5bd', fontWeight: 'bold' }}>S</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: '#333' }}>{sellerName}</Text>
                                <Text style={{ fontSize: 12, color: '#6c757d' }}>Người bán</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 13, color: '#2D7FF9', fontWeight: '600' }}>Xem cửa hàng {'>'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Danh mục</Text>
                        <Text style={styles.value}>{product.category_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tình trạng</Text>
                        <Text style={styles.value}>{product.condition_display}</Text>
                    </View>
                    <View style={styles.rowDescription}>
                        <Text style={styles.label}>Mô tả</Text>
                        <Text style={styles.value}>{product.description}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                {isOwner ? (
                    <View style={{ flex: 1, backgroundColor: '#F0F0F0', borderRadius: 12, padding: 12, alignItems: 'center' }}>
                        <Text style={{ color: '#666', fontWeight: '600' }}>Sản phẩm của bạn</Text>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
                            <Image source={require('../assets/ic_message.png')} style={styles.chatIcon} />
                            <Text style={styles.chatText}>Chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buyButtonWrapper}
                            onPress={handleAddToCart}
                            disabled={addingToCart}
                        >
                            <LinearGradient colors={['#4D5BFF', '#8FA8FF']} style={styles.buyButton}>
                                {addingToCart ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../assets/ic_cart.png')} style={styles.buyIcon} />
                                        <Text style={styles.buyText}>Thêm vào giỏ hàng</Text>
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}