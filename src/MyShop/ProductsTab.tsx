import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'MyShop'>;
type Props = { navigation: NavProp };

const initialProducts = [
  {
    id: 1,
    name: 'Nike Air Max 97',
    price: '200k',
    img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/fa167834-731f-47d5-bdc3-8578415c02df/custom-nike-air-max-97-shoes-by-you.png',
    status: 'available',
  },
  {
    id: 2,
    name: 'Nike Hoodie Essential',
    price: '120k',
    img: 'https://www.nike.com.kw/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwc0a0628d/nk/f24/d/a/e/7/1/f24dae71_2ceb_4dbf_bb56_d00b3cfcd8bb.jpg',
    status: 'available',
  },
  {
    id: 3,
    name: 'Nike Dunk Retro',
    price: '150k',
    img: 'https://tse2.mm.bing.net/th/id/OIP.f5h0AHJfkVzsDJiH4wWt-gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    status: 'sold',
  },
];

export default function ProductsTab({ navigation }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<any | null>(null);

  const handleSave = () => {
    setProducts(prev => prev.map(p => (p.id === editing.id ? editing : p)));
    setEditing(null);
  };

  const renderProduct = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, item.status === 'sold' && styles.soldCard]}
    >
      <Image source={{ uri: item.img }} style={styles.image} />
      <Text style={[styles.name, item.status === 'sold' && { color: '#999' }]}>
        {item.name}
      </Text>
      <Text style={[styles.price, item.status === 'sold' && { color: '#aaa' }]}>
        {item.price}
      </Text>

      {item.status === 'available' && (
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => setEditing(item)}>
            <Ionicons name="create-outline" size={18} color="#475DFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setProducts(products.filter(p => p.id !== item.id))}
          >
            <Ionicons name="trash-outline" size={18} color="#FF4757" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const available = products.filter(p => p.status === 'available');
  const sold = products.filter(p => p.status === 'sold');

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>On Sale</Text>
      <FlatList
        data={available}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => renderProduct(item)}
      />

      <Text style={styles.sectionTitle}>Sold</Text>
      <FlatList
        data={sold}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => renderProduct(item)}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* ✏️ Modal Edit Product */}
      <Modal
        visible={!!editing}
        transparent
        animationType="fade"
        onRequestClose={() => setEditing(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Product</Text>

            <TextInput
              style={styles.input}
              value={editing?.name}
              onChangeText={t => setEditing({ ...editing, name: t })}
              placeholder="Product Name"
            />
            <TextInput
              style={styles.input}
              value={editing?.price}
              onChangeText={t => setEditing({ ...editing, price: t })}
              placeholder="Price"
            />

            <View style={styles.statusRow}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  editing?.status === 'available' && styles.activeStatus,
                ]}
                onPress={() => setEditing({ ...editing, status: 'available' })}
              >
                <Text
                  style={[
                    styles.statusText,
                    editing?.status === 'available' && styles.activeStatusText,
                  ]}
                >
                  Available
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  editing?.status === 'sold' && styles.activeStatus,
                ]}
                onPress={() => setEditing({ ...editing, status: 'sold' })}
              >
                <Text
                  style={[
                    styles.statusText,
                    editing?.status === 'sold' && styles.activeStatusText,
                  ]}
                >
                  Sold
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#E5E7EB' }]}
                onPress={() => setEditing(null)}
              >
                <Text style={{ color: '#333' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#2D7FF9' }]}
                onPress={handleSave}
              >
                <Text style={{ color: '#fff' }}>Save</Text>
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
    marginVertical: 8,
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
  soldCard: { opacity: 0.6, backgroundColor: '#f5f5f5' },
  image: { width: '100%', height: 130, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 14 },
  price: { fontSize: 14, color: '#475DFF', fontWeight: '600' },
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
    borderRadius: 40,
    padding: 16,
    shadowColor: '#2D7FF9',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeStatus: {
    backgroundColor: '#E8F1FF',
    borderColor: '#2D7FF9',
  },
  statusText: { color: '#555', fontWeight: '500' },
  activeStatusText: { color: '#2D7FF9' },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
});
