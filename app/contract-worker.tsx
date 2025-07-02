import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    fetchCreateAppointment,
    fetchGetWorkerSchedulesBySevenDays,
    fetchGetWorkerServiceFinalPage,
    getRoleBasedOnToken,
} from '../api/api';

export default function ContractWorkerScreen() {
  const params = useLocalSearchParams<{ workerId?: string; serviceName?: string }>();
  const workerId = params.workerId;
  const serviceName = params.serviceName;

  const [workerDetails, setWorkerDetails] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workerId || !serviceName) return;
    const fetchWorkerDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchGetWorkerServiceFinalPage(workerId, serviceName);
        setWorkerDetails(response);
      } catch (error) {
        setWorkerDetails(null);
      }
      setLoading(false);
    };
    const fetchUserRole = async () => {
      try {
        const role = await getRoleBasedOnToken();
        setUserRole(role);
      } catch (error) {
        setUserRole('');
      }
    };
    fetchWorkerDetails();
    fetchUserRole();
  }, [workerId, serviceName]);

  const handleStartDateChange = (_event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      // If new startDate is after endDate, update endDate to match startDate
      if (endDate < selectedDate) {
        setEndDate(selectedDate);
      }
    }
  };
  const handleEndDateChange = (_event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      // If selected endDate is before startDate, show error and do not update
      if (selectedDate < startDate) {
        Alert.alert('Error', 'La fecha de fin no puede ser anterior a la fecha de inicio.');
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const handleSearchSchedules = async () => {
    if (endDate < startDate) {
      Alert.alert('Error', 'La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }
    if ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) > 7) {
      Alert.alert('Error', 'El intervalo no puede ser mayor a 7 días.');
      return;
    }
    try {
      setLoading(true);
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      const response = await fetchGetWorkerSchedulesBySevenDays(workerId, formattedStartDate, formattedEndDate);
      setSchedules(response);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron obtener los horarios.');
    }
    setLoading(false);
  };

  const handleSelectService = (schedule: any) => {
    Alert.alert(
      'Confirmación',
      '¿Seguro que quieres reservar este servicio en este horario?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            const body = {
              workerId,
              fecha: schedule.fecha,
              horaDeInicio: schedule.horaDeInicio,
              horaDeFin: schedule.horaDeFin,
              serviceName,
            };
            try {
              const status = await fetchCreateAppointment(body);
              if (status === 201) {
                Alert.alert('Éxito', 'La solicitud de la cita le ha sido enviada al trabajador');
              }
            } catch (error: any) {
              if (error?.response) {
                Alert.alert('Error', error.response.data.message);
              } else {
                Alert.alert('Error', 'No se pudo crear la cita');
              }
            }
          },
        },
      ]
    );
  };

  const renderScheduleItem = ({ item }: { item: any }) => {
    if (userRole === 'ROLE_CLIENT') {
      return (
        <View style={styles.scheduleItemButton}>
          <ThemedText style={styles.scheduleText}>{item.fecha}</ThemedText>
          <ThemedText style={styles.scheduleText}>{item.horaDeInicio} - {item.horaDeFin}</ThemedText>
          <TouchableOpacity style={styles.selectButton} onPress={() => handleSelectService(item)}>
            <ThemedText style={styles.selectButtonText}>Escoger servicio</ThemedText>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.scheduleItem}>
          <ThemedText style={styles.scheduleText}>{item.fecha}</ThemedText>
          <ThemedText style={styles.scheduleText}>{item.horaDeInicio} - {item.horaDeFin}</ThemedText>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>
            Detalles del Profesional
          </ThemedText>
          <View style={{ width: 28 }} />
        </View>

        {loading && <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 20 }} />}

        {workerDetails && (
          <ThemedView style={styles.detailsContainer}>
            <Image
              source={workerDetails.worker.profileImage ? { uri: workerDetails.worker.profileImage } : require('../assets/images/avatar.png')}
              style={styles.profileImage}
            />
            <ThemedText style={styles.workerName}>{`${workerDetails.worker.firstname} ${workerDetails.worker.lastname}`}</ThemedText>
            <ThemedText style={styles.workerRating}>{`Calificación: ${workerDetails.worker.averageRating ?? 'N/A'}`}</ThemedText>
            <ThemedText style={styles.workerPrice}>{`Precio: ${workerDetails.price}`}</ThemedText>
            <ThemedText style={styles.workerDistricts}>Distritos:</ThemedText>
            {workerDetails.distritos_atiende.map((district: any, index: number) => (
              <ThemedText key={index} style={styles.districtName}>{district.name}</ThemedText>
            ))}
          </ThemedView>
        )}

        <ThemedView style={styles.datePickerContainer}>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDatePicker(true)}>
            <ThemedText style={styles.dateButtonText}>Seleccionar fecha de inicio</ThemedText>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
          <ThemedText style={styles.selectedDate}>{startDate.toDateString()}</ThemedText>

          <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDatePicker(true)}>
            <ThemedText style={styles.dateButtonText}>Seleccionar fecha de fin</ThemedText>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
          <ThemedText style={styles.selectedDate}>{endDate.toDateString()}</ThemedText>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearchSchedules}>
            <ThemedText style={styles.searchButtonText}>Buscar Horarios</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <FlatList
          data={schedules}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderScheduleItem}
          contentContainerStyle={styles.list}
        />
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
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    backgroundColor: '#222',
  },
  workerName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
  },
  workerRating: {
    color: '#B9D4E8',
    fontSize: 16,
    marginBottom: 4,
  },
  workerPrice: {
    color: '#B9D4E8',
    fontSize: 16,
    marginBottom: 4,
  },
  workerDistricts: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 2,
  },
  districtName: {
    color: '#B9D4E8',
    fontSize: 15,
  },
  datePickerContainer: {
    marginBottom: 20,
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 10,
  },
  dateButton: {
    backgroundColor: '#21262D',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#B9D4E8',
    fontWeight: 'bold',
    fontSize: 15,
  },
  selectedDate: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: '#238636',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    marginTop: 10,
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  scheduleItem: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  scheduleItemButton: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  scheduleText: {
    color: '#B9D4E8',
    fontSize: 15,
    marginBottom: 2,
  },
  selectButton: {
    backgroundColor: '#238636',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
