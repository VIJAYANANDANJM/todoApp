import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
}

export default function DatePickerModal({
  visible,
  onClose,
  onConfirm,
  initialDate,
  mode = 'datetime',
  minimumDate,
}: DatePickerModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [selectedTime, setSelectedTime] = useState(initialDate || new Date());

  const handleConfirm = () => {
    let finalDate: Date;
    if (mode === 'time') {
      finalDate = new Date(selectedTime);
    } else if (mode === 'datetime') {
      finalDate = new Date(selectedDate);
      finalDate.setHours(selectedTime.getHours());
      finalDate.setMinutes(selectedTime.getMinutes());
    } else {
      finalDate = new Date(selectedDate);
    }
    onConfirm(finalDate);
    onClose();
  };

  const adjustDate = (field: 'year' | 'month' | 'day', delta: number) => {
    const newDate = new Date(selectedDate);
    if (field === 'year') newDate.setFullYear(newDate.getFullYear() + delta);
    if (field === 'month') newDate.setMonth(newDate.getMonth() + delta);
    if (field === 'day') newDate.setDate(newDate.getDate() + delta);
    if (minimumDate && newDate < minimumDate) return;
    setSelectedDate(newDate);
  };

  const adjustTime = (field: 'hour' | 'minute', delta: number) => {
    const newTime = new Date(selectedTime);
    if (field === 'hour') newTime.setHours(newTime.getHours() + delta);
    if (field === 'minute') newTime.setMinutes(newTime.getMinutes() + delta);
    setSelectedTime(newTime);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Select {mode === 'date' ? 'Date' : mode === 'time' ? 'Time' : 'Date & Time'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {(mode === 'date' || mode === 'datetime') && (
            <View style={styles.dateSection}>
              <View style={styles.dateRow}>
                <View style={styles.dateControl}>
                  <TouchableOpacity
                    onPress={() => adjustDate('year', -1)}
                    style={[styles.button, { backgroundColor: colors.card }]}
                  >
                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.dateValue, { color: colors.text }]}>
                    {selectedDate.getFullYear()}
                  </Text>
                  <TouchableOpacity
                    onPress={() => adjustDate('year', 1)}
                    style={[styles.button, { backgroundColor: colors.card }]}
                  >
                    <Ionicons name="chevron-up" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.dateControl}>
                  <TouchableOpacity
                    onPress={() => adjustDate('month', -1)}
                    style={[styles.button, { backgroundColor: colors.card }]}
                  >
                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.dateValue, { color: colors.text }]}>
                    {selectedDate.toLocaleDateString('en-US', { month: 'short' })}
                  </Text>
                  <TouchableOpacity
                    onPress={() => adjustDate('month', 1)}
                    style={[styles.button, { backgroundColor: colors.card }]}
                  >
                    <Ionicons name="chevron-up" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.dateControl}>
                  <TouchableOpacity
                    onPress={() => adjustDate('day', -1)}
                    style={[styles.button, { backgroundColor: colors.card }]}
                  >
                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.dateValue, { color: colors.text }]}>
                    {selectedDate.getDate()}
                  </Text>
                  <TouchableOpacity
                    onPress={() => adjustDate('day', 1)}
                    style={[styles.button, { backgroundColor: colors.card }]}
                  >
                    <Ionicons name="chevron-up" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {(mode === 'time' || mode === 'datetime') && (
            <View style={styles.timeSection}>
              <View style={styles.timeRow}>
                <View style={styles.timeControl}>
                  <TouchableOpacity
                    onPress={() => adjustTime('hour', -1)}
                    style={[styles.button, { backgroundColor: colors.card }]}
                  >
                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.timeValue, { color: colors.text }]}>
                    {selectedTime.getHours().toString().padStart(2, '0')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => adjustTime('hour', 1)}
                    style={[styles.button, { backgroundColor: colors.card }]}
                  >
                    <Ionicons name="chevron-up" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>

                <View style={styles.timeControl}>
                  <TouchableOpacity
                    onPress={() => adjustTime('minute', -1)}
                    style={[styles.button, { backgroundColor: colors.card }]}
                  >
                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.timeValue, { color: colors.text }]}>
                    {selectedTime.getMinutes().toString().padStart(2, '0')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => adjustTime('minute', 1)}
                    style={[styles.button, { backgroundColor: colors.card }]}
                  >
                    <Ionicons name="chevron-up" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.cancelButton, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={[styles.confirmButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateSection: {
    marginBottom: 24,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  dateControl: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateValue: {
    fontSize: 18,
    fontWeight: '600',
    minHeight: 30,
  },
  timeSection: {
    marginBottom: 24,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  timeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

