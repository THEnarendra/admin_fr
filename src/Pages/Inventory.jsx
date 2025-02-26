import React, { useContext, useState } from "react";
import { ProductContext } from "../Context/ProductContext";
import Loader from "../components/Loader";
import "../Styles/Inventory.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { toast } from "react-hot-toast"; // Import toast notifications
import { Navigate } from "react-router-dom";
import api from "../api";

const Inventory = () => {
  const { products, loading, error, refreshProducts } = useContext(ProductContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate =useNavigate();

  if (loading) return <Loader />;
  if (error) return <p className="error">{error}</p>;

  // Filtering products based on search query
  const filteredProducts = products.filter((product) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      product?.productName?.toLowerCase().includes(lowerQuery) ||
      product?.category?.toLowerCase().includes(lowerQuery) ||
      product?.subCategory?.toLowerCase().includes(lowerQuery) ||
      product?.skuID?.toLowerCase().includes(lowerQuery)
    );
  });

  const handleDelete = async (productId) => {
    console.log("Deleting product with ID:", productId); // Check if function is triggered
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
        const response = await axios.delete(`${api}/admin/product/${productId}`);
        console.log("Response from server:", response.data);
  

        toast.success(response.data.message);
        refreshProducts(); // Refresh product list after deletion
    } catch (error) {
        toast.error("Failed to delete product");
        console.error("Error deleting product:", error.response?.data || error);
        console.log(error)
    }
};


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="inventory">
      <div className="inventory-header">
        <h2>Inventory</h2>
        <button className="create-listing-btn">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/createListing">Create New Listing +</Link>
        </button>

        <input
          type="text"
          placeholder="Search by Name, Category, SKU..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="search-bar"
        />
      </div>

      <div className="product-list">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img
                  src={product?.productImages?.[0]?.url || "https://via.placeholder.com/100"}
                  alt={product?.productName || "Product Image"}
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product?.productName || "Unnamed Product"}</h3>
                <p className="product-category">Category: {product?.category || "No Category"}</p>
                <p className="product-category">Type: {product?.subCategory || "No Sub-Category"}</p>
                <p className="product-category">SKU ID: {product?.skuID}</p>
              </div>
              <div className="product-actions">
              <button 
              className="edit-btn" 
              onClick={() => navigate(`/createListing/${product._id}`, { state: { product } })}
              >
                Edit
              </button>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="mx-4 delete-btn"
                >
                  Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No matching products found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage)))
          }
          disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Inventory;
