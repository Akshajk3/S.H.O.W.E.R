import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useContext, useState } from "react";
import { FavoritesContext } from "@/context/FavoritesContext";

export default function FavoritesScreen() {
  const { favorites } = useContext(FavoritesContext); // Access the context
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePlantPress = (plant) => {
    setSelectedPlant(plant);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPlant(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.text}>No favorites yet!</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.plantItem}
              onPress={() => handlePlantPress(item)}
            >
              <Image
                source={{
                  uri: item.default_image?.thumbnail || "https://via.placeholder.com/150",
                }}
                style={styles.plantImage}
                resizeMode="cover"
              />
              <Text style={styles.plantName}>
                {item.common_name || "Unknown Plant"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedPlant && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <Image
                source={{
                  uri: selectedPlant.default_image?.regular || "https://via.placeholder.com/150",
                }}
                style={styles.plantImageLarge}
                resizeMode="cover"
              />
              <Text style={styles.header}>{selectedPlant.common_name || "Unknown Plant"}</Text>
              <Text style={styles.subHeader}>
                Scientific Name: {selectedPlant.scientific_name?.join(", ") || "N/A"}
              </Text>
              <Text style={styles.text}>Type: {selectedPlant.type || "N/A"}</Text>
              <Text style={styles.text}>
                Watering Needs: {selectedPlant.watering || "N/A"} ({selectedPlant.watering_general_benchmark?.value || "N/A"} days)
              </Text>
              <Text style={styles.text}>
                Sunlight: {selectedPlant.sunlight?.join(", ") || "N/A"}
              </Text>
              <Text style={styles.text}>
                Pruning Months: {selectedPlant.pruning_month?.join(", ") || "N/A"}
              </Text>
              <Text style={styles.text}>
                Growth Rate: {selectedPlant.growth_rate || "N/A"}
              </Text>
              <Text style={styles.text}>
                Maintenance: {selectedPlant.maintenance || "N/A"}
              </Text>
              <Text style={styles.text}>
                Description: {selectedPlant.description || "No description available."}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  row: {
    justifyContent: "space-between",
    marginTop: 10,
  },
  plantItem: {
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  plantImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  plantName: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 20,
    justifyContent: "center",
  },
  modalContent: {
    flex: 1,
    marginBottom: 20,
  },
  plantImageLarge: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  header: {
    color: "#ffd33d",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#ffd33d",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#25292e",
    fontSize: 16,
    fontWeight: "bold",
  },
});