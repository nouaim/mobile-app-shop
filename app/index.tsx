import { useState, useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Product } from "../types";
import { fetchProducts } from "../api/products";
export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((res) => {
        setProducts(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Text style={styles.loading}>Loading products...</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  list: {
    gap: 16,
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    color: "#2f95dc",
    fontWeight: "bold",
  },
});
