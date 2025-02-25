import React from "react";
import { ProductProvider } from "./ProductContext"; // Product Context

const ContextProvider = ({ children }) => {
  return (
    <ProductProvider>
        {children}
    </ProductProvider>
  );
};

export default ContextProvider;
