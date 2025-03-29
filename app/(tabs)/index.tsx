import { View, StyleSheet, Text, Animated, Alert, Modal, FlatList, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { FavoritesContext } from "@/context/FavoritesContext";
import Button from "@/components/Button";
import RecordButton from "@/components/RecordButton";

export default function Index() {
  const tips = [
    "Water plants early in the morning to reduce evaporation.",
    "Use mulch to retain soil moisture.",
    "Group plants with similar water needs together.",
    "Collect rainwater for watering your plants.",
    "Avoid overwatering by checking soil moisture first.",
    "Fix leaky faucets and pipes to prevent water wastage.",
    "Use a broom instead of a hose to clean driveways and sidewalks.",
    "Install a rain barrel to collect rainwater for outdoor use.",
    "Choose drought-tolerant plants for your garden.",
    "Use a drip irrigation system to water plants efficiently.",
    "Turn off the tap while brushing your teeth.",
    "Use a bucket to wash your car instead of a running hose.",
    "Water your garden during cooler parts of the day to reduce evaporation.",
    "Check your water meter for hidden leaks.",
    "Use native plants in your landscaping to reduce water needs.",
    "Cover your swimming pool to reduce evaporation.",
    "Use greywater (recycled household water) for irrigation.",
    "Install water-efficient fixtures in your home.",
    "Educate your family about water conservation practices.",
    "Only run dishwashers and washing machines with full loads.",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start fully visible

  const [wateringSchedule, setWateringSchedule] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlants, setSelectedPlants] = useState<any[]>([]);
  const { favorites } = useContext(FavoritesContext); // Access favorites

  useEffect(() => {
    const cycleTips = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length); // Update the tip
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    };

    const interval = setInterval(cycleTips, 5000); // Change tip every 5 seconds
    return () => clearInterval(interval);
  }, [fadeAnim, tips.length]);

  const handleDayPress = (day) => {
    const date = day.dateString;

    // Check if the date is already recorded
    if (wateringSchedule[date]) {
      const previouslySelectedPlants = wateringSchedule[date].plants || [];
      setSelectedPlants(previouslySelectedPlants); // Preload previously selected plants
      setSelectedDate(date);
      setModalVisible(true); // Reopen the modal for plant selection
    } else {
      setSelectedPlants([]); // Clear selection for new dates
      setSelectedDate(date);
      setModalVisible(true);
    }
  };

  const togglePlantSelection = (plant) => {
    setSelectedPlants((prev) =>
      prev.includes(plant)
        ? prev.filter((p) => p !== plant) // Unselect plant
        : [...prev, plant] // Select plant
    );
  };

  const recordWateringDate = () => {
    if (selectedPlants.length === 0) {
      // If no plants are selected, clear the watering record for the date
      setWateringSchedule((prev) => {
        const updatedSchedule = { ...prev };
        delete updatedSchedule[selectedDate];
        return updatedSchedule;
      });

      Alert.alert("Watering Cleared", `No plants are watered on ${selectedDate}.`);
      setModalVisible(false);
      return;
    }

    setWateringSchedule((prev) => ({
      ...prev,
      [selectedDate]: {
        marked: true,
        dotColor: "#1E90FF",
        customStyles: styles.wateringStyle,
        plants: selectedPlants, // Save selected plants
      },
    }));

    selectedPlants.forEach((plant) => {
      const benchmark = plant.watering_general_benchmark?.value || "5-7";
      const [minDays, maxDays] = benchmark.split("-").map(Number);
      const nextWateringDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;

      const nextWateringDate = new Date(selectedDate);
      nextWateringDate.setDate(nextWateringDate.getDate() + nextWateringDays);
      const formattedNextDate = nextWateringDate.toISOString().split("T")[0];

      setWateringSchedule((prev) => ({
        ...prev,
        [formattedNextDate]: {
          marked: true,
          dotColor: "#32CD32",
          customStyles: styles.nextWateringStyle,
        },
      }));

      Alert.alert(
        "Watering Recorded",
        `You watered your ${plant.common_name || "Unknown Plant"} on ${selectedDate}. Water it again in ${nextWateringDays} days (${formattedNextDate}).`
      );
    });

    setSelectedPlants([]);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Water Conservation Tips</Text>
      <Animated.Text style={[styles.tip, { opacity: fadeAnim }]}>
        {tips[currentTipIndex]}
      </Animated.Text>

      <Text style={styles.header}>Watering Schedule</Text>
      <Calendar
        markedDates={wateringSchedule}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: "#25292e",
          dayTextColor: "#fff",
          todayTextColor: "#ffd33d",
          arrowColor: "#ffd33d",
          textDayFontWeight: "bold",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "bold",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
          monthTextColor: "#fff", // Set month and year text color to white
        }}
        markingType="custom"
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Select Plants</Text>
      <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
                style={[
                  styles.plantItem,
                  selectedPlants.includes(item) && styles.selectedPlant,
                ]}
                onPress={() => togglePlantSelection(item)}
          >
                <Text style={styles.plantName}>
                  {item.common_name || "Unknown Plant"}
                </Text>
          </TouchableOpacity>
        )}
      />
          <RecordButton label="Record Watering" onPress={recordWateringDate} />
          <RecordButton label="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 10,
  },
  header: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  tip: {
    color: "white",
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 20,
    justifyContent: "center",
  },
  modalHeader: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  plantItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  selectedPlant: {
    backgroundColor: "#ffd33d",
  },
  plantName: {
    color: "#25292e",
    fontSize: 16,
    textAlign: "center",
  },
  nextWateringStyle: {
    container: {
      backgroundColor: "#32CD32",
      borderRadius: 10,
    },
    text: {
      color: "white",
      fontWeight: "bold",
  },
  },
  wateringStyle: {
    container: {
      backgroundColor: "#1E90FF",
      borderRadius: 10,
    },
    text: {
      color: "white",
      fontWeight: "bold",
    },
  },
});