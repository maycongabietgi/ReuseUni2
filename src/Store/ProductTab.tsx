import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const products = [
  {
    id: 1,
    name: 'Nike Air Max 95 Premium',
    price: '200k',
    img: 'https://www.nike.com.kw/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwc0a0628d/nk/f24/d/a/e/7/1/f24dae71_2ceb_4dbf_bb56_d00b3cfcd8bb.jpg',
  },
  {
    id: 2,
    name: 'Nike Air Max 95 Premium',
    price: '180k',
    img: 'https://media.hypedc.com/products/f3299cb5/fb9658-002_gry_01.jpg',
  },
  {
    id: 3,
    name: 'Nike Air Max 95 Premium',
    price: '120k',
    img: 'https://vietmadeco.vn/wp-content/uploads/2023/07/balo-di-hoc-nu-cap-3-ladata-vmc8782-mau-xanh-trang-1-1536x1536.jpg',
  },
  {
    id: 4,
    name: 'Nike Air Max 95 Premium',
    price: '120k',
    img: 'https://vietmadeco.vn/wp-content/uploads/2023/07/balo-di-hoc-nu-cap-3-ladata-vmc8782-mau-xanh-trang-1-1536x1536.jpg',
  },
];

export default function ProductsTab() {
  return (
    <View style={styles.grid}>
      {products.map(p => (
        <TouchableOpacity key={p.id} style={styles.card}>
          <Image source={{ uri: p.img }} style={styles.image} />
          <Text style={styles.name}>{p.name}</Text>
          <Text style={styles.price}>{p.price}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    shadowColor: '#232121ff',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: '100%', height: 140, borderRadius: 10, marginBottom: 12 },
  name: { fontSize: 14 },
  price: { fontSize: 14, color: '#475DFF', marginTop: 4, fontWeight: '600' },
});
