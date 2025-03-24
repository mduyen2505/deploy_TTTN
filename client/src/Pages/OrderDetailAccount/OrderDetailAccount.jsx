import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./OrderDetaiAccount.css"
import AccountSidebar from "../../Components/AccountSidebar/AccountSidebar";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { getOrderDetails } from "../../config/ApiConfig"; // Import API

const OrderDetail = () => {
    const { orderId } = useParams();
    console.log("Order ID nhận được:", orderId); // 🔍 Debug kiểm tra orderId
  
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
              const token = localStorage.getItem("token"); // Lấy token từ localStorage
              if (!token) {
                setError("Bạn chưa đăng nhập!");
                setLoading(false);
                return;
              }
          
              console.log("🔍 Order ID:", orderId);
              console.log("🛠 Gọi API:", getOrderDetails(orderId));
          
              const response = await axios.get(getOrderDetails(orderId), {
                headers: { Authorization: `Bearer ${token}` }, // ✅ Thêm token vào headers
              });
          
              console.log("✅ API response:", response.data);
          
              if (response.data.status === "OK") {
                setOrder(response.data.data);
              } else {
                setError("Không thể tải chi tiết đơn hàng.");
              }
            } catch (error) {
              console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", error);
              setError("Lỗi kết nối đến server.");
            } finally {
              setLoading(false);
            }
          };
  
      if (orderId) {
        fetchOrderDetail();
      } else {
        setError("Order ID không hợp lệ.");
      }
    }, [orderId]);
  
    if (loading) return <p>Đang tải...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!order) return <p>Đơn hàng không tồn tại.</p>;
  return (
    <>
      <Header />
      <div className="account-container">
        <AccountSidebar />

        <div className="content">
          <h2 className="content-title">Chi Tiết Đơn Hàng</h2>

        {/* Khung chứa 2 cột */}
<div className="order-detail-wrapper">
  
  {/* Cột thông tin khách hàng */}
  <div className="order-detail-info">
    <p><strong>Tên khách hàng:</strong> {order.name}</p>
    <p><strong>Email:</strong> {order.email}</p>
    <p><strong>Số điện thoại:</strong> {order.phone}</p>
    <p><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</p>
  </div>

  {/* Đường line dọc ngăn giữa */}
  <div className="order-detail-divider"></div>

  {/* Cột thông tin đơn hàng */}
  <div className="order-detail-summary">
    <p><strong>Kết quả thanh toán:</strong> {order.paymentResult}</p>
    <p><strong>Tổng giá sản phẩm:</strong> {order.totalPrice.toLocaleString()} đ</p>
    <p><strong>Phí vận chuyển:</strong> {order.shippingFee.toLocaleString()} đ</p>
    <p><strong>VAT: </strong>{order.VAT.toLocaleString()} đ</p>
  </div>

</div>
          {/* Danh sách sản phẩm trong đơn hàng */}
          <h3 className="order-products-title">Danh sách sản phẩm</h3>
          <div className="order-status-wrapper">
  <p>
    <strong>Trạng thái:</strong> 
    <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
  </p>
</div>

          {order.products.map((item, idx) => {
            const productImage = item.productId?.image
              ? (item.productId.image.startsWith("http") 
                ? item.productId.image 
                : `http://localhost:3000/images/${item.productId.image}`)
              : `http://localhost:3000/images/default-product.png`;

            return (
              <div key={idx} className="orderaccount-item">
                <img
                  src={productImage}
                  alt={item.productId?.name || "Sản phẩm"}
                  className="orderaccount-item-image"
                />
                <div className="orderaccount-item-details">
                  <h4 className="orderaccount-item-name">{item.productId?.name || "Sản phẩm không xác định"}</h4>
                  <p className="orderaccount-item-quantity">Số lượng: {item.quantity}</p>
                  <p className="orderaccount-item-price">
                    Giá: {item.productId?.promotionPrice?.toLocaleString() || "0"} đ
                  </p>
                </div>
              </div>
            );
          })}

          {/* Tổng tiền */}
          <div className="orderaccount-summary">
            
            <p className="order-total">
              Tổng thanh toán: <strong>{order.orderTotal.toLocaleString()} đ</strong>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetail;
