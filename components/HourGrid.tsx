import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function HourGrid({ selectedHours, onSelectHour }: { selectedHours: number[]; onSelectHour: (hour: number) => void }) {
  return (
    <View style={styles.grid}>
      {HOURS.map(hour => {
        const isSelected = selectedHours.includes(hour);
        return (
          <TouchableOpacity
            key={hour}
            style={[styles.hourBox, isSelected && styles.selected]}
            onPress={() => onSelectHour(hour)}
          >
            <Text style={styles.hourText}>{hour.toString().padStart(2, '0')}:00</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 8,
  },
  hourBox: {
    width: 70,
    height: 40,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: '#243b47',
  },
  hourText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
