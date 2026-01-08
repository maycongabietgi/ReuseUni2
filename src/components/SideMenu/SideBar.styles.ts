// SideBar.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9ff',
    },

    // Header gradient với avatar
    header: {
        padding: 20,
        paddingTop: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },

    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#fff',
    },

    userInfo: {
        marginLeft: 16,
    },

    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },

    userEmail: {
        fontSize: 14,
        color: '#E0E7FF',
        marginTop: 4,
    },

    // Menu
    menuContainer: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },

    logoutItem: {
        marginTop: 20,
        backgroundColor: '#FFF0F0',
        borderWidth: 1,
        borderColor: '#FFD8D8',
    },

    menuIcon: {
        width: 24,
        height: 24,
        tintColor: '#4D5BFF',
    },

    menuText: {
        flex: 1,
        marginLeft: 16,
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
    },

    logoutText: {
        color: '#D32F2F',
        fontWeight: 'bold',
    },

    chevron: {
        width: 20,
        height: 20,
        tintColor: '#AAA',
    },

    // Footer
    footer: {
        padding: 20,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },

    footerText: {
        fontSize: 14,
        color: '#888',
    },

    quote: {
        marginTop: 8,
        fontSize: 15,
        fontStyle: 'italic',
        color: '#4D5BFF',
        textAlign: 'center',
    },
    // Thêm vào file styles hiện tại
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Nền mờ khi mở sidebar (tùy chọn)
    },

    sidebarContent: {
        flex: 1,
        width: '80%', // Chiều rộng sidebar (có thể chỉnh 75%-85%)
        backgroundColor: '#f8f9ff',
        // Nếu muốn sidebar từ trái sang
        // position: 'absolute',
        // left: 0,
        // top: 0,
        // bottom: 0,
    },
});