import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProductsTab({ sellerId }: { sellerId: number | null }) {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;
    fetch(`https://bkapp-mp8l.onrender.com/products/?seller=${sellerId}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sellerId]);

  const fixUrl = (url: string) => url?.startsWith('http://') ? url.replace('http://', 'https://') : url;

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} color="#2D7FF9" />;

  return (
    <FlatList
      data={products}
      keyExtractor={(item: any) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      renderItem={({ item }: any) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
          <Image source={{ uri: fixUrl(item.image) }} style={styles.image} />
          <Text style={styles.name} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.price}>{Number(item.price).toLocaleString('vi-VN')} ₫</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.empty}>Người bán chưa có sản phẩm nào.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, padding: 8, borderWidth: 1, borderColor: '#f0f0f0' },
  image: { width: '100%', height: 150, borderRadius: 8 },
  name: { fontSize: 14, fontWeight: '500', marginTop: 8, height: 40 },
  price: { fontSize: 15, color: '#FF4D4D', fontWeight: '700', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});