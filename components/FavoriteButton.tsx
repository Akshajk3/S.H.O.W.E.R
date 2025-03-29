import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  isFavorite: boolean;
  onPress: () => void;
  size?: "small" | "large";
};

export default function FavoriteButton({ isFavorite, onPress, size = "large" }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FontAwesome
        name={isFavorite ? "heart" : "heart-o"}
        size={size === "large" ? 32 : 24}
        color={isFavorite ? "red" : "white"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});
