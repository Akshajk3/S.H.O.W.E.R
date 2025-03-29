import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View, Pressable, Text, TextInput } from "react-native";

type Props = {
    placeholder: string;
    onChangeText?: (text: string) => void;
    onSubmit?: () => void;
    value?: string;
};

export default function Searcher({ placeholder, onChangeText, value, onSubmit }: Props) {
    const [isEmpty, setIsEmpty] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const handleTextChange = (text: string) => {
        setIsEmpty(text.length === 0);
        if (onChangeText) {
            onChangeText(text);
        }
    }

    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        setIsFocused(false);
    }

    return (
        <View style={[
            styles.inputContainer,
            {borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18},
        ]}>
            <FontAwesome
                name="search"
                size={18}
                color="#25292e"
                style={styles.inputIcon}
            />
            <TextInput
                style={[
                    styles.input,
                    { textAlign: isEmpty && !isFocused ? "center" : "left"}
                ]}
                placeholder={placeholder}
                placeholderTextColor="#25292e"
                onChangeText={handleTextChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                onSubmitEditing={onSubmit}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#25292e",
    },
});