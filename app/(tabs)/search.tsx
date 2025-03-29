import { View, StyleSheet, Alert, Text, FlatList, Image, TouchableOpacity } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { useState, useContext } from "react";
import Searcher from "@/components/Searcher";
import { FavoritesContext } from "@/context/FavoritesContext";
import FavoriteButton from "@/components/FavoriteButton";

export default function Search() {
  const [plants, setPlants] = useState<{ id: number; [key: string]: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [watering, setWatering] = useState("minimum"); // Default watering option
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to toggle dropdown
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);

  const isFavorite = (plantId: number) =>
    favorites.some((favorite) => favorite.id === plantId);

  const toggleFavorite = (plant: any) => {
    if (isFavorite(plant.id)) {
      removeFavorite(plant.id);
    } else {
      addFavorite(plant);
    }
  };

  const fetchPlantsBySearch = async (query: string) => {
    if (!query.trim()) {
      Alert.alert("Error", "Please enter a search term");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `https://perenual.com/api/v2/species-list?key=sk-rvFs67e86c2be64c69495&q=${query}&watering=${watering}`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);
        Alert.alert("Error", `API Error: ${response.status} ${response.statusText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const filteredPlants = data.data.filter(
          (plant: any) => plant.default_image?.thumbnail
        );
        setPlants(filteredPlants);

        if (filteredPlants.length === 0) {
          Alert.alert("No Results", "No plants with thumbnails found for your search.");
        }
      } else {
        Alert.alert("No Results", "No plants found for your search.");
        setPlants([]);
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
      Alert.alert("Error", "Failed to fetch plants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWateringChange = async (option: string) => {
    setWatering(option);
    setDropdownOpen(false);

    // Wait for the state to update before triggering the search
    if (searchQuery.trim()) {
      await new Promise((resolve) => setTimeout(resolve, 0)); // Ensure state updates
      fetchPlantsBySearch(searchQuery);
    }
  };

  return (
    <View style={styles.container}>
      <Searcher
        placeholder="Search for Plants"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmit={() => fetchPlantsBySearch(searchQuery)}
      />
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setDropdownOpen(!dropdownOpen)}
        >
          <Text style={styles.dropdownHeaderText}>
            Sort by Watering: {watering.charAt(0).toUpperCase() + watering.slice(1)}
          </Text>
        </TouchableOpacity>
        {dropdownOpen && (
          <View style={styles.dropdownOptions}>
            {["minimum", "average", "frequent"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownOption,
                  watering === option && styles.selectedOption,
                ]}
                onPress={() => handleWateringChange(option)}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    watering === option && styles.selectedOptionText,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.plantItem}>
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
            <FavoriteButton
              isFavorite={isFavorite(item.id)}
              onPress={() => toggleFavorite(item)}
              size="small"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 10,
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  dropdownHeader: {
    backgroundColor: "#ffd33d",
    padding: 10,
    borderRadius: 5,
  },
  dropdownHeaderText: {
    color: "#25292e",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownOptions: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 5,
  },
  dropdownOption: {
    padding: 10,
  },
  selectedOption: {
    backgroundColor: "#ffd33d",
  },
  dropdownOptionText: {
    color: "#25292e",
    fontSize: 14,
  },
  selectedOptionText: {
    fontWeight: "bold",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
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
    color: "white",
    fontSize: 14,
    marginTop: 5,
  },
});