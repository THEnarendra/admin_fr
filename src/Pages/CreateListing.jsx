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
  const [images, setImages] = useState([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages([...images, ...files]);
  };

  // Remove Image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
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

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
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
    setImages([]);
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

        <label>Upload Images:</label>
        <input type="file" multiple onChange={handleImageUpload} />
        <div className="image-preview-container">
          {images.map((img, index) => (
            <div key={index} className="image-preview">
              <img src={URL.createObjectURL(img)} alt={`Preview ${index}`} />
              <button type="button" onClick={() => removeImage(index)}>X</button>
            </div>
          ))}
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
