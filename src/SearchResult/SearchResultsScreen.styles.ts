import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F7FB',
    },
    header: {
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        marginHorizontal: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    moreBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
    },
    sortFilterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    sortText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    filterIcon: {
        width: 16,
        height: 16,
        marginRight: 6,
        tintColor: '#1B2136',
    },
    filterText: {
        fontSize: 14,
        color: '#1B2136',
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        width: '48%',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    productImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    info: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1B2136',
        lineHeight: 20,
    },
    description: {
        fontSize: 12,
        color: '#9AA4D7',
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    currentPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FF4D4D',
    },
    oldPrice: {
        fontSize: 12,
        color: '#9AA4D7',
        textDecorationLine: 'line-through',
        marginLeft: 6,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    rating: {
        fontSize: 13,
        color: '#FFD700',
    },
    reviewCount: {
        fontSize: 12,
        color: '#9AA4D7',
        marginLeft: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});