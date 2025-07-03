import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPostService } from '../api/api';

export default function AddServiceScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [distritos, setDistritos] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleAddDistrito = () => {
    if (distritos.length < 15) {
      setDistritos([...distritos, '']);
    }
  };

  const handleRemoveLastDistrito = () => {
    if (distritos.length > 1) {
      setDistritos(distritos.slice(0, -1));
    }
  };

  const handleDistritoChange = (text: string, index: number) => {
    const newDistritos = [...distritos];
    newDistritos[index] = text;
    setDistritos(newDistritos);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim() || isNaN(Number(price))) return;
    setLoading(true);
    const createServicioDTO = {
      name: name.trim(),
      price: parseInt(price, 10),
      distritos_atiende: distritos
        .filter((d) => d.trim() !== '')
        .map((d) => ({ name: d.trim() })),
    };
    try {
      const status = await fetchPostService(createServicioDTO);
      if (status === 201) {
        setSuccessMessage('Service created successfully!');
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start(() => setSuccessMessage(''));
          }, 2500);
        });
        setName('');
        setPrice('');
        setDistritos(['']);
      }
    } catch (error) {
      setSuccessMessage('Could not create service.');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setSuccessMessage(''));
        }, 2500);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.headerTitle}>
              Add Service
            </ThemedText>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
            <ThemedText type="subtitle" style={styles.label}>
              Service Name
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Service Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
            <ThemedText type="subtitle" style={styles.label}>
              Price
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Price"
              placeholderTextColor="#888"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              editable={!loading}
            />
            <ThemedText type="subtitle" style={styles.label}>
              Districts you serve
            </ThemedText>
            {distritos.map((distrito, idx) => (
              <TextInput
                key={idx}
                style={styles.input}
                placeholder={`District ${idx + 1}`}
                placeholderTextColor="#888"
                value={distrito}
                onChangeText={(text) => handleDistritoChange(text, idx)}
                editable={!loading}
              />
            ))}
            <View style={styles.distritoButtonsRow}>
              {distritos.length < 15 && (
                <TouchableOpacity style={styles.distritoButton} onPress={handleAddDistrito} disabled={loading}>
                  <Ionicons name="add-circle-outline" size={22} color="#fff" />
                  <ThemedText style={styles.distritoButtonText}>Add District</ThemedText>
                </TouchableOpacity>
              )}
              {distritos.length > 1 && (
                <TouchableOpacity style={styles.distritoButton} onPress={handleRemoveLastDistrito} disabled={loading}>
                  <Ionicons name="remove-circle-outline" size={22} color="#fff" />
                  <ThemedText style={styles.distritoButtonText}>Remove</ThemedText>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[styles.submitButton, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
              <ThemedText style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit'}</ThemedText>
            </TouchableOpacity>
            {successMessage !== '' && (
              <Animated.View style={[styles.successMessage, { opacity: fadeAnim }]}> 
                <ThemedText style={styles.successMessageText}>{successMessage}</ThemedText>
              </Animated.View>
            )}
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#1F2937',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    color: '#fff',
    marginTop: 18,
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#1F2937',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#243b47',
  },
  distritoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 18,
    gap: 12,
  },
  distritoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#243b47',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  distritoButtonText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 6,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#238636',
    borderRadius: 15,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successMessage: {
    marginTop: 10,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  successMessageText: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
