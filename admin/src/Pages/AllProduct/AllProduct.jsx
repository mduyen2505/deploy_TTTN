import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  API_PRODUCT,
  API_CATEGORY,
  API_SUBCATEGORY,
  API_BRAND,
} from "../../ApiConfig";
import "./AllProduct.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [responseText, setResponseText] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [productData, setProductData] = useState({
    name: "",
    subCategoryId: "",
    typeId: "",
    brandId: "",
    quantityInStock: 0,
    price: 0,
    discount: 0,
    image: "",
    isFeatured: false,
    ingredients: "",
    usageInstructions: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      fetchReviews(selectedProductId);
    }
  }, [selectedProductId]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_PRODUCT.GET_ALL);
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_CATEGORY.GET_ALL);
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục cha:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(API_SUBCATEGORY.GET_ALL);
      setSubCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục con:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(API_BRAND.GET_ALL);
      setBrands(
        Array.isArray(response.data)
          ? response.data
          : response.data.brands || []
      );
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
      setError("Không thể tải danh sách thương hiệu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const response = await fetch(
        `https://deploytttn-production.up.railway.app/api/reviews/${productId}`
      );
      const data = await response.json();
      if (data.reviews && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        console.error("Dữ liệu không hợp lệ:", data);
        setReviews([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách đánh giá:", error);
    }
  };

  const handleRespondReview = async () => {
    if (!selectedReviewId || !responseText.trim()) return;

    try {
      const requestBody = { responseText };

      const response = await fetch(
        `https://deploytttn-production.up.railway.app/api/reviews/${selectedReviewId}/respond`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        fetchReviews(selectedProductId);
        setResponseText("");
        setSelectedReviewId(null);
      }
    } catch (error) {
      console.error("Lỗi khi phản hồi đánh giá:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setProductData({ ...productData, image: URL.createObjectURL(file) });
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setIsEditMode(true);
      setSelectedProductId(product._id);
      setProductData({
        ...product,
        ingredients: product.ingredients ? product.ingredients.join(", ") : "",
      });
    } else {
      setIsEditMode(false);
      setProductData({
        name: "",
        subCategoryId: "",
        typeId: "",
        brandId: "",
        quantityInStock: 0,
        price: 0,
        discount: 0,
        image: "",
        isFeatured: false,
        ingredients: "",
        usageInstructions: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedProductId(null);
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setSelectedProductId(product._id);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
    setSelectedProductId(null);
  };

  const handleSaveProduct = async () => {
    if (
      !productData.name.trim() ||
      !productData.subCategoryId ||
      !productData.typeId ||
      !productData.brandId ||
      productData.price <= 0
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const requestBody = {
      subCategoryId: productData.subCategoryId,
      typeId: productData.typeId,
      name: productData.name,
      quantityInStock: productData.quantityInStock,
      description: productData.description,
      brandId: productData.brandId,
      price: productData.price,
      discount: productData.discount,
      image: productData.image,
      isFeatured: productData.isFeatured,
      ingredients: productData.ingredients.split(","),
      usageInstructions: productData.usageInstructions,
    };

    try {
      if (isEditMode) {
        console.log("Updating product:", requestBody);
        await axios.put(
          `https://deploytttn-production.up.railway.app/api/products/${selectedProductId}`,
          requestBody,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setProducts(
          products.map((prod) =>
            prod._id === selectedProductId ? { ...prod, ...requestBody } : prod
          )
        );
      } else {
        console.log("Adding new product:", requestBody);
        const response = await axios.post(
          "https://deploytttn-production.up.railway.app/api/products",
          requestBody,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setProducts([...products, response.data]);
      }

      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      console.log("Deleting product with ID:", id);
      await axios.delete(
        `https://deploytttn-production.up.railway.app/api/products/${id}`
      );
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  return (
    <div className="product-page">
      <h1>Quản lý Sản Phẩm</h1>

      <button className="add-product" onClick={() => openModal()}>
        Thêm Sản Phẩm
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">
              {isEditMode ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
            </h2>

            <div className="modal-form">
              <label>Tên sản phẩm</label>
              <input
                type="text"
                value={productData.name}
                onChange={(e) =>
                  setProductData({ ...productData, name: e.target.value })
                }
              />

              <label>Danh mục cha</label>
              <select
                value={productData.typeId}
                onChange={(e) =>
                  setProductData({ ...productData, typeId: e.target.value })
                }
              >
                <option value="">Chọn danh mục cha</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.Type_name}
                  </option>
                ))}
              </select>

              <label>Danh mục con</label>
              <select
                value={productData.subCategoryId}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    subCategoryId: e.target.value,
                  })
                }
              >
                <option value="">Chọn danh mục con</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>

              <label>Thương hiệu</label>
              <select
                value={productData.brandId}
                onChange={(e) =>
                  setProductData({ ...productData, brandId: e.target.value })
                }
              >
                <option value="">Chọn thương hiệu</option>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.title}
                    </option>
                  ))
                ) : (
                  <option disabled>Không có thương hiệu nào</option>
                )}
              </select>

              <label>Số lượng tồn kho</label>
              <input
                type="number"
                value={productData.quantityInStock}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    quantityInStock: e.target.value,
                  })
                }
              />

              <label>Giá</label>
              <input
                type="number"
                value={productData.price}
                onChange={(e) =>
                  setProductData({ ...productData, price: e.target.value })
                }
              />

              <label>Giảm giá (%)</label>
              <input
                type="number"
                value={productData.discount}
                onChange={(e) =>
                  setProductData({ ...productData, discount: e.target.value })
                }
              />

              <label>Chọn ảnh sản phẩm</label>
              <input
                type="text"
                value={productData.image}
                onChange={(e) =>
                  setProductData({ ...productData, image: e.target.value })
                }
              />

              <label>Mô tả sản phẩm</label>
              <textarea
                value={productData.description}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    description: e.target.value,
                  })
                }
              />

              <label>Hướng dẫn sử dụng</label>
              <textarea
                value={productData.usageInstructions}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    usageInstructions: e.target.value,
                  })
                }
              />

              <label>Thành phần (cách nhau bằng dấu phẩy)</label>
              <input
                type="text"
                value={productData.ingredients}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    ingredients: e.target.value,
                  })
                }
              />

              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={productData.isFeatured}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      isFeatured: e.target.checked,
                    })
                  }
                />
                <span>Sản phẩm nổi bật</span>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="save-product" onClick={handleSaveProduct}>
                {isEditMode ? "Lưu" : "Thêm"}
              </button>
              <button className="cancel-product" onClick={closeModal}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {isDetailModalOpen && selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">Chi tiết sản phẩm</h2>

            <p>
              <strong>Tên:</strong> {selectedProduct.name}
            </p>
            <p>
              <strong>Mô tả:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Thành phần:</strong>{" "}
              {selectedProduct.ingredients.join(", ")}
            </p>
            <p>
              <strong>Hướng dẫn sử dụng:</strong>{" "}
              {selectedProduct.usageInstructions}
            </p>

            <div className="review-management">
              <h2>Đánh giá sản phẩm</h2>
              <div className="review-list">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="review-item">
                      <p>
                        <strong>Người dùng:</strong>{" "}
                        {review.userId ? review.userId.username : "Ẩn danh"}
                      </p>
                      <p>
                        <strong>Nội dung:</strong> {review.comment}
                      </p>
                      <p>
                        <strong>Đánh giá:</strong> {review.rating} ⭐
                      </p>
                      {review.response && (
                        <p>
                          <strong>Phản hồi:</strong> {review.response.text}
                        </p>
                      )}
                      <button onClick={() => setSelectedReviewId(review._id)}>
                        Phản hồi
                      </button>
                    </div>
                  ))
                ) : (
                  <p>Chưa có đánh giá nào.</p>
                )}
              </div>
              {selectedReviewId && (
                <div className="review-response-form">
                  <h3>Phản hồi đánh giá</h3>
                  <textarea
                    placeholder="Nhập phản hồi..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    required
                  />
                  <button onClick={handleRespondReview}>Gửi phản hồi</button>
                  <button onClick={() => setSelectedReviewId(null)}>Hủy</button>
                </div>
              )}
            </div>

            <button className="close-modal" onClick={closeDetailModal}>
              Đóng
            </button>
          </div>
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Giá KM</th>
            <th>Giảm giá (%)</th>
            <th>Kho</th>
            <th>Nổi bật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td style={{ fontSize: "12px", wordWrap: "break-word" }}>
                {product._id}
              </td>
              <td>
                <img
                  src={
                    product.image && product.image.startsWith("http")
                      ? product.image
                      : `https://deploytttn-production.up.railway.app/images/${product.image}`
                  }
                  alt={product.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              </td>
              <td>
                <span
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "blue",
                  }}
                  onClick={() => openProductDetail(product)}
                >
                  {product.name}
                </span>
              </td>
              <td>{product.price.toLocaleString()} đ</td>
              <td>{product.promotionPrice.toLocaleString()} đ</td>
              <td>{product.discount}%</td>
              <td>{product.quantityInStock}</td>
              <td>{product.isFeatured ? "✔" : "✖"}</td>
              <td>
                <button
                  className="edit-product"
                  onClick={() => openModal(product)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="delete-product"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllProduct;
