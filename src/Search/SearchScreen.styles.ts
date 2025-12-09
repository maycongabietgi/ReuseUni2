import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  searchBarInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d6f0ff60',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
  },
  searchIconWrap: {},
  searchIcon: {
    fontSize: 18,
  },
  container: {
    padding: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginLeft: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1B2136',
  },
  clearText: {
    color: '#4D5BFF',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(77,91,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  tagText: {
    color: '#2A3150',
    fontWeight: '600',
  },
  trendingTag: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  trendingText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyText: {
    color: '#9AA4D7',
    fontStyle: 'italic',
  },
});
