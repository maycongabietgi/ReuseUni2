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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import useAuth from '../components/Header/Header';

// Định nghĩa kiểu dữ liệu cho Category
interface Category {
  id: number;
  name: string;
}

export default function AddProductScreen({ navigation }: any) {
  const { token: authToken } = useAuth();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // Lưu ID của category chọn
  const [imageUri, setImageUri] = useState<string | null>(null);

  // State lưu danh sách categories từ API
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // 1. Fetch danh sách Category từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://bkapp-mp8l.onrender.com/categories/');
        if (!response.ok) throw new Error('Không thể tải danh mục');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Lỗi fetch categories:', err);
        Alert.alert('Lỗi', 'Không thể lấy danh sách danh mục sản phẩm');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // 2. Request quyền truy cập ảnh
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh để chọn ảnh');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Đổi thành 1:1 cho ảnh sản phẩm đẹp hơn
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !price.trim() || !description.trim() || !category || !imageUri) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin và chọn ảnh');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('price', price.trim());
      formData.append('description', description.trim());
      formData.append('category', category); // Gửi ID của category (ví dụ: "1")

      const filename = imageUri.split('/').pop() || 'product.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      const response = await fetch('https://bkapp-mp8l.onrender.com/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Không thể đăng sản phẩm. Vui lòng kiểm tra lại.');
      }

      Alert.alert('Thành công', 'Sản phẩm đã được đăng thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm sản phẩm</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={pickImage} style={styles.imageBox} activeOpacity={0.8}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera-outline" size={40} color="#9ca3af" />
              <Text style={styles.placeholderText}>Thêm ảnh sản phẩm</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Tên sản phẩm</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ví dụ: Giáo trình Giải tích 1"
          style={styles.input}
        />

        <Text style={styles.label}>Giá (VNĐ)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Nhập giá bán"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Danh mục</Text>
        <View style={styles.pickerWrapper}>
          {loadingCategories ? (
            <ActivityIndicator size="small" color="#2D7FF9" style={{ padding: 15 }} />
          ) : (
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn danh mục sản phẩm" value="" color="#9ca3af" />
              {categories.map((cat) => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
              ))}
            </Picker>
          )}
        </View>

        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Tình trạng sách, độ mới, nội dung..."
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={5}
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={['#2D7FF9', '#4C9BFF']}
            style={styles.gradientBtn}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitText}>Đăng sản phẩm ngay</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 18 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  imageBox: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed', // Tạo hiệu ứng nét đứt cho phần chọn ảnh
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  image: { width: '100%', height: '100%', borderRadius: 12 },
  placeholder: { alignItems: 'center' },
  placeholderText: { color: '#9ca3af', fontSize: 14, marginTop: 8 },
  label: { fontSize: 14, color: '#4B5563', marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: { height: 50, width: '100%' },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitBtn: { borderRadius: 10, overflow: 'hidden', marginTop: 10, marginBottom: 30 },
  gradientBtn: { paddingVertical: 15, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});