import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { fetchSetWorkerSchedule } from '../../api/api';
import HourGrid from '../../components/HourGrid';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';

const SetHorarioScreen = () => {
  const [fecha, setFecha] = useState(new Date());
  const [showFechaPicker, setShowFechaPicker] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const router = useRouter();
  const primary = useThemeColor({}, 'tint');
  const bg = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  const handleSelectHour = (hour: number) => {
    setSelectedHours(prev => {
      if (prev.includes(hour)) {
        return prev.filter(h => h !== hour);
      } else {
        return [...prev, hour];
      }
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (selectedHours.length === 0) {
      setError('Selecciona al menos una hora');
      return;
    }
    try {
      for (const hour of selectedHours) {
        const start = new Date(selectedDate);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setHours(start.getHours() + 1);
        const scheduleData = {
          fecha: start.toISOString().split('T')[0],
          horaDeInicio: start.toTimeString().split(' ')[0],
          horaDeFin: end.toTimeString().split(' ')[0],
        };
        await fetchSetWorkerSchedule(scheduleData);
      }
      setSuccess('Horario(s) creado(s) correctamente');
      setSelectedHours([]);
    } catch (error) {
      setError('No se pudo crear el horario');
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: bg }]}>  
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View style={{ width: '90%' }} />
      </View>
      <ThemedText type="title" style={{ marginBottom: 24, color: text }}>Configura tu horario</ThemedText>
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Fecha</ThemedText>
        <Pressable style={styles.input} onPress={() => setShowFechaPicker(true)}>
          <ThemedText>{selectedDate.toLocaleDateString()}</ThemedText>
        </Pressable>
        {showFechaPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowFechaPicker(false);
              if (date) setSelectedDate(date);
            }}
            minimumDate={new Date()}
          />
        )}
      </View>
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Selecciona las horas</ThemedText>
        <HourGrid selectedHours={selectedHours} onSelectHour={handleSelectHour} />
      </View>
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      {success ? <ThemedText style={styles.success}>{success}</ThemedText> : null}
      <Pressable style={[styles.submitButton, { backgroundColor: '#243b47' }]} onPress={handleSubmit}>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    minHeight: 52,
  },
  headerBack: {
    paddingRight: 12,
    width: 32,
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
    backgroundColor: '#1F2937',
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
