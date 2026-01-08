import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { styles } from './SideBar.styles';
import useAuth from '../Header/Header';

export default function SideBar() {
    const navigation = useNavigation<any>();
    const { token: authToken } = useAuth();

    const [userData, setUserData] = useState({
        name: 'Người dùng',
        email: '...',
        avatar: null
    });

    // 1. Fetch thông tin người dùng
    useEffect(() => {
        const fetchProfile = async () => {
            if (!authToken) return;
            try {
                const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
                    headers: { 'Authorization': `Token ${authToken}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData({
                        name: data.name || data.username || 'Người dùng',
                        email: data.email || 'Chưa cập nhật email',
                        avatar: data.avatar || null // Giả sử API trả về field avatar
                    });
                }
            } catch (err) {
                console.error('Lỗi lấy profile trong SideBar:', err);
            }
        };
        fetchProfile();
    }, [authToken]);

    const menuItems = [
        { title: 'Trang chủ', screen: 'Home', icon: require('../../assets/ic_home.png') },
        { title: 'Tài khoản', screen: 'Account', icon: require('../../assets/ic_user.png') },
        { title: 'Hoạt động', screen: 'Activity', icon: require('../../assets/ic_activity.png') },
        { title: 'Cửa hàng', screen: 'MyShop', icon: require('../../assets/ic_shop.png') },
        { title: 'Giỏ hàng', screen: 'Cart', icon: require('../../assets/ic_cart.png') },
        { title: 'Tìm kiếm', screen: 'Search', icon: require('../../assets/ic_search.png') },
        { title: 'Đăng xuất', screen: 'Login', icon: require('../../assets/ic_logout.png'), isLogout: true },
    ];

    const handleNavigate = (screen: string) => {
        navigation.navigate(screen);
    };

    const handleCloseSidebar = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4D5BFF" />

            <TouchableWithoutFeedback onPress={handleCloseSidebar}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <View style={styles.sidebarContent}>
                <LinearGradient colors={['#4D5BFF', '#8FA8FF']} style={styles.header}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={() => navigation.navigate('Account')}
                        activeOpacity={0.8}
                    >
                        {/* Kiểm tra nếu có ảnh từ API thì hiện, không thì hiện icon mặc định */}
                        <Image
                            source={userData.avatar
                                ? { uri: userData.avatar }
                                : require('../../assets/ic_user.png')
                            }
                            style={styles.avatar}
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName} numberOfLines={1}>{userData.name}</Text>
                            <Text style={styles.userEmail} numberOfLines={1}>{userData.email}</Text>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>

                <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.menuItem,
                                item.isLogout && styles.logoutItem,
                            ]}
                            onPress={() => handleNavigate(item.screen)}
                            activeOpacity={0.7}
                        >
                            <Image source={item.icon} style={[styles.menuIcon, item.isLogout && { tintColor: '#FF3B30' }]} />
                            <Text style={[
                                styles.menuText,
                                item.isLogout && styles.logoutText,
                            ]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>ReuseUni v1.0</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}