import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Product } from "../types";
import { fetchProducts, fetchCategories } from "../api/products";
import { User, canPerformAction, logout, getCurrentUser } from "../api/auth";
import { useLanguage } from "../context/LanguageContext";

const LanguageToggle = () => {
  const { isRTL, toggleLanguage } = useLanguage();
  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      style={[styles.button, isRTL && styles.rtlButton]}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{isRTL ? "EN" : "AR"}</Text>
    </TouchableOpacity>
  );
};

const ProductCard = ({ item }: { item: Product }) => {
  const { isRTL, translate, translateText } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState(item.title);
  const router = useRouter();

  useEffect(() => {
    if (isRTL) {
      const translateTitle = async () => {
        const result = await translateText(item.title);
        setTranslatedTitle(result);
      };
      translateTitle();
    }
  }, [item.title, isRTL, translateText]);

  return (
    <Pressable
      style={[styles.productCard, isRTL && styles.rtlProductCard]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={[styles.productInfo, isRTL && styles.rtlProductInfo]}>
        <Text style={[styles.productTitle, isRTL && styles.rtlText]}>
          {translatedTitle}
        </Text>
        <Text style={[styles.productPrice, isRTL && styles.rtlText]}>
          {translate("price")}: ${item.price.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
};

const CategoryItem = ({
  item,
  selectedCategory,
  onSelect,
}: {
  item: string;
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}) => {
  const isActive = item === "all" ? !selectedCategory : selectedCategory === item;
  return (
    <Pressable
      style={[styles.categoryItem, isActive && styles.activeCategory]}
      onPress={() => onSelect(item === "all" ? null : item)}
    >
      <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>
        {item === "all" ? "All" : item}
      </Text>
    </Pressable>
  );
};

// Main Component
export default function HomeScreen() {
  const { isRTL, translate } = useLanguage();
  const router = useRouter();
  const [state, setState] = useState({
    allProducts: [] as Product[],
    filteredProducts: [] as Product[],
    categories: [] as string[],
    selectedCategory: null as string | null,
    searchQuery: "",
    loading: true,
    isSearchFocused: false,
    user: null as User | null,
    isAuth: false,
  });

  const { width } = Dimensions.get("window");
  const isSmallScreen = width < 375;

  // Handlers
  const handleLogout = async () => {
    await logout();
    setState(prev => ({ ...prev, user: null, isAuth: false }));
    router.push("/");
  };

  const handleLogin = () => router.push("/login");

  const filterProducts = () => {
    let result = state.allProducts;

    if (state.selectedCategory) {
      result = result.filter(p => p.category === state.selectedCategory);
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    setState(prev => ({ ...prev, filteredProducts: result }));
  };

  // Effects
  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setState(prev => ({ ...prev, user: currentUser, isAuth: currentUser !== null }));
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setState(prev => ({
          ...prev,
          allProducts: productsData,
          filteredProducts: productsData,
          categories: categoriesData,
          loading: false,
        }));
      } catch (error) {
        console.error(error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    loadData();
  }, []);

  useEffect(filterProducts, [state.selectedCategory, state.searchQuery, state.allProducts]);

  if (state.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>{translate("loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <View style={styles.headerActions}>
          <LanguageToggle />
          
          {state.user ? (
            <View style={styles.userContainer}>
              <Text style={styles.userText}>
                {translate("welcome")}, {state.user.name}
              </Text>
              <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
                <FontAwesome name="sign-out" size={20} color="#2f95dc" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.buttonText}>{translate("login")}</Text>
              <FontAwesome name="sign-in" size={16} color="#2f95dc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={translate("search_placeholder")}
          value={state.searchQuery}
          onChangeText={text => setState(prev => ({ ...prev, searchQuery: text }))}
          clearButtonMode="while-editing"
          onFocus={() => setState(prev => ({ ...prev, isSearchFocused: true }))}
          onBlur={() => setState(prev => ({ ...prev, isSearchFocused: false }))}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoryScrollContainer}>
        <FlatList
          horizontal
          data={["all", ...state.categories]}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
          renderItem={({ item }) => (
            <CategoryItem
              item={item}
              selectedCategory={state.selectedCategory}
              onSelect={(category) => setState(prev => ({ ...prev, selectedCategory: category }))}
            />
          )}
          keyExtractor={item => item}
        />
      </View>

      {/* Create Button */}
      {state.isAuth && canPerformAction("create") && (
        <Pressable
          style={styles.createButton}
          onPress={() => router.push("/product/create/")}
        >
          <FontAwesome name="plus" size={20} color="white" />
          <Text style={styles.createButtonText}>{translate("create_product")}</Text>
        </Pressable>
      )}

      {/* Products List */}
      <FlatList
        data={state.filteredProducts}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{translate("no_products_found")}</Text>
        }
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rtlHeader: {
    flexDirection: "row-reverse",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  rtlButton: {
    backgroundColor: "#e0e0e0",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#2f95dc",
    fontSize: 14,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userText: {
    fontSize: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  loginButton: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2f95dc",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  categoryScrollContainer: {
    marginBottom: 16,
  },
  categoryContainer: {
    gap: 8,
    paddingRight: 16,
  },
  categoryItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeCategory: {
    backgroundColor: "#2f95dc",
    borderColor: "#2f95dc",
  },
  categoryText: {
    textTransform: "capitalize",
    fontSize: 12,
  },
  activeCategoryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  createButton: {
    flexDirection: "row",
    backgroundColor: "#2f95dc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  rtlProductCard: {
    flexDirection: "row-reverse",
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  productInfo: {
    padding: 12,
  },
  rtlProductInfo: {
    alignItems: "flex-end",
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
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});