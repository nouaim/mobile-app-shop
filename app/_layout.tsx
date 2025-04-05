import { Stack } from "expo-router";
import { CartProvider } from "@/context/CartContext";
import { StyleSheet, View } from "react-native";
import CartIcon from "../components/CartIcon";
import { ToastProvider } from "react-native-toast-notifications";

export default function RootLayout() {
  return (
    <ToastProvider>
      <CartProvider>
        <View style={styles.container}>
          <Stack
            screenOptions={{
              headerTitle: "Fake Store",
              headerRight: () => <CartIcon />,
              headerStyle: styles.header,
              headerTitleStyle: styles.headerTitle,
            }}
          />
        </View>
      </CartProvider>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2f95dc",
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
  },
});
