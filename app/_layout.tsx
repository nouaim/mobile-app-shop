import { Stack } from 'expo-router';
import { CartProvider } from '@/context/CartContext';
import { StyleSheet, View } from 'react-native';
import CartIcon from '../components/CartIcon';

export default function RootLayout() {
  return (
    <CartProvider>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerTitle: 'Fake Store',
            headerRight: () => <CartIcon />,
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle
          }}
        />
      </View>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#2f95dc'
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold'
  }
});