// SearchScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 cột kết quả tìm kiếm

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },

  // Header gradient
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backBtn: {
    padding: 4,
  },

  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },

  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  clearBtn: {
    padding: 8,
  },

  clearText: {
    fontSize: 20,
    color: '#aaa',
  },

  searchBtn: {
    marginLeft: 12,
  },

  searchBtnIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffffff',
  },

  // Nội dung mặc định
  defaultContainer: {
    paddingHorizontal: 16,
  },

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },

  // Category tags - đa màu
  categoryTag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 12,
  },

  categoryTagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // 3 sản phẩm rẻ nhất: 1 lớn trái + 2 nhỏ phải
  cheapestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cheapestBigCard: {
    width: '58%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },

  cheapestBigImage: {
    width: '100%',
    height: 180,
  },

  cheapestInfo: {
    padding: 12,
  },

  cheapestTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },

  cheapestPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4D5BFF',
  },

  cheapestSmallColumn: {
    width: '40%',
    justifyContent: 'space-between',
  },

  cheapestSmallCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },

  cheapestSmallImage: {
    width: '100%',
    height: 100,
  },

  cheapestSmallTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },

  cheapestSmallPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4D5BFF',
  },

  // Sản phẩm nổi bật
  featuredCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },

  featuredImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },

  featuredInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },

  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  featuredPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4D5BFF',
  },

  // Khi đang gõ vào ô tìm kiếm
  inputFocusedContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  historyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  historyItem: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
    marginBottom: 10,
  },

  historyText: {
    fontSize: 14,
    color: '#4D5BFF',
  },

  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },

  trendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  viewAllText: {
    fontSize: 15,
    color: '#4D5BFF',
  },

  trendingList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  trendingTag: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
    marginBottom: 10,
  },

  trendingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Kết quả tìm kiếm
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  resultsTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },

  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  filterIcon: {
    width: 18,
    height: 18,
    tintColor: '#4D5BFF',
    marginRight: 6,
  },

  filterText: {
    fontSize: 14,
    color: '#4D5BFF',
    fontWeight: '600',
  },

  resultColumnWrapper: {
    justifyContent: 'space-between',
  },

  resultCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },

  resultImage: {
    width: '100%',
    height: 180,
  },

  resultInfo: {
    padding: 12,
  },

  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },

  resultPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4D5BFF',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },

  emptyText: {
    fontSize: 18,
    color: '#999',
  },

  // Bottom Sheet Filter
  filterContainer: {
    padding: 20,
  },

  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  closeFilter: {
    fontSize: 32,
    color: '#999',
  },

  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },

  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },

  applyBtn: {
    backgroundColor: '#4D5BFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },

  applyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});