import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderCancelled.css"
import AccountSidebar from "../../Components/AccountSidebar/AccountSidebar";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const OrderCancelled = () => {
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
          // Lọc chỉ lấy đơn hàng có status "Cancelled"
          const CancelledOrders = response.data.data.filter(order => order.status === "Cancelled");
          setOrders(CancelledOrders);
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
 

  return (
    <>
      <Header />
      <div className="account-container">
        <AccountSidebar />
        
        <div className="content">
          <h2 className="content-title">Đơn hàng Cancelled</h2>

          {loading ? (
            <p>Loading orders...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : orders.length === 0 ? (
            <p>Không có đơn hàng Cancelled nào.</p>
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

export default OrderCancelled;
