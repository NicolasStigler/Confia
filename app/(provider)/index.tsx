import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchGetServicios } from '../../api/api'; // Adjust path if needed

interface Service {
  id: string;
  name: string;
  image?: string;
}

export default function HomeScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGetServicios();
        if (Array.isArray(data) && typeof data[0] === 'string') {
          setServices(data.map((name, idx) => ({
            id: String(idx),
            name,
          })));
        } else {
          setServices(data || []);
        }
      } catch (e: any) {
        setError('Error fetching services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleServicePress = (serviceName: string) => {
    router.push({ pathname: '/service-details', params: { serviceName } });
  };

  const handleAddService = () => {
    router.push('/provider/add-service'); // Adjust route as needed
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Confia
          </ThemedText>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={Platform.OS === 'ios' ? '#000' : '#fff'} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search for services"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Your Services
            </ThemedText>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : error ? (
              <ThemedText style={{ color: 'red', marginBottom: 16 }}>
                {error}
              </ThemedText>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {services.map((service, idx) => (
                  <TouchableOpacity
                    key={service.id ?? service.name ?? idx}
                    style={styles.serviceCard}
                    onPress={() => handleServicePress(service.name)}
                  >
                    <Image
                      source={{ uri: service.image }}
                      style={styles.serviceImage}
                    />
                    <ThemedText style={styles.serviceTitle}>
                      {service.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </ThemedView>

          <View style={styles.addServiceContainer}>
            <TouchableOpacity style={styles.addServiceButton} onPress={handleAddService}>
              <Ionicons name="add-circle-outline" size={28} color="#fff" style={{ marginRight: 10 }} />
              <ThemedText type="defaultSemiBold" style={styles.addServiceText}>
                Add New Service
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 25,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  serviceCard: {
    backgroundColor: '#1F2937',
    borderRadius: 15,
    width: 150,
    marginRight: 15,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 100,
  },
  serviceTitle: {
    padding: 10,
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  addServiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200, // Ensures enough space for vertical centering
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#243b47',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 30,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addServiceText: {
    color: '#fff',
    fontSize: 18,
  },
});