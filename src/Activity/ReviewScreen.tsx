import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReviewScreen({ navigation, route }: any) {
  const [name, setName] = useState('Phuc Nguyen');
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState(3);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add review</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} editable={false} />

        {/* Experience */}
        <Text style={styles.label}>How was your experience?</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your experience..."
          multiline
          value={experience}
          onChangeText={setExperience}
        />

        {/* Star Rating */}
        <Text style={styles.label}>Star</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={5}
          step={0.5}
          value={rating}
          minimumTrackTintColor="#5565FB"
          thumbTintColor="#5565FB"
          onValueChange={setRating}
        />
        <Text style={styles.ratingValue}>{rating.toFixed(1)} / 5.0</Text>

        {/* Submit Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={['#5565FB', '#5599FB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0.8 }}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>Submit</Text>
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
    shadowColor: '#E5E8F0',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E8F0',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  ratingValue: {
    textAlign: 'right',
    color: '#4C69FF',
    fontWeight: '600',
    marginBottom: 20,
  },

  submitBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
