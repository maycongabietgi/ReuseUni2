// SideBar.tsx
import React from 'react';
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

export default function SideBar() {
    const navigation = useNavigation<any>();

    const menuItems = [
        { title: 'Trang chủ', screen: 'Home', icon: require('../../assets/ic_home.png') },
        { title: 'Tài khoản', screen: 'Account', icon: require('../../assets/ic_user.png') },
        { title: 'Hoạt động', screen: 'Activity', icon: require('../../assets/ic_activity.png') },
        { title: 'Cửa hàng của tôi', screen: 'MyShop', icon: require('../../assets/ic_shop.png') },
        { title: 'Giỏ hàng', screen: 'Cart', icon: require('../../assets/ic_cart.png') },
        { title: 'Tìm kiếm', screen: 'Search', icon: require('../../assets/ic_search.png') },
        { title: 'Đăng xuất', screen: 'Login', icon: require('../../assets/ic_logout.png'), isLogout: true },
    ];

    const handleNavigate = (screen: string) => {
        navigation.navigate(screen);
    };

    // Hàm đóng SideBar khi bấm ra ngoài
    const handleCloseSidebar = () => {
        // Nếu bạn dùng React Navigation Drawer
        navigation.closeDrawer?.(); // Ưu tiên cách này nếu có drawer

        // Nếu dùng Stack Navigator thủ công (push SideBar như màn hình bình thường)
        // thì dùng goBack
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4D5BFF" />

            {/* Background trong suốt để bắt sự kiện bấm ra ngoài */}
            <TouchableWithoutFeedback onPress={handleCloseSidebar}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            {/* Nội dung SideBar thực tế (chặn sự kiện lan tỏa) */}
            <View style={styles.sidebarContent} pointerEvents="box-none">
                {/* Header gradient */}
                <LinearGradient colors={['#4D5BFF', '#8FA8FF']} style={styles.header}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={() => navigation.navigate('Account')}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require('../../assets/ic_user.png')}
                            style={styles.avatar}
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>Tester</Text>
                            <Text style={styles.userEmail}>test@example.com</Text>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Menu */}
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
                            <Image source={item.icon} style={styles.menuIcon} />
                            <Text style={[
                                styles.menuText,
                                item.isLogout && styles.logoutText,
                            ]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>ReuseUni v1.0</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}