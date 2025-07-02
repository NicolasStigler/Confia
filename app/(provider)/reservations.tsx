import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { fetchGetWorkerAppointmentsByStatus, fetchWorkerUpdateCitaStatus } from '../../api/api';

// Dummy API functions for structure (replace with real ones)
const fetchGetWorkerAppointmentsByStatus = async (status: string, date: string) => [];
const fetchWorkerUpdateCitaStatus = async (id: number, status: string) => {};

interface Appointment {
  id: string;
  date: string;
  horaDeInicio: string;
  horaDeFin: string;
  status: string;
  cliente_direccion: string;
  district: { name: string };
  client: {
    firstname: string;
    lastname: string;
    profileImage?: string;
  };
  servicio: {
    name: string;
    price: string;
    image?: string;
  };
}

const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');

export default function ProviderReservationsScreen() {
  const [requestedAppointments, setRequestedAppointments] = useState<Appointment[]>([]);
  const [acceptedAppointments, setAcceptedAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const currentDate = getCurrentDate();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const requested = await fetchGetWorkerAppointmentsByStatus('REQUESTED', currentDate);
        const accepted = await fetchGetWorkerAppointmentsByStatus('ACCEPTED', currentDate);
        setRequestedAppointments(requested || []);
        setAcceptedAppointments(accepted || []);
      } catch (e) {
        setError('Error fetching reservations');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [currentDate]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetchWorkerUpdateCitaStatus(id, status);
      Alert.alert('Éxito', `La cita ha sido ${status.toLowerCase()}`);
      // Refresh
      const requested = await fetchGetWorkerAppointmentsByStatus('REQUESTED', currentDate);
      const accepted = await fetchGetWorkerAppointmentsByStatus('ACCEPTED', currentDate);
      setRequestedAppointments(requested || []);
      setAcceptedAppointments(accepted || []);
    } catch {
      Alert.alert('Error', `No se pudo actualizar la cita a ${status.toLowerCase()}`);
    }
  };

  const renderAppointmentCard = (item: Appointment) => (
    <View key={item.id} style={styles.serviceCard}>
      <Image
        source={item.client.profileImage ? { uri: item.client.profileImage } : require('@/assets/images/avatar.png')}
        style={styles.serviceImage}
      />
      <ThemedText style={styles.serviceTitle}>{item.client.firstname} {item.client.lastname}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Fecha: ${item.date}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Hora: ${item.horaDeInicio} - ${item.horaDeFin}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Servicio: ${item.servicio.name} - S/ ${item.servicio.price}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Dirección: ${item.cliente_direccion}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Distrito: ${item.district.name}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Estado: ${item.status}`}</ThemedText>
      <View style={styles.actionsRow}>
        {item.status === 'REQUESTED' && (
          <>
            <TouchableOpacity style={[styles.actionButton, styles.accept]} onPress={() => updateStatus(item.id, 'ACCEPTED')}>
              <ThemedText style={styles.actionButtonText}>Aceptar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.reject]} onPress={() => updateStatus(item.id, 'CANCELLED')}>
              <ThemedText style={styles.actionButtonText}>Rechazar</ThemedText>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'ACCEPTED' && (
          <TouchableOpacity style={[styles.actionButton, styles.complete]} onPress={() => updateStatus(item.id, 'COMPLETED')}>
            <ThemedText style={styles.actionButtonText}>Terminado</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>Reservas de hoy</ThemedText>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Platform.OS === 'ios' ? '#000' : '#fff'} />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 40 }} />
        ) : error ? (
          <ThemedText style={{ color: 'red', margin: 20 }}>{error}</ThemedText>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedView style={styles.sectionContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Solicitudes Pendientes</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {requestedAppointments.length === 0 ? (
                  <ThemedText style={styles.emptyText}>No hay solicitudes pendientes.</ThemedText>
                ) : (
                  requestedAppointments.map(renderAppointmentCard)
                )}
              </ScrollView>
            </ThemedView>
            <ThemedView style={styles.sectionContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Solicitudes Aceptadas</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {acceptedAppointments.length === 0 ? (
                  <ThemedText style={styles.emptyText}>No hay solicitudes aceptadas.</ThemedText>
                ) : (
                  acceptedAppointments.map(renderAppointmentCard)
                )}
              </ScrollView>
            </ThemedView>
          </ScrollView>
        )}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  serviceCard: {
    backgroundColor: '#1F2937',
    borderRadius: 15,
    width: 220,
    marginRight: 15,
    overflow: 'hidden',
    padding: 12,
    alignItems: 'flex-start',
  },
  serviceImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  serviceTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceSubText: {
    color: '#D1D5DB',
    fontSize: 14,
    marginBottom: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 2,
  },
  accept: {
    backgroundColor: '#4CAF50',
  },
  reject: {
    backgroundColor: '#FF6347',
  },
  complete: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    padding: 20,
  },
});
