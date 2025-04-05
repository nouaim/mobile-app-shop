import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const CartIcon = ({ count = 0 }: { count?: number }) => {
  return (
    <View style={styles.container}>
      <FontAwesome name="shopping-cart" size={24} color="black" />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.count}>{count}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CartIcon;