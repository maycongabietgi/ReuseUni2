import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { styles } from './SearchScreen.styles';

// Type-safe navigation
type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Search'
>;

type Props = {
  navigation: SearchScreenNavigationProp;
};

export default function SearchScreen({ navigation }: Props) {
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    fetchSearchHistory();
    fetchTrendingSearches();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await fetch('https://your-api.com/api/search/history');
      const data = await response.json();
      setSearchHistory(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchTrendingSearches = async () => {
    try {
      setLoadingTrending(true);
      const response = await fetch('https://your-api.com/api/search/trending');
      const data = await response.json();
      setTrendingSearches(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTrending(false);
    }
  };

  const renderTag = (item: string | { label: string }, index: number) => {
    const label = typeof item === 'string' ? item : item.label ?? String(item);
    return (
      <TouchableOpacity
        key={`${label}-${index}`}
        style={styles.tag}
        onPress={() => setSearchText(label)}
        activeOpacity={0.75}>
        <Text style={styles.tagText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderTrendingTag = ({ item }: { item: any }) => {
    const label = item.label ?? item;
    const bg = item.color ?? '#4D5BFF';
    return (
      <TouchableOpacity
        style={[styles.trendingTag, { backgroundColor: bg }]}
        onPress={() => setSearchText(label)}
        activeOpacity={0.85}>
        <Text style={styles.trendingText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#5D7CFF', '#8FA8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.searchBarInHeader}>
          <TextInput
            style={styles.input}
            placeholder="Search products, brands..."
            placeholderTextColor="#9AA4D7"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchIconWrap}
            onPress={() => console.log('Searching', searchText)}
            activeOpacity={0.8}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Search History</Text>
              {searchHistory.length > 0 && (
                <TouchableOpacity onPress={() => setSearchHistory([])}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            {loadingHistory ? (
              <ActivityIndicator size="small" color="#4D5BFF" />
            ) : searchHistory.length > 0 ? (
              <View style={styles.tagsContainer}>
                {searchHistory.map((item, idx) => renderTag(item, idx))}
              </View>
            ) : (
              <Text style={styles.emptyText}>Không có lịch sử tìm kiếm</Text>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Searches</Text>
              {trendingSearches.length > 0 && (
                <TouchableOpacity>
                  <Text style={styles.clearText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>
            {loadingTrending ? (
              <ActivityIndicator size="small" color="#4D5BFF" />
            ) : trendingSearches.length > 0 ? (
              <FlatList
                data={trendingSearches}
                renderItem={renderTrendingTag}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.emptyText}>Không có xu hướng nổi bật</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
