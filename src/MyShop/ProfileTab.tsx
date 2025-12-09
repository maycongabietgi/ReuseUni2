import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type RatingStats = {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
};

type ReviewType = {
  id: number;
  text: string;
  stars: number;
  time: string;
  user?: string;
};

const ratingStats: RatingStats = {
  5: 48,
  4: 12,
  3: 4,
  2: 1,
  1: 5,
};

const reviews: ReviewType[] = [
  {
    id: 1,
    text: "Bought a backpack and it's super clean!",
    stars: 5,
    time: '5 hours ago',
  },
  {
    id: 2,
    text: 'Seller is very friendly and quick to respond.',
    stars: 4,
    time: '8 hours ago',
  },
  {
    id: 3,
    text: 'Good value for second-hand goods.',
    stars: 4,
    time: '1 day ago',
  },
  {
    id: 4,
    text: 'The product looked exactly like the photo!',
    stars: 5,
    time: '2 days ago',
  },
  {
    id: 5,
    text: 'Fast delivery and well-packed item!',
    stars: 5,
    time: '3 days ago',
  },
];

export default function StoreProfileTab() {
  const [stats] = useState<RatingStats>(ratingStats);
  const [reviewList] = useState<ReviewType[]>(reviews);

  const averageRating = useMemo(() => {
    const totalVotes = Object.values(stats).reduce((a, b) => a + b, 0);
    const weightedSum = Object.entries(stats).reduce(
      (sum, [star, count]) => sum + Number(star) * count,
      0,
    );
    return totalVotes ? (weightedSum / totalVotes).toFixed(1) : '0.0';
  }, [stats]);

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 10, flex: 1 }}
      >
        {/* Followers */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1,248</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Ratings */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.ratingValue}>{averageRating}</Text>
              <Ionicons
                name="star"
                size={10}
                color="#2D7FF9"
                style={{ marginLeft: 4 }}
              />
            </View>
            <Text style={styles.ratingLabel}>Ratings</Text>
          </View>

          <View style={styles.ratingBars}>
            {Object.entries(stats)
              .reverse()
              .map(([star, count]) => {
                const total = Object.values(stats).reduce((a, b) => a + b, 0);
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
                  </View>
                );
              })}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.reviewsSection}>
          {reviewList.map(r => (
            <View key={r.id} style={styles.reviewBox}>
              <Text style={styles.reviewText}>{r.text}</Text>

              {/* Stars */}
              <View style={styles.starRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < r.stars ? 'star' : 'star-outline'}
                    size={14}
                    color="#2D7FF9"
                  />
                ))}
              </View>

              <Text style={styles.timeText}>{r.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ========================
   🎨 Styles
======================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'column',
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

  ratingSection: { marginTop: 4, flexDirection: 'row', alignItems: 'center' },
  ratingHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2D7FF9',
  },
  ratingLabel: {
    fontSize: 15,
    color: '#9B9EA9',
  },
  ratingBars: { marginTop: 6, flex: 1 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  starText: { width: 18, textAlign: 'center', fontSize: 13, color: '#555' },
  barBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E8EAF0',
    borderRadius: 4,
    marginLeft: 8,
    overflow: 'hidden',
  },
  barFill: { height: 6, borderRadius: 4 },

  reviewsSection: { marginTop: 26 },
  reviewBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderColor: '#C9CFE5',
    borderWidth: 1,
    shadowColor: '#b2b8cdff',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 2,
    gap: 2,
  },
  reviewText: { fontSize: 14, color: '#333', marginBottom: 4 },
  timeText: { fontSize: 12, color: '#777', textAlign: 'right' },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  msgBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2D7FF9',
    borderRadius: 25,
    paddingVertical: 10,
    marginRight: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgText: { color: '#2D7FF9', fontWeight: '600', marginLeft: 6 },
  moreBtn: {
    flex: 1,
    backgroundColor: '#2D7FF9',
    borderRadius: 25,
    paddingVertical: 10,
    marginLeft: 6,
    alignItems: 'center',
  },
  moreText: { color: '#fff', fontWeight: '600' },
});
