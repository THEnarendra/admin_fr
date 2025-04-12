import React, { useState } from "react";
import "../Styles/CreateListing.css";
import axios from "axios";
import api from "../api";

const CreateListing = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [skuID, setSkuID] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Amazon-style image upload state
  const [imagePreviews, setImagePreviews] = useState([
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
  ]);

  // Handle individual image upload
  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index] = {
      file,
      preview: URL.createObjectURL(file)
    };
    setImagePreviews(updatedPreviews);
    
    // Clear the file input value to allow re-uploading
    event.target.value = null;
  };

  // Remove individual image
  const removeImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index] = { file: null, preview: null };
    setImagePreviews(updatedPreviews);
  };

  // Add a New Variant
  const addVariant = () => {
    setVariants([
      ...variants,
      { variantName: "", options: [{ value: "", price: { newPrice: "", oldPrice: "" }, stock: "" }] }
    ]);
  };

  // Add a New Option to a Variant
  const addOptionToVariant = (variantIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options.push({ value: "", price: { newPrice: "", oldPrice: "" }, stock: "" });
    setVariants(updatedVariants);
  };

  // Update Variant Data
  const updateVariant = (variantIndex, optionIndex, field, value) => {
    const updatedVariants = [...variants];
    if (field.includes("price.")) {
      const [key, subKey] = field.split(".");
      updatedVariants[variantIndex].options[optionIndex].price[subKey] = value;
    } else {
      updatedVariants[variantIndex].options[optionIndex][field] = value;
    }
    setVariants(updatedVariants);
  };

  // Update Variant Name
  const updateVariantName = (variantIndex, value) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].variantName = value;
    setVariants(updatedVariants);
  };

  // Remove Variant
  const removeVariant = (variantIndex) => {
    setVariants(variants.filter((_, i) => i !== variantIndex));
  };

  // Remove Option from a Variant
  const removeOption = (variantIndex, optionIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options = updatedVariants[variantIndex].options.filter((_, i) => i !== optionIndex);
    setVariants(updatedVariants);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("productName", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("skuID", skuID);
    formData.append("hasVariants", hasVariants);

    if (!hasVariants) {
      formData.append("basePrice", price);
      formData.append("stock", stock);
    } else {
      formData.append("variants", JSON.stringify(variants));
    }

    // Add only the uploaded images to formData
    imagePreviews.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      }
    });

    try {
      const response = await axios.post(
        // `http://localhost:5000/api/v1/admin/addProduct`, 
        `${api}/admin/addProduct`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        alert("Product created successfully!");
        resetForm();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  // Reset Form After Submission
  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setSkuID("");
    setPrice("");
    setStock("");
    setImagePreviews([
      { file: null, preview: null },
      { file: null, preview: null },
      { file: null, preview: null },
      { file: null, preview: null },
      { file: null, preview: null },
    ]);
    setHasVariants(false);
    setVariants([]);
  };

  return (
    <div className="create-listing-container">
      <h2>Create Product Listing</h2>
      <form onSubmit={handleSubmit} className="create-listing-form">
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="text" placeholder="Sub Category" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required />
        <input type="text" placeholder="SKU ID" value={skuID} onChange={(e) => setSkuID(e.target.value)} required />

        {!hasVariants && (
          <>
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </>
        )}

        {/* Amazon-style image upload section */}
        <div className="image-upload-section">
          <h3>Product Images</h3>
          <p>Upload up to 5 images (First image will be the main display)</p>
          
          <div className="image-upload-grid">
            {imagePreviews.map((image, index) => (
              <div key={index} className="image-upload-box">
                {image.preview ? (
                  <div className="image-preview-container">
                    <img src={image.preview} alt={`Preview ${index}`} />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="upload-placeholder">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      style={{ display: 'none' }}
                    />
                    <span>+</span>
                    <p>Upload Image {index + 1}</p>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        <label>
          <input type="checkbox" checked={hasVariants} onChange={() => setHasVariants(!hasVariants)} />
          Does this product have variations?
        </label>

        {hasVariants && (
          <div className="variant-section">
            {variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="variant-group">
                <input type="text" placeholder="Variant Name" value={variant.variantName} onChange={(e) => updateVariantName(variantIndex, e.target.value)} required />
                {variant.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="variant-option">
                    <input type="text" placeholder="Option Value" value={option.value} onChange={(e) => updateVariant(variantIndex, optionIndex, "value", e.target.value)} required />
                    <input type="number" placeholder="New Price" value={option.price.newPrice} onChange={(e) => updateVariant(variantIndex, optionIndex, "price.newPrice", e.target.value)} required />
                    <input type="number" placeholder="Old Price" value={option.price.oldPrice} onChange={(e) => updateVariant(variantIndex, optionIndex, "price.oldPrice", e.target.value)} required />
                    <input type="number" placeholder="Stock" value={option.stock} onChange={(e) => updateVariant(variantIndex, optionIndex, "stock", e.target.value)} required />
                    <button type="button" onClick={() => removeOption(variantIndex, optionIndex)}>Remove Option</button>
                  </div>
                ))}
                <button type="button" onClick={() => addOptionToVariant(variantIndex)}>Add Option</button>
                <button type="button" onClick={() => removeVariant(variantIndex)}>Remove Variant</button>
              </div>
            ))}
            <button type="button" onClick={addVariant}>Add Variant</button>
          </div>
        )}

        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Create Listing"}</button>
      </form>
    </div>
  );
};

export default CreateListing;