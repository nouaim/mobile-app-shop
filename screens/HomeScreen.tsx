import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { Product, RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get<Product[]>('https://fakestoreapi.com/products')
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.productCard}
            onPress={() => navigation.navigate('Product', { product: item })}
          >
            {/* ... (same styling as before) */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};