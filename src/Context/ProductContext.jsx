import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/allProducts`);
      const res = await response.json();
      setProducts(res.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to refresh the product list
  const refreshProducts = async () => {
    await fetchProducts();
  };

  return (
    <ProductContext.Provider value={{ products, loading, error, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
