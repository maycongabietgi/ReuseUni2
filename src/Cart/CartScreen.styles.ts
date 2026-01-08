// CartScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    backIcon: {
        width: 24,
        height: 24,
        tintColor: '#333',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },

    selectAllText: {
        fontSize: 16,
        color: '#4D5BFF',
        fontWeight: '600',
    },

    // Item trong giỏ hàng
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginVertical: 6,
        marginHorizontal: 12,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },

    checkbox: {
        width: 24,
        height: 24,
        marginRight: 12,
    },

    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },

    info: {
        flex: 1,
        marginLeft: 12,
    },

    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },

    seller: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },

    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4D5BFF',
        marginBottom: 12,
    },

    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    quantityBtn: {
        fontSize: 24,
        color: '#4D5BFF',
        paddingHorizontal: 12,
    },

    quantity: {
        fontSize: 16,
        fontWeight: '600',
        minWidth: 30,
        textAlign: 'center',
    },

    // Empty state
    emptyText: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 100,
    },

    // Bottom Bar Tổng tiền + Thanh toán
    bottomBar: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    totalContainer: {
        flex: 1,
    },

    totalText: {
        fontSize: 16,
        color: '#666',
    },

    totalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4D5BFF',
        marginTop: 4,
    },

    checkoutButton: {
        marginLeft: 16,
    },

    checkoutGradient: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
    },

    checkoutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});