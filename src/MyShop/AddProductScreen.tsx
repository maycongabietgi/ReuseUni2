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
import useAuth from '../components/Header/Header'; // Điều chỉnh path nếu cần

export default function AddProductScreen({ navigation }: any) {
  const { token: authToken } = useAuth();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Danh sách category (có thể fetch từ API sau này)
  const categories = [
    { label: 'Điện tử', value: '1' },
    { label: 'Thời trang', value: '2' },
    { label: 'Sách', value: '3' },
    { label: 'Đồ gia dụng', value: '4' },
    { label: 'Khác', value: '5' },
  ];

  // Request quyền truy cập ảnh
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
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !price.trim() || !description.trim() || !category || !imageUri) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('price', price.trim());
      formData.append('description', description.trim());
      formData.append('category', category);

      // Thêm ảnh
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
          // KHÔNG set 'Content-Type' khi dùng FormData
        },
        body: formData,
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errMsg = 'Không thể thêm sản phẩm';
        try {
          const errData = JSON.parse(responseText);
          errMsg = errData.detail ||
            errData.title?.[0] ||
            errData.price?.[0] ||
            errData.description?.[0] ||
            errData.category?.[0] ||
            errData.image?.[0] ||
            responseText;
        } catch { }
        throw new Error(errMsg);
      }

      const result = JSON.parse(responseText);
      Alert.alert('Thành công', 'Sản phẩm đã được đăng thành công!');

      navigation.goBack();

    } catch (err: any) {
      console.error('Add product error:', err);
      Alert.alert('Lỗi', err.message || 'Đã xảy ra lỗi khi đăng sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm sản phẩm</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Upload Image */}
        <TouchableOpacity onPress={pickImage} style={styles.imageBox} activeOpacity={0.8}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={40} color="#9ca3af" />
              <Text style={styles.placeholderText}>Thêm ảnh sản phẩm</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.label}>Tên sản phẩm</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Nhập tên sản phẩm"
          style={styles.input}
        />

        {/* Price */}
        <Text style={styles.label}>Giá (VNĐ)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Nhập giá"
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Category - Picker */}
        <Text style={styles.label}>Danh mục</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Chọn danh mục" value="" />
            {categories.map(cat => (
              <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Picker>
        </View>

        {/* Description */}
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Mô tả chi tiết sản phẩm..."
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={5}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={['#2D7FF9', '#4C9BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtn}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitText}>Đăng sản phẩm</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 18 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },

  imageBox: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  image: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center' },
  placeholderText: { color: '#9ca3af', fontSize: 16, marginTop: 8 },

  label: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  textArea: { height: 140, textAlignVertical: 'top' },

  submitBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 24,
  },
  gradientBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});