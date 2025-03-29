import { View, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import Calendar from "@/components/Calendar";
import { useNavigation } from "expo-router";

export default function HomeScreen() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Water the plants", time: "9:00 AM" },
    { id: "2", title: "Fertilize the garden", time: "11:00 AM" },
    { id: "3", title: "Prune the roses", time: "3:00 PM" },
  ]);

  const navigation = useNavigation();

  const handleTaskPress = (task) => {
    navigation.navigate("TaskDetails", { task });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to WaterTracker!</Text>
      <Calendar />
      <Text style={styles.subHeader}>Today's Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => handleTaskPress(item)}
          >
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskTime}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffd33d",
    marginBottom: 20,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    color: "#fff",
  },
  taskTime: {
    fontSize: 14,
    color: "#aaa",
  },
});
