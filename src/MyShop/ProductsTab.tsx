import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../components/Header/Header'; // Điều chỉnh path nếu cần

type NavProp = any; // Thay bằng NativeStackNavigationProp nếu dùng type
type Props = { navigation: NavProp };

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  status: 'AV' | 'SL';
  description?: string;
}

export default function ProductsTab({ navigation }: Props) {
  const { token: authToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Fetch user ID từ /api/me/
  useEffect(() => {
    const fetchUserId = async () => {
      if (!authToken) {
        setError('Vui lòng đăng nhập để xem sản phẩm');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
          method: 'GET',
          headers: {
            Authorization: `Token ${authToken}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Lỗi ${response.status}: ${errText}`);
        }

        const data = await response.json();
        setUserId(data.id); // Lấy ID người dùng hiện tại
      } catch (err: any) {
        console.error('Lỗi fetch user ID:', err);
        setError(err.message || 'Không thể xác định người dùng');
      }
    };

    fetchUserId();
  }, [authToken]);

  // Fetch sản phẩm khi có userId
  useEffect(() => {
    if (!userId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://bkapp-mp8l.onrender.com/products/?seller=${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Token ${authToken}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Lỗi ${response.status}: ${errText}`);
        }

        const data = await response.json();
        setProducts(data.results || []);
      } catch (err: any) {
        console.error('Lỗi fetch sản phẩm:', err);
        setError(err.message || 'Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId, authToken]);

  const handleSaveEdit = () => {
    if (!editing) return;

    // TODO: Gọi API PATCH /products/{id}/ để cập nhật thực tế
    // Hiện tại: Chỉ update local state (giả lập)
    setProducts(prev =>
      prev.map(p => (p.id === editing.id ? { ...editing } : p))
    );
    setEditing(null);
    Alert.alert('Thành công', 'Đã cập nhật sản phẩm (giả lập)');
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sản phẩm này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            // TODO: Gọi API DELETE /products/{id}/
            setProducts(prev => prev.filter(p => p.id !== id));
            Alert.alert('Thành công', 'Sản phẩm đã được xóa (giả lập)');
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.card, item.status === 'SL' && styles.soldCard]}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={[styles.name, item.status === 'SL' && { color: '#999' }]}>
        {item.title}
      </Text>
      <Text style={[styles.price, item.status === 'SL' && { color: '#aaa' }]}>
        {Number(item.price).toLocaleString('vi-VN')} ₫
      </Text>

      {item.status === 'AV' && (
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => setEditing(item)}>
            <Ionicons name="create-outline" size={20} color="#475DFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#FF4757" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const available = products.filter(p => p.status === 'AV');
  const sold = products.filter(p => p.status === 'SL');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D7FF9" />
        <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => window.location.reload()}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>Đang bán</Text>
      <FlatList
        data={available}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={renderProduct}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có sản phẩm nào đang bán</Text>}
      />

      <Text style={styles.sectionTitle}>Đã bán</Text>
      <FlatList
        data={sold}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={renderProduct}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có sản phẩm nào đã bán</Text>}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal Edit Product */}
      <Modal
        visible={!!editing}
        transparent
        animationType="fade"
        onRequestClose={() => setEditing(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Chỉnh sửa sản phẩm</Text>

            <TextInput
              style={styles.input}
              value={editing?.title ?? ''}
              onChangeText={t => {
                if (editing) setEditing({ ...editing, title: t });
              }}
              placeholder="Tên sản phẩm"
            />

            <TextInput
              style={styles.input}
              value={editing?.price ?? ''}
              onChangeText={t => {
                if (editing) setEditing({ ...editing, price: t });
              }}
              placeholder="Giá (VNĐ)"
              keyboardType="numeric"
            />

            <View style={styles.statusRow}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  editing?.status === 'AV' && styles.activeStatus,
                ]}
                onPress={() => {
                  if (editing) setEditing({ ...editing, status: 'AV' });
                }}
              >
                <Text style={[styles.statusText, editing?.status === 'AV' && styles.activeStatusText]}>
                  Đang bán
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  editing?.status === 'SL' && styles.activeStatus,
                ]}
                onPress={() => {
                  if (editing) setEditing({ ...editing, status: 'SL' });
                }}
              >
                <Text style={[styles.statusText, editing?.status === 'SL' && styles.activeStatusText]}>
                  Đã bán
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#E5E7EB' }]}
                onPress={() => setEditing(null)}
              >
                <Text style={{ color: '#333' }}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#2D7FF9' }]}
                onPress={handleSaveEdit}
              >
                <Text style={{ color: '#fff' }}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: '#444',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  soldCard: { opacity: 0.65, backgroundColor: '#f8f8f8' },
  image: { width: '100%', height: 140, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  price: { fontSize: 14, color: '#475DFF', fontWeight: '700' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#2D7FF9',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D7FF9',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  activeStatus: {
    backgroundColor: '#E8F1FF',
    borderColor: '#2D7FF9',
  },
  statusText: { color: '#555', fontWeight: '500', fontSize: 14 },
  activeStatusText: { color: '#2D7FF9', fontWeight: '600' },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 6,
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
    marginTop: 20,
  },
});