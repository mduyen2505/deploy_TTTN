import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

import Header from "../../Components/Header/Header";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Footer from "../../Components/Footer/Footer";
import {
  GET_CART,
  DELETE_CART_ITEM,
  CLEAR_CART,
  UPDATE_CART,
} from "../../config/ApiConfig";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Không có token, chuyển hướng về trang đăng nhập...");
          navigate("/login");
          return;
        }

        const response = await axios.get(GET_CART, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Dữ liệu giỏ hàng từ API:", response.data);

        if (response.data && response.data.products) {
          localStorage.setItem(
            "cart",
            JSON.stringify({ _id: response.data._id })
          );
          const formattedCartItems = response.data.products.map((product) => ({
            id: product.productId._id,
            name: product.productId.name,
            price: product.productId.promotionPrice,
            oldPrice: product.productId.discount
              ? product.productId.promotionPrice /
                (1 - product.productId.discount / 100)
              : null,
            quantity: product.quantity,
            image: product.productId.image.startsWith("http")
              ? product.productId.image
              : `http://localhost:3000/images/${product.productId.image}`,
          }));

          setCartItems(formattedCartItems);
        } else {
          console.warn("API trả về giỏ hàng trống!");
          setCartItems([]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API giỏ hàng:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // Hàm gọi API cập nhật số lượng sản phẩm (Tăng/Giảm)
  const updateCartQuantity = async (productId, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Không có token, không thể cập nhật số lượng.");
        return;
      }

      const response = await axios.post(
        UPDATE_CART,
        { productId, action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity:
                    action === "increase"
                      ? item.quantity + 1
                      : item.quantity - 1,
                }
              : item
          )
        );
        console.log(`Sản phẩm ${action} thành công.`);
      } else {
        console.warn("API trả về lỗi:", response);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Không có token, không thể xóa sản phẩm.");
        return;
      }

      await axios.delete(DELETE_CART_ITEM(id), {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(cartItems.filter((item) => item.id !== id));
      console.log("Sản phẩm đã bị xóa khỏi giỏ hàng.");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Không có token, không thể xóa giỏ hàng.");
        return;
      }

      await axios.delete(CLEAR_CART, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems([]); // Làm rỗng giỏ hàng
      console.log("Giỏ hàng đã được xóa.");
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ✅ Hàm xử lý đặt hàng
  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem("cart")); // Lưu giỏ hàng vào localStorage khi fetch
    const cartId = storedCart?._id || null; // Lấy cartId từ giỏ hàng

    if (!cartId) {
      alert("Không tìm thấy giỏ hàng. Vui lòng thử lại.");
      return;
    }
    const productList = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image || "",   
      price: item.price || 0,    // Nếu không có price, đặt giá mặc định 0
      quantity: item.quantity || 1, // Nếu không có quantity, đặt mặc định là 1
    })); // ✅ Sử dụng `productList`

    // ✅ Chuyển dữ liệu sang `OrderPage`
    navigate("/order", {
      state: {
        cartId,
        productList,
        totalPrice,
        shippingAddress: user.address || "",
        name: user.username || "",
        phone: user.phoneNumber || "",
        email: user.email || "",
        voucherCode: "",
      },
    });
  };

  if (loading) {
    return <div className="cart-loading">Đang tải giỏ hàng...</div>;
  }

  return (
    <>
      <Header />

      <div className="cart-page-container">
        <h2 className="cart-page-title">
          Giỏ hàng ({cartItems.length} sản phẩm)
        </h2>
        <div className="cart-page-content">
          <div className="cart-page-items">
            <table>
              <thead>
                <tr>
                  <th>
                    <button
                      className="clear-cart-button"
                      onClick={handleClearCart}
                    >
                      <DeleteForeverIcon /> Clear
                    </button>
                  </th>
                  <th>Sản phẩm</th>
                  <th>Giá tiền</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td></td>
                    <td className="cart-page-product-info">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-product-image"
                      />

                      <div>
                        <strong>{item.name}</strong>
                        <div className="cart-page-actions"></div>
                        <span className="cart-page-wishlist">
                          ♡ Yêu thích
                        </span>{" "}
                        |{" "}
                        <span>
                          <DeleteForeverIcon
                            className="cart-page-delete-icon"
                            onClick={() => handleDeleteItem(item.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="cart-page-new-price">
                        {item?.price?.toLocaleString()} đ
                      </span>
                      <br />
                      {item?.oldPrice && (
                        <span className="cart-page-old-price">
                          {item?.oldPrice?.toLocaleString()} đ
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="cart-quantity-selector">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateCartQuantity(item?.id, "decrease")
                          }
                          disabled={item?.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="qty-value">{item?.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateCartQuantity(item?.id, "increase")
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{(item?.price * item?.quantity)?.toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="continue-shopping" onClick={() => navigate(-1)}>
              ⬅ Tiếp tục mua sắm
            </div>
          </div>

          <div className="cart-page-summary">
            <h3>Hóa đơn của bạn</h3>
            <p>
              Tạm tính: <span>{totalPrice?.toLocaleString()} đ</span>
            </p>
            <p className="cart-page-total">
              Tổng cộng: <span>{totalPrice?.toLocaleString()} đ</span>
            </p>
            <button
              className="cart-page-checkout-button"
              onClick={handleCheckout}
            >
              Tiến hành đặt hàng
            </button>{" "}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CartPage;
