// SearchScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },

  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconImage: {
    width: 20,
    height: 20,
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 10,
  },

  resultTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 12,
  },

  resultHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },

  // Category list
  categoryList: {
    marginVertical: 20,
    paddingHorizontal: 8,
  },

  trendingTag: {
    backgroundColor: '#4D5BFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trendingText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },

  // Search results
  sortFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },

  sortText: {
    fontSize: 15,
    color: '#1B2136',
    fontWeight: '500',
  },

  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4D5BFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  filterIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
    marginRight: 6,
  },

  filterText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  resultListContainer: {
    padding: 16,
    paddingTop: 8,
  },

  resultColumnWrapper: {
    justifyContent: 'space-between',
  },

  resultProductCard: {
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

  resultProductImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },

  resultInfo: {
    padding: 12,
  },

  resultProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2136',
    lineHeight: 20,
  },

  categoryName: {
    fontSize: 12,
    color: '#4D5BFF',
    marginTop: 4,
    fontWeight: '500',
  },

  resultCurrentPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF4D4D',
    marginTop: 6,
  },

  conditionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  descriptionText: {
    fontSize: 12,
    color: '#9AA4D7',
    marginTop: 6,
    lineHeight: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
  },

  // Filter Bottom Sheet
  filterSheetContainer: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },

  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B2136',
  },

  closeText: {
    fontSize: 28,
    color: '#000',
  },

  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B2136',
    marginTop: 20,
    marginBottom: 12,
  },

  priceSliderContainer: {
    marginBottom: 30,
  },

  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  priceLabel: {
    fontSize: 14,
    color: '#1B2136',
    fontWeight: '600',
  },

  applyBtn: {
    backgroundColor: '#4D5BFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },

  applyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});