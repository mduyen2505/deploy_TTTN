import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Ordershipped.css"
import AccountSidebar from "../../Components/AccountSidebar/AccountSidebar";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const Ordershipped = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn chưa đăng nhập!");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === "OK") {
          // Lọc chỉ lấy đơn hàng có status "Shipped"
          const ShippedOrders = response.data.data.filter(order => order.status === "Shipped");
          setOrders(ShippedOrders);
        } else {
          setError("Không thể tải danh sách đơn hàng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        setError("Lỗi kết nối đến server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirmOrder = async (orderId) => {
    const confirmDelivery = window.confirm("Bạn có chắc chắn muốn xác nhận đã giao đơn hàng này không?");
    if (!confirmDelivery) return;
  
    try {
      const token = localStorage.getItem("token");
  
      console.log("🔍 Gửi yêu cầu xác nhận đơn hàng với orderId:", orderId); // Log kiểm tra
  
      const response = await axios.post(
        "http://localhost:3000/api/orders/deliver", 
        { orderId: orderId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Phản hồi từ API xác nhận đơn hàng:", response.data);
  
      if (response.data.status === "OK") {
        // Cập nhật danh sách đơn hàng, loại bỏ đơn hàng đã giao
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        alert("Xác nhận đơn hàng thành công!");
      } else {
        console.error("Error: Invalid response data", response.data); // Log lỗi chi tiết
        alert("Lỗi: " + response.data.message);
      }
    } catch (error) {
      console.error("❌ Lỗi khi xác nhận đơn hàng:", error);
      alert("Không thể xác nhận đơn hàng. Vui lòng thử lại!");
    }
  };

  return (
    <>
      <Header />
      <div className="account-container">
        <AccountSidebar />
        
        <div className="content">
          <h2 className="content-title">Đơn hàng Shipped</h2>

          {loading ? (
            <p>Loading orders...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : orders.length === 0 ? (
            <p>Không có đơn hàng Shipped nào.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="orderaccount-card">
               <button
  className="orderaccount-detail-button"
  onClick={() => navigate(`/orders/${order._id}`)} // Điều hướng đúng
>
  Xem chi tiết
</button>

<div className="orderaccount-header">
                  <span className="orderaccount-id">
                    Mã đơn hàng: <strong>{order._id}</strong>
                  </span>
                  <span className="orderaccount-delivery">
                    Ngày đặt hàng: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                  <span className={`orderaccount-status ${order.status.toLowerCase().replace(/ /g, '-')}`}>
                    {order.status}
                  </span>
                </div>

                {/* Danh sách sản phẩm trong đơn hàng */}
                {order.products.map((item, idx) => (
                  <div key={idx} className="orderaccount-item">
                    <img
                      src={
                        item.productId.image.startsWith("http")
                          ? item.productId.image
                          : `http://localhost:3000/images/${item.productId.image}`
                      }
                      alt={item.productId.name}
                      className="orderaccount-item-image"
                    />
                    <div className="orderaccount-item-details">
                      <h4 className="orderaccount-item-name">{item.productId.name}</h4>
                      <p className="orderaccount-item-quantity">Số lượng: {item.quantity}</p>
                      <p className="orderaccount-item-price">
                        Giá: {item.productId.promotionPrice.toLocaleString()} đ
                      </p>
                    </div>
                  </div>
                ))}

                {/* Tổng tiền */}
                <div className="orderaccount-summary">
                  <span className="orderaccount-total">
                    Tổng tiền ({order.products.length} sản phẩm): <strong>{order.orderTotal.toLocaleString()} đ</strong>
                  </span>
                  <button
                    className="orderaccount-confirm-button"
                    onClick={() => handleConfirmOrder(order._id)}
                  >
                    Đã nhận được hàng     </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Ordershipped;
