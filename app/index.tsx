import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';

const App = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [backgroundOpacity] = useState(new Animated.Value(0));
  const [notes, setNotes] = useState({
    '2025-03-11': [
      { time: '10h - 12h', note: 'Reunião com equipe' },
      { time: '14h - 16h', note: 'Projeto final' },
      { time: '16h - 17h', note: 'Chamada com cliente' }
    ],
    '2025-03-12': [
      { time: '09h - 10h', note: 'Consulta médica' },
      { time: '11h - 12h', note: 'Entrega de relatório' }
    ]
  });

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
    Animated.timing(backgroundOpacity, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(backgroundOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#FF6347' },
        }}
        theme={{
          backgroundColor: '#A80742',
          calendarBackground: '#810e13',
          textSectionTitleColor: '#FFFFFF',
          selectedDayBackgroundColor: '#FF6347',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#FFA500',
          dayTextColor: '#FFFFFF',
          textDisabledColor: '#666666',
          dotColor: '#FF6347',
          selectedDotColor: '#FFFFFF',
          arrowColor: '#FFA500',
          monthTextColor: '#FFFFFF',
          indicatorColor: '#FFA500',
        }}
      />
      
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalBackground, { opacity: backgroundOpacity }]} />
        <TouchableOpacity style={styles.modalWrapper} activeOpacity={1} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Anotações para {selectedDate || '...'}</Text>
            <FlatList
              data={notes[selectedDate] || []}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTime}>{item.time}</Text>
                  <Text style={styles.cardNote}>{item.note}</Text>
                </View>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#640D14' },
  modalBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black' },
  modalWrapper: { flex: 1, justifyContent: 'flex-end' },
  modalContainer: { height: '50%', width: '100%', backgroundColor: '#ae2831', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#FFFFFF' },
  card: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  cardTime: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardNote: { fontSize: 14, color: '#666', marginTop: 5 },
});

export default App;
