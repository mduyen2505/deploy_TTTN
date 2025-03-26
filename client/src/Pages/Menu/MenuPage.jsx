import React, { useState, useEffect } from "react";
import Footer from "../../Components/Footer/Footer";
import ProductCard from "../../Components/ProductCard/ProductCard";
import Header from "../../Components/Header/Header";
import "./Style.css";
import Filter from "../../Components/Filters/Filters";
import { ALL_PRODUCTS } from "../../config/ApiConfig";

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const [filteredProducts, setFilteredProducts] = useState([]);

  // State để quản lý khoảng giá được chọn
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(ALL_PRODUCTS);
        if (!response.ok)
          throw new Error(`Lỗi HTTP! Status: ${response.status}`);

        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hàm áp dụng bộ lọc
  const applyFilters = () => {
    const filtered = products.filter((product) => {
      const priceMatch = selectedPriceRange.some((range) => {
        const [min, max] = range.split("-").map((v) => parseInt(v));
        if (isNaN(max)) return product.price >= min;
        return product.price >= min && product.price <= max;
      });

      return priceMatch;
    });

    setFilteredProducts(filtered);
  };

  // Tính toán số trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="menu-page">
      <Header />
      <div className="main-content">
        <Filter
          setSelectedPriceRange={setSelectedPriceRange}
          applyFilters={applyFilters}
        />
        <section className="products-wrapper">
          <div className="products-container">
            {loading ? (
              <p>Đang tải sản phẩm...</p>
            ) : currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>Không có sản phẩm nào.</p>
            )}
          </div>
          <div className="pagination-container">
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;
