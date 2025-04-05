import { useState, useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Product } from "../types";
import { fetchProducts, fetchCategories } from "../api/products";
import { Pressable } from "react-native";

export default function HomeScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setAllProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(
        allProducts.filter(product => product.category === selectedCategory)
      );
    } else {
      setFilteredProducts(allProducts);
    }
  }, [selectedCategory, allProducts]);

  if (loading) return <Text style={styles.loading}>Loading products...</Text>;

  return (
    <View style={styles.container}>
      {/* Category Filter Row */}
      <View style={styles.categoryContainer}>
        <Pressable
          style={[styles.categoryItem, !selectedCategory && styles.activeCategory]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.categoryText, !selectedCategory && styles.activeCategoryText]}>
            All
          </Text>
        </Pressable>
        
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[styles.categoryItem, selectedCategory === category && styles.activeCategory]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.activeCategoryText]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Link href={`/product/${item.id}`} asChild>
              <View>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle}>{item.title}</Text>
                  <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                </View>
              </View>
            </Link>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
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
  loading: {
    textAlign: "center",
    marginTop: 20,
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 16,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeCategory: {
    backgroundColor: '#2f95dc',
    borderColor: '#2f95dc',
  },
  categoryText: {
    textTransform: 'capitalize',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});