import React, { useState, useEffect } from "react";
import "./Style.css";
import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Đảm bảo imports đúng
// import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
// import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { addToCart } from "../../services/CartService";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../../services/WishlistService";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Tính toán số sao dựa trên averageRating
  const fullStars = Math.floor(product.averageRating || 0);

  // Tạo mảng stars với các icon tương ứng
  // const stars = [...Array(fullStars).fill(faStar), ...(hasHalfStar ? [faStarHalfAlt] : []), ...Array(emptyStars).fill(farStar)];

  const isLoggedIn = !!localStorage.getItem("token");
  const [isFavorite, setIsFavorite] = useState(false);

  // Lấy danh sách wishlist từ server khi tải trang
  useEffect(() => {
    if (!isLoggedIn) {
      setIsFavorite(false);
      return;
    }

    const fetchWishlist = async () => {
      const wishlist = await getWishlist();
      setIsFavorite(wishlist.includes(product._id));
      localStorage.setItem("wishlist", JSON.stringify(wishlist)); // Cập nhật localStorage để đồng bộ
    };

    fetchWishlist();
  }, [product._id, isLoggedIn]);

  // Xử lý thêm/xóa sản phẩm khỏi wishlist
  const handleWishlistToggle = async (e) => {
    e.stopPropagation(); // Ngăn sự kiện click vào cả card

    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thêm vào yêu thích!");
      return;
    }

    setIsFavorite(!isFavorite); // Cập nhật UI ngay lập tức để tránh độ trễ

    if (!isFavorite) {
      await addToWishlist(product._id);
    } else {
      await removeFromWishlist(product._id);
    }
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {product.discount !== undefined &&
        product.discount !== null &&
        product.discount > 0 && (
          <span className="discount-tag">-{product.discount}%</span>
        )}

      {/* Icon yêu thích */}
      <div
        className="favorite-icon"
        role="button"
        onClick={handleWishlistToggle}
      >
        {isFavorite ? (
          <FavoriteIcon style={{ color: "red" }} />
        ) : (
          <FavoriteBorderOutlinedIcon />
        )}
      </div>

      <img
        src={
          product.image.startsWith("http")
            ? product.image
            : `http://localhost:3000/images/${product.image}`
        }
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <h5 className="product-name">{product.name}</h5>
        <div className="rating">
          {product.averageRating ? (
            <>
              {"★".repeat(Math.round(product.averageRating))}
              {"☆".repeat(5 - Math.round(product.averageRating))}
            </>
          ) : (
            "☆☆☆☆☆"
          )}
          <span className="rating-count">({product.totalReviews || 0})</span>
        </div>

        {/* Hiển thị giá gốc và giá khuyến mãi */}
        <div className="price-container">
          {product.discount !== undefined &&
          product.discount !== null &&
          product.discount > 0 ? (
            <>
              {product.price > 0 && (
                <span className="original-price">
                  {product.price?.toLocaleString()}₫
                </span>
              )}
              <span className="discounted-price">
                {product.promotionPrice?.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className="discounted-price">
              {product.price?.toLocaleString()}₫
            </span>
          )}
        </div>

        <button className="add-to-bag" onClick={() => addToCart(product._id)}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
