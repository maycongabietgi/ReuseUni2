// ProductDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import useAuth from '../components/Header/Header'; // Đường dẫn đúng đến file useAuth của bạn
import { styles } from './ProductDetailScreen.styles';

interface Product {
    id: number;
    title: string;
    price: string;
    image: string;
    description: string;
    category_name: string;
    condition_display: string;
}

export default function ProductDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const productId = route.params?.productId;

    const { token: authToken, loading: authLoading } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        if (!productId) {
            Alert.alert('Lỗi', 'Không có ID sản phẩm');
            navigation.goBack();
            return;
        }

        if (authLoading) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://bkapp-mp8l.onrender.com/products/${productId}/`);

                if (!response.ok) {
                    console.error('Lỗi response:', response.status, response.statusText);
                    throw new Error('Không thể tải sản phẩm');
                }

                const data: Product = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Lỗi fetch sản phẩm:', error);
                Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm. Vui lòng thử lại.');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, authToken, authLoading, navigation]);

    const handleChat = () => {
        Alert.alert('Chat', 'Chức năng chat với người bán sắp ra mắt!');
    };

    const handleAddToCart = async () => {
        if (!product || !authToken) return;

        setAddingToCart(true);

        try {
            const response = await fetch('https://bkapp-mp8l.onrender.com/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: 1,
                }),
            });

            const result = await response.json();
            console.log(result);

            if (response.ok && result.message === 'Đã thêm vào giỏ hàng') {
                Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng!', [
                    { text: 'OK' },
                    { text: 'Xem giỏ hàng', onPress: () => navigation.navigate('Cart') },
                ]);
            } else {
                Alert.alert('Lỗi', result.message || 'Không thể thêm vào giỏ hàng');
            }
        } catch (error) {
            console.error('Lỗi thêm vào giỏ hàng:', error);
            Alert.alert('Lỗi mạng', 'Không thể kết nối đến máy chủ. Vui lòng thử lại.');
        } finally {
            setAddingToCart(false);
        }
    };

    // Loading
    if (authLoading || loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#4D5BFF" />
            </SafeAreaView>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Image source={require('../assets/ic_back.png')} style={styles.backIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.navigate('Cart')}
                >
                    <Image
                        source={require('../assets/ic_bag.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Ảnh sản phẩm */}
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
                </View>

                {/* Thông tin */}
                <View style={styles.info}>
                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.price}>
                        {product.price ? parseInt(product.price).toLocaleString('vi-VN') + ' ₫' : ''}
                    </Text>

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
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={require('../assets/ic_cart.png')} style={styles.buyIcon} />
                                <Text style={styles.buyText}>Thêm vào giỏ hàng</Text>
                            </View>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
