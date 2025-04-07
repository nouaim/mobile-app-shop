import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import { Product } from "@/types";
import { fetchProduct, updateProduct, createProduct } from "@/api/products";

interface EditProductScreenProps {
  isCreateMode?: boolean;
}

export default function EditProductScreen({ isCreateMode = false }: EditProductScreenProps) {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Partial<Product>>(isCreateMode ? {
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
  } : {
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (field: keyof Product, value: string | number) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!product.title || !product.description || !product.price) {
      toast.show("Please fill all required fields", { type: "warning" });
      return;
    }

    try {
      setIsSubmitting(true);
      if (isCreateMode) {
        // Call your create API function here
        await createProduct(product as Product);
        setProduct(product);
        toast.show("Product created successfully", { type: "success" });
      } else {
        await updateProduct(productId, product as Product);
        setProduct(product);
        toast.show("Product updated successfully", { type: "success" });
      }
      router.back();
    } catch (error) {
      console.error(error);
      toast.show(`Failed to ${isCreateMode ? "create" : "update"} product`, {
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f95dc" />
      </View>
    );

  if (!product && !isCreateMode)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          placeholder={{ blurhash: "LKN]Rv%2Tw=w]TWBV?Ri%MD$RjR+" }}
          transition={300}
        />
        <Pressable
          style={styles.changeImageButton}
          onPress={() =>
            Alert.alert(
              "Change Image",
              "Image upload functionality would go here"
            )
          }
        >
          <FontAwesome name="camera" size={20} color="white" />
          <Text style={styles.changeImageText}>Change Image</Text>
        </Pressable>
      </View>

      {/* Product Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          value={product.title}
          onChangeText={(text) => handleChange("title", text)}
          placeholder="Enter product name"
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={product.price?.toString()}
          onChangeText={(text) => handleChange("price", parseFloat(text) || 0)}
          placeholder="Enter price"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={product.category}
          onChangeText={(text) => handleChange("category", text)}
          placeholder="Enter category"
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={product.description}
          onChangeText={(text) => handleChange("description", text)}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={product.image}
          onChangeText={(text) => handleChange("image", text)}
          placeholder="Enter image URL"
        />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {isCreateMode ? "Create Product" : "Edit Product"}
              </Text>
            )}
          </Pressable>
        </View>
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
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    backgroundColor: "#f5f5f5",
  },
  changeImageButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  changeImageText: {
    color: "white",
    fontSize: 14,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f44336",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
