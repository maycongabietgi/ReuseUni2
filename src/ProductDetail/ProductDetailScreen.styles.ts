// ProductDetailScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto', // đẩy cả cụm sang phải
    },


    headerButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },

    backIcon: {
        width: 24,
        height: 24,
        tintColor: '#333',
    },

    // Ảnh sản phẩm
    imageWrapper: {
        width: width,
        height: width * 1.1, // Tỷ lệ gần vuông, hơi cao một chút
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
    },

    productImage: {
        width: '100%',
        height: '100%',
    },

    // Thông tin sản phẩm
    info: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 100, // Để tránh bị bottom bar che
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
    },

    price: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#f02323ff',
        marginBottom: 12,
    },

    sellerName: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    rowDescription: {
        paddingVertical: 12,
    },

    label: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },

    value: {
        fontSize: 13,
        color: '#333',
        flex: 2,
        textAlign: 'right',
        fontWeight: '500',
    },

    // Bottom Action Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },

    chatButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        marginRight: 12,
    },

    chatIcon: {
        width: 24,
        height: 24,
        tintColor: '#4D5BFF',
        marginRight: 8,
    },

    chatText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4D5BFF',
    },

    buyButtonWrapper: {
        flex: 2,
    },

    buyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },

    buyIcon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
        marginRight: 10,
    },

    buyText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
    },

    // Disabled state
    disabledButton: {
        opacity: 0.5,
    },

    disabledText: {
        color: '#999',
    },
});