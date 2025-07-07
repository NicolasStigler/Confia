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
import { fetchGetServicios } from '../../api/api'; // Use the correct path for your project

const IMAGE_URL = 'https://imgs.search.brave.com/rZmotpfnafDxcsS7hT79tJSBP7mODE-sIx4-pPMjnAo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG5p/Lmljb25zY291dC5j/b20vaWxsdXN0cmF0/aW9uL3ByZW1pdW0v/dGh1bWIvaG9tZS1h/cHBsaWFuY2UtcmVw/YWlybWFuLWlsbHVz/dHJhdGlvbi1kb3du/bG9hZC1pbi1zdmct/cG5nLWdpZi1maWxl/LWZvcm1hdHMtLXRl/Y2huaWNpYW4tcmVw/YWlyaW5nLWp1aWNl/ci1taXhlci1ncmlu/ZGVyLXBhY2stc2Vy/dmljZXMtaWxsdXN0/cmF0aW9ucy00Njcz/NTc1LnBuZw';

interface Service {
  id: string;
  name: string;
  image?: string; // Adjust if your backend returns image URLs
}

export default function HomeScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGetServicios();
        // If your backend returns an array of plain strings, map to { name }
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

  // Normaliza texto para ignorar tildes/acentos
  function normalize(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  // Filter services based on search, ignoring tildes/accents
  const filteredServices = services.filter(service =>
    normalize(service.name).includes(normalize(search))
  );

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
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Featured Services
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
                {filteredServices.length === 0 ? (
                  <ThemedText style={{ color: '#fff', padding: 20 }}>
                    No services found.
                  </ThemedText>
                ) : (
                  filteredServices.map((service, idx) => (
                    <TouchableOpacity
                      key={service.id ?? service.name ?? idx}
                      style={styles.serviceCard}
                      onPress={() => handleServicePress(service.name)}
                    >
                      <Image
                        source={{
                          uri: service.image
                        }}
                        style={styles.serviceImage}
                      />
                      <ThemedText style={styles.serviceTitle}>
                        {service.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            )}
          </ThemedView>

          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Special Offers
            </ThemedText>
            <TouchableOpacity style={styles.specialOfferCard}>
              <Image
                source={{ uri: IMAGE_URL }}
                style={styles.specialOfferImage}
              />
              <View style={styles.specialOfferTextContainer}>
                <ThemedText type="defaultSemiBold" style={styles.specialOfferMainText}>
                  Get 20% off your first booking
                </ThemedText>
                <ThemedText style={styles.specialOfferSubText}>
                  Use code WELCOME20 at checkout
                </ThemedText>
                <ThemedText style={styles.specialOfferSubText}>
                  Limited time offer
                </ThemedText>
              </View>
            </TouchableOpacity>
          </ThemedView>
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
  specialOfferCard: {
    backgroundColor: '#1F2937',
    borderRadius: 15,
    overflow: 'hidden',
  },
  specialOfferImage: {
    width: '100%',
    height: 180,
  },
  specialOfferTextContainer: {
    padding: 15,
  },
  specialOfferMainText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 5,
  },
  specialOfferSubText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
});