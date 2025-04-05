import axios from "axios";
import { Product } from "../types";

export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get<Product>(
      `https://fakestoreapi.com/products/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      "https://fakestoreapi.com/products"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(
      "https://fakestoreapi.com/products/categories"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const fetchProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `https://fakestoreapi.com/products/category/${category}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const createProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await axios.post<Product>(
      "https://fakestoreapi.com/products",
      product
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};
export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  try {
    const response = await axios.put<Product>(
      `https://fakestoreapi.com/products/${id}`,
      product
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axios.delete(`https://fakestoreapi.com/products/${id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}
