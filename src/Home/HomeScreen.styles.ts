import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff'
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20, // Khoảng cách từ menu đến cụm avatar
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 18,
  },
  cartBtn: {
    marginLeft: 18,
    position: 'relative',
  },
  menuIcon: { width: 28, height: 28, tintColor: '#4D5BFF' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#4D5BFF',
    marginRight: 12, // Khoảng cách avatar đến chữ Chào
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: 140
  },
  cartIcon: { width: 30, height: 30, tintColor: '#4D5BFF' },

  badge: {
    position: 'absolute',
    right: -6, top: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 11,
    minWidth: 22, height: 22,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  // Banner
  bannerContainer: {
    margin: 16,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 5,
  },
  banner: {
    flexDirection: 'row',
    padding: 25,
    alignItems: 'center'
  },
  bannerContent: { flex: 1 },
  bannerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  bannerSubtitle: { fontSize: 16, color: '#fff', marginTop: 6 },
  bannerCallToAction: { fontSize: 14, color: '#fff', fontWeight: '700', marginTop: 10 },
  bannerImage: { width: 100, height: 100 },

  // Section Header (Những sản phẩm mới)
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4D5BFF',
    fontWeight: '600',
  },

  // Card sản phẩm
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imageContainer: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18
  },
  productImage: {
    width: '100%',
    height: 190, // Tăng chiều cao ảnh
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18
  },
  cardContent: { padding: 14 },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    height: 44
  },
  priceText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4D5BFF',
    marginTop: 8
  },

  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  listContainer: {
    paddingBottom: 120
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Floating Search
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30
  },
  floatingGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  searchIcon: { width: 30, height: 30, tintColor: '#fff' },
});