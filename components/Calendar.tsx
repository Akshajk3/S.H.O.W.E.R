import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const formatDate = (date) => {
    return date.toDateString();
  };

  return (
    <View style={styles.container}>
      <FontAwesome
        name="chevron-left"
        size={24}
        color="#fff"
        onPress={handlePrevDay}
      />
      <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      <FontAwesome
        name="chevron-right"
        size={24}
        color="#fff"
        onPress={handleNextDay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    color: "#fff",
  },
});
