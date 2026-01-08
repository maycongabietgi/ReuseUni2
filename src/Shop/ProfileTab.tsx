import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function StoreProfileTab({ sellerId }: { sellerId: number | null }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;
    const fetchData = async () => {
      try {
        const [revRes, statRes] = await Promise.all([
          fetch(`https://bkapp-mp8l.onrender.com/users/${sellerId}/reviews`),
          fetch(`https://bkapp-mp8l.onrender.com/reviews/stats/${sellerId}`)
        ]);
        setReviews(await revRes.json());
        setStats(await statRes.json());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sellerId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} color="#2D7FF9" />;

  return (
    <ScrollView style={{ flex: 1 }}>
      {stats && (
        <View style={styles.ratingSection}>
          <View style={styles.ratingHeader}>
            <Text style={styles.ratingValue}>{stats.avg_rating?.toFixed(1)}</Text>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingLabel}>{stats.total_reviews} đánh giá</Text>
          </View>
          <View style={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = stats.distribution?.[star] || 0;
              const percent = stats.total_reviews ? (count / stats.total_reviews) * 100 : 0;
              return (
                <View key={star} style={styles.barRow}>
                  <Text style={{ width: 15 }}>{star}</Text>
                  <View style={styles.barBG}><View style={[styles.barFill, { width: `${percent}%` }]} /></View>
                  <Text style={{ width: 25, textAlign: 'right' }}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <Text style={styles.title}>Đánh giá từ người mua</Text>
      {reviews.map((item: any) => (
        <View key={item.id} style={styles.reviewBox}>
          <Text style={styles.reviewer}>{item.reviewer_name}</Text>
          <View style={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Ionicons key={i} name="star" size={12} color={i < item.rating ? "#FFD700" : "#eee"} />
            ))}
          </View>
          <Text style={styles.comment}>{item.comment}</Text>
          <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ratingSection: { flexDirection: 'row', padding: 15, backgroundColor: '#f9f9f9', borderRadius: 12 },
  ratingHeader: { alignItems: 'center', justifyContent: 'center', width: '35%' },
  ratingValue: { fontSize: 32, fontWeight: '800', color: '#2D7FF9' },
  ratingLabel: { fontSize: 12, color: '#888', marginTop: 5 },
  ratingBars: { flex: 1, marginLeft: 20 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  barBG: { flex: 1, height: 6, backgroundColor: '#eee', borderRadius: 3, marginHorizontal: 8 },
  barFill: { height: '100%', backgroundColor: '#2D7FF9', borderRadius: 3 },
  title: { fontSize: 16, fontWeight: '700', marginVertical: 15 },
  reviewBox: { padding: 15, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  reviewer: { fontWeight: '600', fontSize: 14 },
  stars: { flexDirection: 'row', marginVertical: 4 },
  comment: { color: '#444', lineHeight: 20 },
  date: { fontSize: 11, color: '#bbb', marginTop: 8 }
});