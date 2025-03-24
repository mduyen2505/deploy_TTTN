import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./WishlistPage.css";
import { getWishlist, removeFromWishlist } from "../../services/WishlistService";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { addToCart } from "../../services/CartService";



const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
        const data = await getWishlist();
        setWishlist(data); // Gán trực tiếp danh sách wishlist nhận được từ API
    };
    loadWishlist();
}, []);

const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await removeFromWishlist(productId);
      if (response) {
        // Cập nhật danh sách wishlist sau khi xóa sản phẩm thành công
        setWishlist(wishlist.filter(product => product._id !== productId));
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi danh sách yêu thích:", error);
    }
  };
  



  return (
    <>
    <Header/>
   

    <div className="product-container">
      {wishlist.map((product) => (
        <div key={product._id} className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
        {product.discount && <span className="discount-tag">-{product.discount}%</span>}

          <div className="favorite-icon" role="button" onClick={(e) => { 
  e.stopPropagation(); 
  handleRemoveFromWishlist(product._id); 
}}>
  <FavoriteIcon style={{ color: "red" }} />
</div>

          <img src={`http://localhost:3000/images/${product.image}`} alt={product.name} className="product-image" />
          <div className="product-info">
            <h5 className="product-name">{product.name}</h5>
            <div className="rating">
              {Array.from({ length: 5 }, (_, index) => (
                <FontAwesomeIcon key={index} icon={index < product.averageRating ? solidStar : regularStar} className="star-icon" />
              ))}
              <span className="rating-count">({product.reviewCount})</span>
            </div>
            <div className="price-container">
              {product.discount > 0 ? (
                <>
                  <span className="original-price">{product.price?.toLocaleString()}₫</span>
                  <span className="discounted-price">{product.promotionPrice?.toLocaleString()}₫</span>
                </>
              ) : (
                <span className="discounted-price">{product.price?.toLocaleString()}₫</span>
              )}
            </div>
            <button className="add-to-bag" onClick={() => addToCart(product._id)}>Thêm vào giỏ</button>
          </div>
        </div>
      ))}
    </div>
    <Footer/>
    </>
  );
};

export default WishlistPage;
