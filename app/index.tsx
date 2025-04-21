import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button,
  FlatList, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const STORAGE_KEY = '@tasks';

export default function Index() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);


  useEffect(() => {
    loadTasks();
  }, []);


  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setTasks(JSON.parse(data));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as tarefas');
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as tarefas');
    }
  };

  const handleAddTask = () => {
    if (task.trim() === '') return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: task,
      completed: false,
    };

    setTasks(prev => [...prev, newTask]);
    setTask('');
  };

  const toggleComplete = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={() => toggleComplete(item.id)}>
        <Text style={[styles.taskText, item.completed && styles.completed]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a task"
          value={task}
          onChangeText={setTask}
        />
        <Button title="ADD" onPress={handleAddTask} />
      </View>

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 60, 
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#ccc',
    padding: 10, marginRight: 10, borderRadius: 5,
  },
  taskContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 15, borderBottomWidth: 1, borderColor: '#eee',
  },
  taskText: { fontSize: 16 },
  completed: { textDecorationLine: 'line-through', color: 'gray' },
  deleteText: { color: 'blue' },
});
