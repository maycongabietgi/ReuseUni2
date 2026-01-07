// CartScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../components/Header/Header';
import { styles } from './CartScreen.styles';

interface CartItem {
    id: number;
    product: {
        id: number;
        title: string;
        price: string;
        image: string; // Đây là full URL từ backend
        seller_name: string;
    };
    quantity: number;
}

interface Cart {
    id: number;
    items: CartItem[];
    total_cart_price: number;
}

export default function CartScreen() {
    const navigation = useNavigation<any>();
    const { token: authToken } = useAuth();

    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        console.log(authToken);

        if (!authToken) {
            Alert.alert('Lỗi', 'Không có token xác thực');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('https://bkapp-mp8l.onrender.com/cart', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Không thể tải giỏ hàng');
            }

            const data: Cart = await response.json();
            setCart(data);
            // Mặc định chọn tất cả khi load xong
            setSelectedItems(data.items.map(item => item.id));
        } catch (error) {
            console.error('Lỗi fetch giỏ hàng:', error);
            Alert.alert('Lỗi', 'Không thể tải giỏ hàng. Vui lòng thử lại.');
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectItem = (itemId: number) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const toggleSelectAll = () => {
        if (!cart) return;
        if (selectedItems.length === cart.items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart.items.map(item => item.id));
        }
    };

    // Tạm thời update local state (vì endpoint update chưa có hoặc lỗi)
    const updateQuantityLocal = (itemId: number, delta: number) => {
        if (!cart) return;

        setCart(prevCart => {
            if (!prevCart) return null;
            const newItems = prevCart.items.map(item => {
                if (item.id === itemId) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter(Boolean) as CartItem[];

            const newTotal = newItems.reduce((sum, item) =>
                sum + parseInt(item.product.price) * item.quantity, 0
            );

            return {
                ...prevCart,
                items: newItems,
                total_cart_price: newTotal,
            };
        });
    };

    const renderItem = ({ item }: { item: CartItem }) => {
        const isSelected = selectedItems.includes(item.id);

        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
                    <Image
                        source={
                            isSelected
                                ? require('../assets/ic_check_checked.png')
                                : require('../assets/ic_check.png')
                        }
                        style={styles.checkbox}
                    />
                </TouchableOpacity>

                {/* Sửa đúng: dùng thẳng item.product.image như ProductDetail */}
                <Image
                    source={{ uri: item.product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                    onError={(e) => console.log('Lỗi load ảnh:', e.nativeEvent.error)}
                />

                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.product.title}
                    </Text>
                    <Text style={styles.seller}>Seller: {item.product.seller_name}</Text>
                    <Text style={styles.price}>
                        {parseInt(item.product.price).toLocaleString('vi-VN')} ₫
                    </Text>

                    <View style={styles.quantityRow}>
                        <TouchableOpacity onPress={() => updateQuantityLocal(item.id, -1)}>
                            <Text style={styles.quantityBtn}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantityLocal(item.id, +1)}>
                            <Text style={styles.quantityBtn}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    // Tính tổng tiền các món được chọn
    const calculateSelectedTotal = () => {
        if (!cart) return 0;
        return cart.items
            .filter(item => selectedItems.includes(item.id))
            .reduce((sum, item) => sum + parseInt(item.product.price) * item.quantity, 0);
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#4D5BFF" />
            </SafeAreaView>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.emptyText}>Giỏ hàng trống</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/ic_back.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Giỏ hàng</Text>
                <TouchableOpacity onPress={toggleSelectAll}>
                    <Text style={styles.selectAllText}>
                        Select All ({selectedItems.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={cart.items}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <View style={styles.bottomBar}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Tổng thanh toán</Text>
                    <Text style={styles.totalPrice}>
                        {calculateSelectedTotal().toLocaleString('vi-VN')} ₫
                    </Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton}>
                    <LinearGradient colors={['#4D5BFF', '#8FA8FF']} style={styles.checkoutGradient}>
                        <Text style={styles.checkoutText}>Thanh toán ({selectedItems.length})</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}