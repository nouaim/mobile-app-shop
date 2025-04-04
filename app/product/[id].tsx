import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useCart } from "@/context/CartContext";
import { FontAwesome } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import { Product } from "@/types";
import { fetchProduct } from "@/api/products";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const toast = useToast();
  const productId = Number(id);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetchProduct(productId);
        setProduct(response);
      } catch (error) {
        console.error(error);
        toast.show("Failed to load product", { type: "danger" });
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [productId]);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f95dc" />
      </View>
    );

  if (!product)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        placeholder={{ blurhash: "LKN]Rv%2Tw=w]TWBV?Ri%MD$RjR+" }}
        transition={300}
      />

      {/* Product Details */}
      <View style={styles.details}>
        <Text style={styles.title}>{product.title}</Text>

        {/* Price and Rating */}
        <View style={styles.priceRatingContainer}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.rating && (
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {product.rating.rate} ({product.rating.count} reviews)
              </Text>
            </View>
          )}
        </View>

        {/* Category */}
        <View style={styles.categoryContainer}>
          <FontAwesome name="tag" size={16} color="#666" />
          <Text style={styles.category}>{product.category}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{product.description}</Text>

        {/* Add to Cart Button */}
        <Pressable
          style={({ pressed }) => [
            styles.addToCartButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => {
            addToCart(product);
            toast.show("Added to cart!", {
              type: "success",
              placement: "bottom",
            });
          }}
        >
          <FontAwesome name="cart-plus" size={20} color="white" />
          <Text style={styles.buttonText}>Add to Cart</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ff4444",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    backgroundColor: "#f5f5f5",
  },
  details: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    color: "#2f95dc",
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  category: {
    fontSize: 16,
    color: "#666",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 24,
  },
  addToCartButton: {
    flexDirection: "row",
    backgroundColor: "#2f95dc",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
