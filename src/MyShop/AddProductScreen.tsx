import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type ShopSettingsNavProp = NativeStackNavigationProp<RootStackParamList, 'ShopSettings'>;
type Props = {
  navigation: ShopSettingsNavProp;
};

export default function AddProductScreen({ navigation }: Props) {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // Giả lập việc chọn ảnh (bạn có thể thay bằng picker thật sau này)
  const handlePickImage = () => {
    // set hình mẫu (tạm thời)
    setImage('https://i.imgur.com/ZcLLrkY.png');
  };

  const handleSubmit = () => {
    if (!name || !price) return;
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Upload Image */}
        <TouchableOpacity
          onPress={handlePickImage}
          style={styles.imageBox}
          activeOpacity={0.8}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={32} color="#9ca3af" />
              <Text style={styles.placeholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Product Name */}
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
          style={styles.input}
        />

        {/* Price */}
        <Text style={styles.label}>Price (USD)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Write something about this product"
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.9}>
          <LinearGradient
            colors={['#2D7FF9', '#4C9BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>Publish Product</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '600' },
  imageBox: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  image: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center' },
  placeholderText: { color: '#9ca3af', fontSize: 14, marginTop: 4 },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    marginVertical: 10,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
