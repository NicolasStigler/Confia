import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchGetServiciosByName } from '../api/api';

export default function ServiceDetailsScreen() {
  const params = useLocalSearchParams<{ serviceName?: string | string[] }>();
  let serviceName: string = 'Servicio';
  if (params.serviceName) {
    serviceName = Array.isArray(params.serviceName)
      ? params.serviceName[0] ?? 'Servicio'
      : params.serviceName;
  }
  const [workers, setWorkers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setWorkers([]);
    setPage(0);
    setHasMore(true);
  }, [serviceName]);

  useEffect(() => {
    fetchWorkers();
  }, [serviceName, page]);

  const fetchWorkers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchGetServiciosByName(serviceName, page, 5);
      setWorkers(prevWorkers => [
        ...prevWorkers,
        ...(response?.content ?? []),
      ]);
      setHasMore(!response?.last);
    } catch (err) {
      setError('Failed to fetch workers');
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const renderWorkerItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.workerCard}
      onPress={() =>
        router.push({
          pathname: '/contract-worker',
          params: { workerId: item.worker.id, serviceName },
        })
      }
    >
      <Image
        source={
          item.worker.profileImage
            ? { uri: item.worker.profileImage }
            : require('../assets/images/avatar.png')
        }
        style={styles.profileImage}
      />
      <View style={styles.workerInfo}>
        <ThemedText style={styles.workerName}>
          {item.worker.firstname} {item.worker.lastname}
        </ThemedText>
        <Text style={styles.workerDetails}>
          Precio: {item.price}
        </Text>
        <Text style={styles.workerDetails}>
          Calificación: {item.worker.averageRating ?? 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>
            {serviceName}
          </ThemedText>
          <View style={{ width: 28 }} />
        </View>

        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Profesionales disponibles
          </ThemedText>

          {error ? (
            <ThemedText style={{ color: 'red', marginBottom: 16 }}>
              {error}
            </ThemedText>
          ) : (
            <FlatList
              data={workers}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={renderWorkerItem}
              contentContainerStyle={styles.list}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loading ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : null
              }
            />
          )}
        </ThemedView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'transparent',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
  },
  list: {
    marginTop: 10,
    paddingBottom: 40,
  },
  workerCard: {
    backgroundColor: '#1F2937',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 15,
    backgroundColor: '#222',
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  workerDetails: {
    color: '#B9D4E8',
    fontSize: 15,
  },
});