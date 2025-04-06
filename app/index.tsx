import { useState, useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View, TextInput, Pressable, Dimensions } from "react-native";
import { Link, useRouter } from "expo-router";
import { Product } from "../types";
import { fetchProducts, fetchCategories } from "../api/products";
import { User, logout, getCurrentUser} from "../api/auth";

export default function HomeScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const user = getCurrentUser();

  const isAuth = user !== null;

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

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
    let result = allProducts;
    
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, allProducts]);

  if (loading) return <Text style={styles.loading}>Loading products...</Text>;

  return (
    <View style={styles.container}>
      {/* Search Field (shown above categories on small screens) */}

      <View style={styles.header}>
        {user ? (
          <View style={styles.userContainer}>
            <Text style={styles.userText}>Welcome, {user.name}</Text>
            <Pressable onPress={handleLogout} style={styles.authButton}>
              <Text style={styles.authButtonText}>Logout</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={handleLogin} style={styles.authButton}>
            <Text style={styles.authButtonText}>Login</Text>
          </Pressable>
        )}
      </View>
      <View style={[styles.searchContainer, isSearchFocused && styles.searchContainerFocused]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </View>

      {/* Category Filter Row */}
      <View style={styles.categoryScrollContainer}>
        <FlatList
          horizontal
          data={['all', ...categories]}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.categoryItem, 
                (item === 'all' ? !selectedCategory : selectedCategory === item) && styles.activeCategory
              ]}
              onPress={() => setSelectedCategory(item === 'all' ? null : item)}
            >
              <Text style={[
                styles.categoryText,
                (item === 'all' ? !selectedCategory : selectedCategory === item) && styles.activeCategoryText
              ]}>
                {item === 'all' ? 'All' : item}
              </Text>
            </Pressable>
          )}
          keyExtractor={(item) => item}
        />
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found matching your criteria</Text>
        }
      />
    </View>
  );
}

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

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
  searchContainer: {
    marginBottom: 12,
  },
  searchContainerFocused: {
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: isSmallScreen ? 14 : 16,
  },
  categoryScrollContainer: {
    marginBottom: 16,
  },
  categoryContainer: {
    gap: 8,
    paddingRight: 16, // Extra padding to ensure last item is not cut off
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
  categoryItem: {
    paddingHorizontal: isSmallScreen ? 10 : 12,
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
    fontSize: isSmallScreen ? 12 : 14,
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  authButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#2f95dc',
  },
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userText: {
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2f95dc',
    padding: 16,
    borderRadius: 30,
    elevation: 4,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});