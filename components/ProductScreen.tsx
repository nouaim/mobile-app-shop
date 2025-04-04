import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';
import { RootStackParamList } from '../types';

type ProductScreenProps = {
  route: RouteProp<RootStackParamList, 'Product'>;
};

const ProductScreen: React.FC<ProductScreenProps> = ({ route }) => {
  const { product } = route.params;
  const { addToCart } = useContext(CartContext);

  return (
    <View>
      <Button 
        title="Add to Cart" 
        onPress={() => addToCart(product)} 
      />
    </View>
  );
};