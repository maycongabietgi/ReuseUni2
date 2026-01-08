import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from '../components/Header/Header'; // Điều chỉnh path nếu cần

export default function ReviewScreen({ navigation, route }: any) {
  const { token: authToken } = useAuth();
  const { tradeId: rawTradeId } = route.params || {};

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch tên từ profile (/api/me/)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập để đánh giá');
        navigation.goBack();
        return;
      }

      try {
        const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
          headers: {
            'Authorization': `Token ${authToken}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Không thể tải thông tin người dùng');
        }

        const data = await response.json();
        setName(data.name || data.username || 'Người dùng');
      } catch (err) {
        console.error('Lỗi fetch profile:', err);
        setName('Người dùng');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  const handleSubmit = async () => {
    const orderId = Number(rawTradeId);
    const roundedRating = Math.round(rating); // Làm tròn thành integer

    if (isNaN(orderId) || orderId <= 0) {
      Alert.alert('Lỗi', 'ID đơn hàng không hợp lệ');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đánh giá của bạn');
      return;
    }

    if (roundedRating < 1 || roundedRating > 5) {
      Alert.alert('Lỗi', 'Điểm đánh giá phải từ 1 đến 5');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://bkapp-mp8l.onrender.com/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          rating: roundedRating,
          comment: comment.trim(),
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errMsg = 'Không thể gửi đánh giá';
        try {
          const errData = JSON.parse(responseText);

          // Xử lý lỗi đặc biệt từ backend
          if (errData.error && errData.error.includes('đã được đánh giá')) {
            Alert.alert(
              'Thông báo',
              'Đơn hàng này đã được đánh giá rồi!\nBạn không thể gửi đánh giá thêm.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
            return;
          }

          // Các lỗi khác
          errMsg = errData.error ||
            errData.non_field_errors?.[0] ||
            errData.order_id?.[0] ||
            errData.rating?.[0] ||
            errData.comment?.[0] ||
            errData.detail ||
            responseText ||
            'Lỗi server';
        } catch {
          errMsg = responseText || 'Lỗi server';
        }

        Alert.alert('Lỗi', errMsg);
        return;
      }

      const result = JSON.parse(responseText);
      Alert.alert('Thành công', result.message || 'Đánh giá đã được gửi!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
      Alert.alert('Lỗi', msg);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5565FB" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Name - Khóa, lấy từ profile */}
        <Text style={styles.label}>Tên của bạn</Text>
        <TextInput style={[styles.input, styles.disabledInput]} value={name} editable={false} />

        {/* Experience */}
        <Text style={styles.label}>Trải nghiệm của bạn như thế nào?</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mô tả trải nghiệm của bạn..."
          multiline
          numberOfLines={5}
          value={comment}
          onChangeText={setComment}
        />

        {/* Star Rating */}
        <Text style={styles.label}>Điểm đánh giá</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={5}
          step={0.5}
          value={rating}
          minimumTrackTintColor="#5565FB"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#5565FB"
          onValueChange={setRating}
        />
        <Text style={styles.ratingValue}>{rating.toFixed(1)} / 5.0</Text>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtnWrapper, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={['#5565FB', '#5599FB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0.8 }}
            style={styles.submitBtn}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitText}>Gửi đánh giá</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#000' },

  label: { fontSize: 15, fontWeight: '600', color: '#000', marginBottom: 8 },
  input: {
    backgroundColor: '#F7F8FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E8F0',
  },
  disabledInput: {
    backgroundColor: '#EDEDED',
    color: '#666',
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  ratingValue: {
    textAlign: 'right',
    color: '#5565FB',
    fontWeight: '600',
    marginBottom: 24,
  },

  submitBtnWrapper: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});