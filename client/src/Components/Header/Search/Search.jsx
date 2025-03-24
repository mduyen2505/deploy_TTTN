import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "./Style.css";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();

    // Gọi API lấy danh sách sản phẩm
    useEffect(() => {
        fetch("http://localhost:3000/api/products")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    // Xử lý tìm kiếm khi nhập từ khóa
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredProducts([]);
        } else {
            const filtered = products.filter((product) => {
                const searchLower = searchTerm.toLowerCase();
    
                return (
                    (product.name && product.name.toLowerCase().includes(searchLower)) ||
                    (product.ingredients && product.ingredients.some(ingredient =>
                        ingredient && ingredient.toLowerCase().includes(searchLower)
                    )) ||
                    (product.brandId && product.brandId.toLowerCase().includes(searchLower)) ||
                    (product.typeId && product.typeId.toLowerCase().includes(searchLower))
                );
            });
    
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    // Chuyển hướng sang trang chi tiết sản phẩm
    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="headerSearch ml-3 mr-3">
            <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button>
                <IoSearch />
            </Button>

            {/* Danh sách sản phẩm tìm kiếm */}
            {filteredProducts.length > 0 && (
                <div className="searchResults">
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="searchItem"
                            onClick={() => handleProductClick(product._id)}
                        >
                            <img src={`http://localhost:3000/images/${product.image}`} alt={product.name} />
                            <div>
                                <p className="productName">{product.name}</p>
                                <p className="productPrice">{product.promotionPrice?.toLocaleString()} VND</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
