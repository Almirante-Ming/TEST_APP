import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { calendarTheme } from '../styles/calendarTheme';

const App = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [backgroundOpacity] = useState(new Animated.Value(0));
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7777/');
        setNotes(response.data || {});
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

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

  const sortedNotes = [...(notes[selectedDate] || [])].sort((a, b) => {
    const getTimeValue = (time) => parseInt(time.split('h')[0]);
    return getTimeValue(a.time) - getTimeValue(b.time);
  });

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#FF6347' },
        }}
        theme={calendarTheme}
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
              data={sortedNotes}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTime}>{item.time}</Text>
                  <Text style={styles.cardNote}>{item.note}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma anotação encontrada</Text>}
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
  emptyText: { fontSize: 14, color: '#DDD', textAlign: 'center', marginTop: 20 },
});

export default App;