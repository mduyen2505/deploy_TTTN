import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../Components/ProductCard/ProductCard";
import "./Style.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { getProductsbyBrand, getBrandDetails } from "../../config/ApiConfig";

const ProductsbyBrand = () => {
  const { brandId } = useParams(); // Lấy brandId từ URL
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const response = await fetch(getBrandDetails(brandId));
        if (!response.ok)
          throw new Error(`Lỗi HTTP! Status: ${response.status}`);
        const data = await response.json();
        setBrand(data.brand);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin thương hiệu:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(getProductsbyBrand(brandId));
        if (!response.ok)
          throw new Error(`Lỗi HTTP! Status: ${response.status}`);

        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo thương hiệu:", error);
        setLoading(false);
      }
    };

    fetchProducts();
    fetchBrandDetails();
  }, [brandId]);

  return (
    <div className="brand-products-page">
      <Header />
      <div className="container">
        {brand && (
          <div className="brand-header">
            <img
              src={
                brand.image.startsWith("http")
                  ? brand.image
                  : `https://deploytttn-production.up.railway.app/images/${brand.image}`
              }
              alt={brand.title}
              className="brand-logo"
            />
            <div className="brand-info">
              <h2 className="brand-title">{brand.title}</h2>
              <p className="brand-description">{brand.description}</p>
            </div>
          </div>
        )}
        <div className="products-container">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p>Không có sản phẩm nào.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsbyBrand;
