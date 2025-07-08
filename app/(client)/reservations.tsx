import ReviewWorker from '@/components/ReviewWorker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchGetClientAppointmentsByStatus, fetchGetClientAppointmentsNotReviewed } from '../../api/api';

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

export default function ReservationsScreen() {
  const [requestedAppointments, setRequestedAppointments] = useState<Appointment[]>([]);
  const [acceptedAppointments, setAcceptedAppointments] = useState<Appointment[]>([]);
  const [pendingReviewAppointments, setPendingReviewAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [currentReviewAppointment, setCurrentReviewAppointment] = useState<Appointment | null>(null);
  const router = useRouter();
  const currentDate = getCurrentDate();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const requested = await fetchGetClientAppointmentsByStatus('REQUESTED', currentDate);
        const accepted = await fetchGetClientAppointmentsByStatus('ACCEPTED', currentDate);
        const pendingReviews = await fetchGetClientAppointmentsNotReviewed();
        setRequestedAppointments(requested || []);
        setAcceptedAppointments(accepted || []);
        setPendingReviewAppointments(pendingReviews || []);
      } catch (e) {
        setError('Error fetching reservations');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [currentDate]);

  const handleReview = (appointment: Appointment) => {
    setCurrentReviewAppointment(appointment);
    setReviewModalVisible(true);
  };

  const handleReviewSubmit = () => {
    setReviewModalVisible(false);
    setCurrentReviewAppointment(null);
    // Refresh pending reviews
    fetchGetClientAppointmentsNotReviewed().then(setPendingReviewAppointments);
  };

  const renderAppointmentCard = (item: Appointment) => (
    <View key={item.id} style={styles.serviceCard}>
      <Image
        source={item.servicio.image ? { uri: item.servicio.image } : require('@/assets/images/avatar.png')}
        style={styles.serviceImage}
      />
      <ThemedText style={styles.serviceTitle}>{item.servicio.name}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Cliente: ${item.client.firstname} ${item.client.lastname}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Fecha: ${item.date}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Hora: ${item.horaDeInicio} - ${item.horaDeFin}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Dirección: ${item.cliente_direccion}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Distrito: ${item.district.name}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Estado: ${item.status}`}</ThemedText>
    </View>
  );

  const renderPendingReviewCard = (item: Appointment) => (
    <View key={item.id} style={styles.serviceCard}>
      <Image
        source={item.worker?.profileImage ? { uri: item.worker.profileImage } : require('@/assets/images/avatar.png')}
        style={styles.serviceImage}
      />
      <ThemedText style={styles.serviceTitle}>{item.servicio.name}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Trabajador: ${item.worker.firstname} ${item.worker.lastname}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Fecha: ${item.date}`}</ThemedText>
      <ThemedText style={styles.serviceSubText}>{`Hora: ${item.horaDeInicio} - ${item.horaDeFin}`}</ThemedText>
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => handleReview(item)}
      >
        <ThemedText style={styles.reviewButtonText}>Calificar</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>Mis Reservas</ThemedText>
          <TouchableOpacity onPress={() => router.push('/')}> {/* Home or previous page */}
            <Ionicons name="arrow-back" size={24} color={Platform.OS === 'ios' ? '#000' : '#fff'} />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 40 }} />
        ) : error ? (
          <ThemedText style={{ color: 'red', margin: 20 }}>{error}</ThemedText>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Pending Reviews Row */}
            <ThemedView style={styles.sectionContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Citas por calificar</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {pendingReviewAppointments.length === 0 ? (
                  <ThemedText style={styles.emptyText}>No tienes citas por calificar.</ThemedText>
                ) : (
                  pendingReviewAppointments.map(renderPendingReviewCard)
                )}
              </ScrollView>
            </ThemedView>
            <ThemedView style={styles.sectionContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Solicitudes Pendientes</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {requestedAppointments.length === 0 ? (
                  <ThemedText style={styles.emptyText}>No tienes solicitudes pendientes.</ThemedText>
                ) : (
                  requestedAppointments.map(renderAppointmentCard)
                )}
              </ScrollView>
            </ThemedView>
            <ThemedView style={styles.sectionContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Solicitudes Aceptadas</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {acceptedAppointments.length === 0 ? (
                  <ThemedText style={styles.emptyText}>No tienes solicitudes aceptadas.</ThemedText>
                ) : (
                  acceptedAppointments.map(renderAppointmentCard)
                )}
              </ScrollView>
            </ThemedView>
          </ScrollView>
        )}
        {/* Review Modal */}
        <Modal
          visible={reviewModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setReviewModalVisible(false)}
        >
          {currentReviewAppointment && (
            <ReviewWorker
              appointmentId={currentReviewAppointment.id}
              worker={currentReviewAppointment.worker}
              serviceName={currentReviewAppointment.servicio.name}
              onClose={() => setReviewModalVisible(false)}
              onSubmit={handleReviewSubmit}
            />
          )}
        </Modal>
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
    width: 200,
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
  emptyText: {
    color: '#888',
    fontSize: 16,
    padding: 20,
  },
  reviewButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});