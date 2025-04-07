import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const CartIcon = ({ count = 0 }: { count?: number }) => {
  return (
    <View style={styles.container}>
      <FontAwesome name="shopping-cart" size={24} color="#f8f9fa" />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.count}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 10,
    marginRight: 8,
  },
  badge: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2f95dc',
  },
  count: {
    color: 'white',
    fontSize: 11,
    fontWeight: '900',
    includeFontPadding: false,
    textAlign: 'center',
  },
});

export default CartIcon;