import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
            tabBarActiveTintColor: "#ffd33d",
            headerStyle: {
                backgroundColor: "#25292e",
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            tabBarStyle: {
                backgroundColor: "#25292e",
          },
        }}
    >
    <Tabs.Screen name="index"
        options={{
        headerTitle: "Home",
        tabBarLabel: "Home",
        tabBarIcon: ({focused, color}) => <Ionicons 
            name={focused ? "home-sharp" : "home-outline"}
            size={24}
            color={color}
        />
      }}/>
      <Tabs.Screen name="search" 
        options={{
        headerTitle: "Search",
        tabBarLabel: "Search",
        tabBarIcon: ({focused, color}) => <Ionicons
            name={focused ? "search" : "search-outline"}
            size={24}
            color={color}
        />
      }}/>

    <Tabs.Screen name="favorites" 
        options={{
        headerTitle: "Favorites",
        tabBarLabel: "Favorites",
        tabBarIcon: ({focused, color}) => <Ionicons
            name={focused ? "star" : "star-outline"}
            size={24}
            color={color}
        />
      }}/>

      <Tabs.Screen name="+not-found" 
      options={{
      }}/>
    </Tabs>
  );
}
