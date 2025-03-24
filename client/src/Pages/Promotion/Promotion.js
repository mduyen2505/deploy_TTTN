
import React, { useState, useEffect } from "react";
import { getCoupons, ALL_PRODUCTS } from "../../config/ApiConfig";
import ProductCard from "../../Components/ProductCard/ProductCard";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import "./Style.css";

const Promo = () => {
    const [products, setProducts] = useState([]);
    const [vouchers, setVouchers] = useState([]); // Lưu danh sách voucher từ API
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20; // Số sản phẩm mỗi trang

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(ALL_PRODUCTS);
                if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);

                const data = await response.json();
                const discountedProducts = data.filter(product => product.discount > 0);
                setProducts(discountedProducts);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchVouchers = async () => {
            try {
                const response = await fetch(getCoupons);
                if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);

                const data = await response.json();

                if (data && Array.isArray(data.data)) {
                    setVouchers(data.data); // Lấy đúng danh sách voucher từ API
                } else {
                    console.error("Dữ liệu API không đúng:", data);
                    setVouchers([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách voucher:", error);
                setVouchers([]);
            }
        };

        fetchProducts();
        fetchVouchers();
    }, []);

    // Tính toán số trang
    const totalPages = Math.ceil(products.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div className="promo-page">
            <Header />

            {/* Danh sách Voucher */}
            <h2 className="voucher-title">🎉 ƯU ĐÃI ĐẶC BIỆT 🎉</h2>
            <div className="voucher-container">
                {loading ? (
                    <p>Loading vouchers...</p>
                ) : Array.isArray(vouchers) && vouchers.length > 0 ? (
                    vouchers.map((voucher) => (
                        <div key={voucher._id} className="voucher-card">
                            <img
                                src={`http://localhost:3000/images/${voucher.image}`}
                                alt={voucher.name}
                                className="voucher-logo"
                            />
                            <h3 className="voucher-discount">Giảm {voucher.discount}%</h3>
                            <p className="voucher-description">{voucher.description}</p>
                            <p className="voucher-expiry">Hết hạn: {new Date(voucher.expiry).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>Không có voucher nào.</p>
                )}
            </div>

            {/* Danh sách sản phẩm đang giảm giá */}
            <h2 className="product-title">🔥 SẢN PHẨM GIẢM GIÁ 🔥</h2>
            <section className="products-container">
                {loading ? (
                    <p>Loading products...</p>
                ) : currentProducts.length > 0 ? (
                    currentProducts.map((product) => <ProductCard key={product._id} product={product} />)
                ) : (
                    <p>Không có sản phẩm nào đang giảm giá.</p>
                )}
            </section>

            {/* Pagination */}
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
            <Footer /> 

        </div>
    );
};

export default Promo;
