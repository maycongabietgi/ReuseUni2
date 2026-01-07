// HomeScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 cột, margin 16 mỗi bên

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
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

  menuIcon: {
    width: 28,
    height: 28,
    tintColor: '#4D5BFF',
  },

  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 20,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4D5BFF',
    marginRight: 12,
  },

  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  cartBtn: {
    position: 'relative',
  },

  cartIcon: {
    width: 32,
    height: 32,
    tintColor: '#4D5BFF',
  },

  badge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 3,
    borderColor: '#fff',
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Banner (cuộn bình thường)
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },

  banner: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bannerContent: {
    flex: 1,
  },

  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 8,
    opacity: 0.9,
  },

  bannerCallToAction: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
  },

  bannerImage: {
    width: 100,
    height: 100,
    opacity: 0.9,
  },

  // Card sản phẩm
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 8,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },

  imageContainer: {
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: 180,
  },

  cardContent: {
    padding: 14,
  },

  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  soldText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },

  progressContainer: {
    marginBottom: 12,
  },

  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4D5BFF',
  },

  row: {
    justifyContent: 'space-between',
  },

  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },

  // Loading & Empty
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },

  // Floating Search Button
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },

  floatingGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchIcon: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
});