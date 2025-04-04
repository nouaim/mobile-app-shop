import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useCart } from '@/context/CartContext';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function CartScreen() {
  const { cart, removeFromCart } = useCart();

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <FontAwesome name="shopping-cart" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Link href="/" style={styles.continueShopping}>
            Continue Shopping
          </Link>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <Pressable 
                  onPress={() => removeFromCart(item.id)}
                  style={styles.removeButton}
                >
                  <FontAwesome name="trash" size={20} color="#ff4444" />
                </Pressable>
              </View>
            )}
          />
          <View style={styles.checkoutContainer}>
            <Text style={styles.total}>
              Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </Text>
            <Pressable style={styles.checkoutButton}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  emptyText: {
    fontSize: 18,
    color: '#666'
  },
  continueShopping: {
    color: '#2f95dc',
    fontSize: 16,
    fontWeight: '600'
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  itemInfo: {
    flex: 1
  },
  itemTitle: {
    fontSize: 16
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f95dc'
  },
  removeButton: {
    padding: 8
  },
  checkoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16
  },
  checkoutButton: {
    backgroundColor: '#2f95dc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});