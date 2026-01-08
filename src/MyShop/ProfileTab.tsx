import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from '../components/Header/Header'; // Điều chỉnh path nếu cần

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
  product_info: string;
}

interface RatingStats {
  avg_rating: number;
  total_reviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface UserProfile {
  id: number;
  name: string;
  // Các field khác nếu cần
}

export default function StoreProfileTab() {
  const { token: authToken } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bước 1: Lấy ID người dùng hiện tại từ /api/me/
  useEffect(() => {
    const fetchUserId = async () => {
      if (!authToken) {
        setError('Vui lòng đăng nhập để xem đánh giá');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
          headers: {
            Authorization: `Token ${authToken}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Lỗi ${response.status}`);
        }

        const data: UserProfile = await response.json();
        setUserId(data.id);
      } catch (err: any) {
        console.error('Lỗi fetch user ID:', err);
        setError(err.message || 'Không thể xác định người dùng');
      }
    };

    fetchUserId();
  }, [authToken]);

  // Bước 2: Fetch reviews & stats khi có userId
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch reviews
        const reviewsRes = await fetch(`https://bkapp-mp8l.onrender.com/users/${userId}/reviews`, {
          headers: {
            Authorization: `Token ${authToken}`,
            Accept: 'application/json',
          },
        });

        if (!reviewsRes.ok) throw new Error(`Lỗi reviews: ${reviewsRes.status}`);

        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData || []);

        // Fetch stats
        const statsRes = await fetch(`https://bkapp-mp8l.onrender.com/reviews/stats/${userId}`, {
          headers: {
            Authorization: `Token ${authToken}`,
            Accept: 'application/json',
          },
        });

        if (!statsRes.ok) throw new Error(`Lỗi stats: ${statsRes.status}`);

        const statsData = await statsRes.json();
        setStats(statsData);
      } catch (err: any) {
        console.error('Lỗi fetch đánh giá:', err);
        setError(err.message || 'Không thể tải đánh giá');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, userId]);

  const averageRating = useMemo(() => {
    if (!stats) return '0.0';
    return stats.avg_rating.toFixed(1);
  }, [stats]);

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewBox}>
      <Text style={styles.reviewText}>{item.comment}</Text>

      <View style={styles.starRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={i < item.rating ? 'star' : 'star-outline'}
            size={14}
            color="#2D7FF9"
          />
        ))}
      </View>

      <Text style={styles.timeText}>
        {new Date(item.created_at).toLocaleString('vi-VN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </Text>

      <Text style={styles.reviewerText}>Từ: {item.reviewer_name}</Text>
      <Text style={styles.productInfo}>Sản phẩm: {item.product_info}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D7FF9" />
        <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Chưa có đánh giá nào'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Followers & Stats */}
        {/* <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1,248</Text>
            <Text style={styles.statLabel}>Người theo dõi</Text>
          </View>
        </View> */}

        <View style={styles.divider} />

        {/* Ratings */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.ratingValue}>{averageRating}</Text>
              <Ionicons name="star" size={18} color="#2D7FF9" style={{ marginLeft: 6 }} />
            </View>
            <Text style={styles.ratingLabel}>
              {stats.total_reviews} đánh giá
            </Text>
          </View>

          <View style={styles.ratingBars}>
            {([5, 4, 3, 2, 1] as const).map(star => {
              const count = stats.distribution[star];
              const total = stats.total_reviews;
              const percentage = total ? (count / total) * 100 : 0;
              return (
                <View key={star} style={styles.barRow}>
                  <Text style={styles.starText}>{star}</Text>
                  <View style={styles.barBackground}>
                    <LinearGradient
                      colors={['#5565FB', '#5599FB']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.barFill, { width: `${percentage}%` }]}
                    />
                  </View>
                  <Text style={styles.barCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>Đánh giá gần đây</Text>

          <FlatList
            data={reviews}
            keyExtractor={item => item.id.toString()}
            renderItem={renderReview}
            ListEmptyComponent={<Text style={styles.emptyText}>Chưa có đánh giá nào</Text>}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '600' },
  statLabel: { color: '#777', fontSize: 13 },

  divider: { height: 1, backgroundColor: '#eee', marginVertical: 14 },

  ratingSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  ratingHeader: {
    width: '30%',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D7FF9',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#9B9EA9',
    marginTop: 4,
  },
  ratingBars: {
    flex: 1,
    marginLeft: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starText: {
    width: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8EAF0',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: { height: '100%', borderRadius: 4 },
  barCount: { fontSize: 12, color: '#777', width: 30, textAlign: 'right' },

  reviewsSection: { marginTop: 24 },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  reviewBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  starRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  reviewerText: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  productInfo: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    fontStyle: 'italic',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F94D4D',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 40,
  },
});