// CartScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../components/Header/Header';
import * as Sentry from '@sentry/react-native';

interface CartItem {
    id: number;
    product: {
        id: number;
        title: string;
        price: string;
        image: string;
        seller_name: string;
    };
    quantity: number;
}

interface Cart {
    id: number;
    items: CartItem[];
    total_cart_price: number;
}

interface UserProfile {
    id: number;
    address: string;
    email: string;
    username: string;
    first_name: string;
}

export default function CartScreen() {
    const navigation = useNavigation<any>();
    const { token: authToken } = useAuth();
    const insets = useSafeAreaInsets();

    const [cart, setCart] = useState<Cart | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Hàm lấy lỗi đầu tiên từ response backend
    const getFirstErrorMessage = (errorObj: any): string => {
        if (!errorObj || typeof errorObj !== 'object') return 'Lỗi không xác định';
        if (errorObj.detail) return errorObj.detail;
        if (errorObj.address && Array.isArray(errorObj.address)) return errorObj.address[0];
        if (errorObj.non_field_errors && Array.isArray(errorObj.non_field_errors)) return errorObj.non_field_errors[0];

        for (const key in errorObj) {
            const value = errorObj[key];
            if (Array.isArray(value) && value.length > 0) return String(value[0]);
        }
        return 'Lỗi tạo đơn hàng';
    };

    useEffect(() => {
        if (authToken) {
            Promise.all([fetchProfile(), fetchCart()]).finally(() => setLoading(false));
        } else {
            setLoading(false);
            Alert.alert('Thông báo', 'Vui lòng đăng nhập để xem giỏ hàng');
        }
    }, [authToken]);

    const fetchProfile = async () => {
        try {
            const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
                method: 'GET',
                headers: { Authorization: `Token ${authToken}` },
            });

            if (!response.ok) throw new Error('Không thể tải thông tin người dùng');
            const data: UserProfile = await response.json();
            setProfile(data);
        } catch (error) {
            console.error('Lỗi fetch profile:', error);
        }
    };

    const fetchCart = async () => {
        try {
            const response = await fetch('https://bkapp-mp8l.onrender.com/cart', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${authToken}`,
                },
            });

            if (!response.ok) throw new Error('Không thể tải giỏ hàng');
            const data: Cart = await response.json();
            setCart(data);
        } catch (error) {
            console.error('Lỗi fetch giỏ hàng:', error);
            setCart(null);
        }
    };

    const handleCheckout = async () => {
        if (!authToken) {
            Alert.alert('Lỗi', 'Vui lòng đăng nhập để thanh toán');
            return;
        }

        if (!cart?.items?.length) {
            Alert.alert('Chú ý', 'Giỏ hàng trống');
            return;
        }

        if (!profile?.address) {
            Alert.alert('Lỗi', 'Chưa có địa chỉ giao hàng. Vui lòng cập nhật profile.');
            return;
        }

        Alert.alert(
            'Xác nhận thanh toán',
            `Thanh toán ${cart.items.length} sản phẩm?\n\nĐịa chỉ: ${profile.address}`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Thanh toán ngay',
                    onPress: async () => {
                        setIsCheckingOut(true);
                        try {
                            const payload = { address: profile.address.trim() };

                            const response = await fetch('https://bkapp-mp8l.onrender.com/orders', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Token ${authToken}`,
                                },
                                body: JSON.stringify(payload),
                            });

                            const responseText = await response.text();

                            if (!response.ok) {
                                let errorMsg = 'Không thể tạo đơn hàng';
                                try {
                                    const err = JSON.parse(responseText);
                                    errorMsg = getFirstErrorMessage(err);
                                } catch {
                                    errorMsg = responseText || 'Lỗi server';
                                }
                                throw new Error(errorMsg);
                            }

                            const data = JSON.parse(responseText);
                            Alert.alert('🎉 Thành công', data.message || 'Đã đặt hàng thành công!');
                            await fetchCart(); // Reload giỏ hàng
                        } catch (error: any) {
                            console.error('Checkout error:', error);
                            Alert.alert('❌ Lỗi thanh toán', error.message);
                        } finally {
                            setIsCheckingOut(false);
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: CartItem }) => {
        const finalUri = getFullImageUrl(item.product.image);

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.product.id })} // ← Thêm onPress để đi tới ProductDetail
            >
                {/* Ảnh sản phẩm bên trái */}
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: finalUri }}
                        style={styles.img}
                        resizeMode="cover"
                    />
                </View>

                {/* Thông tin sản phẩm bên phải */}
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.product.title}
                    </Text>
                    <Text style={styles.seller}>
                        Người bán: {item.product.seller_name || 'Không xác định'}
                    </Text>
                    <Text style={styles.price}>
                        {Number(item.product.price).toLocaleString('vi-VN')} ₫
                    </Text>

                    {/* Số lượng cố định */}
                    <View style={styles.qtyContainer}>
                        <Text style={styles.qtyText}>x{item.quantity}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const getFullImageUrl = (imagePath: string) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('image/upload')) {
            return `https://res.cloudinary.com/dfqojwmry/${imagePath}`;
        }
        return `https://bkapp-mp8l.onrender.com/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`;
    };

    if (loading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color="#4D5BFF" style={{ flex: 1 }} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={26} color="#1A1A1A" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Giỏ hàng</Text>

                {/* Nút báo lỗi bên phải */}
                <TouchableOpacity
                    onPress={() => Sentry.showFeedbackWidget()}
                    style={styles.reportBtn}
                >
                    <Ionicons name="bug-outline" size={22} color="#4D5BFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={cart?.items || []}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="bag-outline" size={70} color="#DDD" />
                        <Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>
                    </View>
                }
            />

            {/* Footer thanh toán */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 15 }]}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                    <Text style={styles.totalValue}>
                        {Number(cart?.total_cart_price || 0).toLocaleString('vi-VN')} ₫
                    </Text>
                </View>

                <TouchableOpacity onPress={handleCheckout}>
                    <LinearGradient
                        colors={['#4D5BFF', '#7C88FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.payBtn}
                    >
                        <Text style={styles.payText}>Mua ngay</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    reportBtn: {
        padding: 6,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    imageWrapper: {
        width: 90,
        height: 90,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
    },
    img: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        marginLeft: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    seller: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    price: {
        fontSize: 17,
        color: '#4D5BFF',
        fontWeight: '800',
    },
    qtyContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    qtyText: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '700',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        paddingTop: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111827',
    },
    payBtn: {
        height: 55,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },
    empty: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 15,
        color: '#9CA3AF',
        fontSize: 16,
    },
});