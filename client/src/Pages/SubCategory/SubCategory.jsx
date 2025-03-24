import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductsBySubcategory, BRANDS } from "../../config/ApiConfig";
import ProductCard from "../../Components/ProductCard/ProductCard";
import "./Style.css";
import Header from "../../Components/Header/Header";
import Filter from "../../Components/Filters/Filters";
import Footer from "../../Components/Footer/Footer";


const SubCategoryPage = () => {
    const { subCategoryId } = useParams(); // Lấy subCategoryId từ URL
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;
    const [selectedBrand, setSelectedBrand] = useState([]); // Lưu danh sách thương hiệu đã chọn
        const [priceRange, setPriceRange] = useState(1000);
    

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = getProductsBySubcategory(subCategoryId);
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);

                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm theo danh mục con:", error);
                setLoading(false);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await fetch(BRANDS);
                const data = await response.json();
                setBrands(data);
            } catch (error) {
                console.error("Lỗi khi lấy thương hiệu:", error);
            }
        };

        fetchProducts();
        fetchBrands();
    }, [subCategoryId]);
     // Tính toán số trang
     const totalPages = Math.ceil(products.length / productsPerPage);
     const indexOfLastProduct = currentPage * productsPerPage;
     const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
     const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

     return (
        <div className="category-page">
            <Header />
            <div className="main-content">
            <Filter
                    selectedBrand={selectedBrand} 
                    setSelectedBrand={setSelectedBrand} 
                    priceRange={priceRange} 
                    setPriceRange={setPriceRange} 
                />
    
                {/* Danh sách sản phẩm + Pagination */}
                <section className="products-wrapper">
                    <div className="products-container">
                        {loading ? (
                            <p>Loading...</p>
                        ) : products.length > 0 ? (
                            products.map((product) => <ProductCard key={product._id} product={product} />)
                        ) : (
                            <p>Không có sản phẩm nào.</p>
                        )}
                    </div>
    
                    {/* Pagination nằm trong .products-wrapper để luôn ở dưới */}
                    <div className="pagination-container">
                        <div className="pagination">
                            <button 
                                disabled={currentPage === 1} 
                                onClick={() => setCurrentPage(prev => prev - 1)}
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
                                onClick={() => setCurrentPage(prev => prev + 1)}
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

export default SubCategoryPage;
