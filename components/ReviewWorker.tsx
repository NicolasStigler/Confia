import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchCreateReview } from '../api/api';

interface ReviewWorkerProps {
  appointmentId: string;
  worker: {
    id: string;
    firstname: string;
    lastname: string;
    profileImage?: string;
  };
  serviceName: string;
  onClose: () => void;
  onSubmit: () => void;
}

const ReviewWorker: React.FC<ReviewWorkerProps> = ({
  appointmentId,
  worker,
  serviceName,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  const handleRating = (value: number) => setRating(value);

  const handleSubmit = async () => {
    if (!rating) {
      Alert.alert('Por favor, selecciona una calificación.');
      return;
    }
    const createdAt = new Date().toISOString();
    const reviewData = {
      appointmentId,
      workerId: worker.id,
      nameServicio: serviceName,
      rating,
      comentario: comment,
      createdAt,
    };
    try {
      await fetchCreateReview(reviewData);
      Alert.alert('Éxito', 'Reseña enviada');
      onSubmit();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la reseña');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calificar a {worker.firstname} {worker.lastname}</Text>
      <Text style={styles.subtitle}>Servicio: {serviceName}</Text>
      {worker.profileImage && (
        <Image source={{ uri: worker.profileImage }} style={styles.avatar} />
      )}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRating(star)}>
            <Text style={[styles.star, rating >= star && styles.starSelected]}>{star <= rating ? '★' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Escribe un comentario (opcional)"
        placeholderTextColor="#B9D4E8"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111A1F',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#B9D4E8',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  star: {
    fontSize: 36,
    color: '#444',
    marginHorizontal: 6,
  },
  starSelected: {
    color: '#FFD700',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#1C2830',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReviewWorker;
