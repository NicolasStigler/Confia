import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { fetchSetWorkerSchedule } from '../../api/api';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';

const SetHorarioScreen = () => {
  const [fecha, setFecha] = useState(new Date());
  const [horaDeInicio, setHoraDeInicio] = useState(new Date());
  const [horaDeFin, setHoraDeFin] = useState(new Date());
  const [showFechaPicker, setShowFechaPicker] = useState(false);
  const [showHoraDeInicioPicker, setShowHoraDeInicioPicker] = useState(false);
  const [showHoraDeFinPicker, setShowHoraDeFinPicker] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const primary = useThemeColor({}, 'tint');
  const bg = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  const handleFechaChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowFechaPicker(false);
    if (selectedDate) setFecha(selectedDate);
  };

  const handleHoraDeInicioChange = (event, selectedTime) => {
    if (Platform.OS === 'android') setShowHoraDeInicioPicker(false);
    if (selectedTime) setHoraDeInicio(selectedTime);
  };

  const handleHoraDeFinChange = (event, selectedTime) => {
    if (Platform.OS === 'android') setShowHoraDeFinPicker(false);
    if (selectedTime) setHoraDeFin(selectedTime);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (horaDeInicio >= horaDeFin) {
      setError('La hora de inicio debe ser antes de la hora de fin');
      return;
    }
    const oneHour = 60 * 60 * 1000;
    if (horaDeFin - horaDeInicio !== oneHour) {
      setError('La duración del horario debe ser exactamente de una hora');
      return;
    }
    const scheduleData = {
      fecha: fecha.toISOString().split('T')[0],
      horaDeInicio: horaDeInicio.toTimeString().split(' ')[0],
      horaDeFin: horaDeFin.toTimeString().split(' ')[0],
    };
    try {
      const status = await fetchSetWorkerSchedule(scheduleData);
      if (status === 201) {
        setSuccess('Horario creado correctamente');
        setFecha(new Date());
        setHoraDeInicio(new Date());
        setHoraDeFin(new Date());
      }
    } catch (error) {
      setError('No se pudo crear el horario');
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: bg }]}>  
      <Pressable style={[styles.backButton, { backgroundColor: primary }]} onPress={() => router.back()}>
        <ThemedText style={styles.backButtonText}>Atrás</ThemedText>
      </Pressable>
      <ThemedText type="title" style={{ marginBottom: 24, color: text }}>Configura tu horario</ThemedText>
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Fecha</ThemedText>
        <Pressable style={styles.input} onPress={() => setShowFechaPicker(true)}>
          <ThemedText>{fecha.toLocaleDateString()}</ThemedText>
        </Pressable>
        {showFechaPicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display="default"
            onChange={handleFechaChange}
            minimumDate={new Date()}
          />
        )}
      </View>
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Hora de inicio</ThemedText>
        <Pressable style={styles.input} onPress={() => setShowHoraDeInicioPicker(true)}>
          <ThemedText>{horaDeInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</ThemedText>
        </Pressable>
        {showHoraDeInicioPicker && (
          <DateTimePicker
            value={horaDeInicio}
            mode="time"
            display="default"
            onChange={handleHoraDeInicioChange}
            minuteInterval={60}
          />
        )}
      </View>
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Hora de fin</ThemedText>
        <Pressable style={styles.input} onPress={() => setShowHoraDeFinPicker(true)}>
          <ThemedText>{horaDeFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</ThemedText>
        </Pressable>
        {showHoraDeFinPicker && (
          <DateTimePicker
            value={horaDeFin}
            mode="time"
            display="default"
            onChange={handleHoraDeFinChange}
            minuteInterval={60}
          />
        )}
      </View>
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      {success ? <ThemedText style={styles.success}>{success}</ThemedText> : null}
      <Pressable style={[styles.submitButton, { backgroundColor: primary }]} onPress={handleSubmit}>
        <ThemedText style={styles.submitButtonText}>Crear horario</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 24,
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#e74c3c',
    marginTop: 8,
    marginBottom: 0,
    fontWeight: 'bold',
  },
  success: {
    color: '#27ae60',
    marginTop: 8,
    marginBottom: 0,
    fontWeight: 'bold',
  },
});

export default SetHorarioScreen;
