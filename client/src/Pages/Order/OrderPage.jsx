


import React, { useState, useEffect } from "react";
import "./OrderPage.css"; // Import CSS
import Modal from "./ModalOrder";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ORDER_API, MOMO_PAYMENT_API, CHECK_COUPON_API, COUPONS_API, UPDATE_PAYMENT_STATUS,GET_CART} from "../../config/ApiConfig";
import Logo from "../../assets/images/logo.png"; // Import logo


const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [products, setProducts] = useState({});
  const [vouchers, setVouchers] = useState([]);
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [showVoucherList, setShowVoucherList] = useState(false);

  const [orderData, setOrderData] = useState({
    cartId: "",
    totalPrice: 0,
    productList: [],
    shippingAddress: "",
    name: "",
    phone: "",
    email: "",
    voucherCode: "",
  });
  const formattedOrderData = {
    cartId: orderData.cartId,
    totalPrice: orderData.totalPrice,
    shippingAddress: orderData.shippingAddress,
    name: orderData.name,
    phone: orderData.phone,
    email: orderData.email,
    voucherCode: orderData.voucherCode,
    productList: location.state.productList.map((product) => product.id), // ✅ Chỉ lấy id
  };
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(GET_CART, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data && response.data.products) {
          const productMap = {};
          response.data.products.forEach((product) => {
            productMap[product.productId._id] = product.productId.name;
          });
          setProducts(productMap);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchProductDetails();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(COUPONS_API);
      if (response.data.status === "OK") {
        setVouchers(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách voucher:", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const checkVoucher = async () => {
    if (!orderData.voucherCode.trim()) {
        alert("Vui lòng nhập mã giảm giá!");
        return;
    }

    try {
        console.log("📢 Đang kiểm tra mã giảm giá:", orderData.voucherCode);

        const response = await axios.post(
            CHECK_COUPON_API,
            {
                name: orderData.voucherCode,
                orderTotal: orderTotal,
            }
        );

        console.log("📢 Phản hồi API kiểm tra mã giảm giá:", response.data);

        if (response.data && response.data.discount) {
            const currentDate = new Date();
            const expiryDate = new Date(response.data.expiry);

            // Kiểm tra nếu mã đã hết hạn
            if (expiryDate < currentDate) {
                alert("❌ Mã giảm giá đã hết hạn!");
                setVoucherInfo(null);
                return;
            }

            // Tính phí vận chuyển
            const shippingFee = orderData.totalPrice >= 500000 ? 0 : 30000;

            // Tính VAT 10%
            const vat = Math.round(orderData.totalPrice * 0.1);

            // Tính giảm giá trên tổng tiền (bao gồm VAT và phí vận chuyển)
            const discountAmount = Math.round(
                (orderData.totalPrice + shippingFee + vat) * (response.data.discount / 100)
            );

            // Tính tổng tiền cuối cùng
            const newTotal = Math.max(orderData.totalPrice + shippingFee + vat - discountAmount, 0);

            setVoucherInfo({
                ...response.data,
                discountAmount,
                newTotal,
            });

            alert(`✅ Mã hợp lệ! ${response.data.message}`);
        } else {
            setVoucherInfo(null);
            alert("❌ Mã giảm giá không hợp lệ hoặc đã hết hạn!");
        }
    } catch (error) {
        console.error(
            "❌ Lỗi khi kiểm tra mã giảm giá:",
            error.response?.data || error.message
        );
        alert("❌ Không thể kiểm tra mã giảm giá. Vui lòng thử lại!");
    }
};

const shippingFee = orderData.totalPrice >= 500000 ? 0 : 30000;
const vat = Math.round(orderData.totalPrice * 0.1);
const orderTotal = orderData.totalPrice + shippingFee + vat;


  useEffect(() => {
    console.log("📦 Dữ liệu nhận từ CartPage:", location.state);

    if (!location.state) {
      alert("Dữ liệu đặt hàng không hợp lệ! Quay lại giỏ hàng.");
      navigate("/cart");
      return;
    }

    setOrderData({
      cartId: location.state.cartId || "", // ✅ Nhận cartId từ CartPage
      productList: location.state.productList || "",
      totalPrice: location.state.totalPrice || 0,
      shippingAddress: location.state.shippingAddress || "",
      name: location.state.name || "",
      phone: location.state.phone || "",
      email: location.state.email || "",
      voucherCode: location.state.voucherCode || "",
    });
  }, [location.state, navigate]);
  

  const handlePayment = async (orderId) => {
    if (!orderId) {
      console.error("❌ Lỗi: orderId bị undefined, không thể tiếp tục thanh toán!");
      alert("Lỗi khi thanh toán: Không tìm thấy mã đơn hàng!");
      return;
    }
    try {
      const paymentData = {
        orderId: orderId, // Sử dụng orderId từ phản hồi của API tạo đơn hàng
        amount: voucherInfo ? voucherInfo.newTotal : orderTotal,
        orderInfo: `Thanh toán đơn hàng #${orderId}`,
        redirectUrl: "https://momo.vn",
        ipnUrl: "https://webhook.site/test",
        paymentMethod: "MoMo",
      };
      const token = localStorage.getItem("token"); 
  
      console.log('Payment Data:', paymentData); 
      console.log('Token:', token); 
  
      const response = await fetch(MOMO_PAYMENT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(paymentData)
      });
  
      const data = await response.json();
      console.log('MoMo Response:', data); 
  
      if (data && data.payUrl) {
        console.log('Redirecting to:', data.payUrl); 
        window.location.href = data.payUrl;
      } else {
        console.error('Error: No payUrl in response'); 
        alert("Lỗi khi tạo yêu cầu thanh toán MoMo.");
      }
      const paymentStatusData = {
        orderId: data.orderId || orderId,
        requestId: data.requestId || orderId,
        amount: paymentData.amount,
        message: data.message || "Thành công",
        resultCode: data.resultCode || 0,
        transId: data.transId || "123456789"
      };
  
      updatePaymentStatus(paymentStatusData);
      
    } catch (error) {
      console.error("Lỗi khi thanh toán MoMo:", error); 
      alert("Lỗi khi thanh toán MoMo. Vui lòng thử lại.");
    }
  };
  const updatePaymentStatus = async (paymentStatusData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Lỗi: Không tìm thấy token, không thể cập nhật trạng thái thanh toán!");
        return;
      }
  
      const response = await axios.post(UPDATE_PAYMENT_STATUS, paymentStatusData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
  
      console.log("✅ Phản hồi từ API cập nhật trạng thái thanh toán:", response.data);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái thanh toán:", error.response?.data || error.message);
    }
  };
  
  const handlePlaceOrder = async () => {
    if (!orderData.cartId || !orderData.productList.length) {
      alert("Giỏ hàng của bạn trống hoặc có lỗi với đơn hàng!");
      return;
    }
  
    if (
      !orderData.name ||
      !orderData.phone ||
      !orderData.email ||
      !orderData.shippingAddress
    ) {
      alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
      return;
    }
  
    console.log("📦 Dữ liệu gửi lên API:", JSON.stringify(orderData, null, 2));
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
  
      const response = await axios.post(ORDER_API, formattedOrderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ Phản hồi từ API:", response);
  
      // Log chi tiết phản hồi từ API
      console.log("Response Data:", response.data);
  
      if (response.data.status === "OK" && response.data.data && response.data.data.data) {
        const orderId = response.data.data.data._id; // Lấy _id từ phản hồi API
        console.log("✅ Order ID:", orderId);
        handlePayment(orderId);
      } else {
        console.error("Error: Invalid response data", response.data);
        alert("Đặt hàng thất bại. Vui lòng thử lại.");
      }
      
    } catch (error) {
      console.error(
        "❌ Lỗi khi đặt hàng:",
        error.response?.data || error.message
      );
      alert(`Lỗi đặt hàng: ${error.response?.data?.message || "Không thể đặt hàng"}`);
    }
  };
  return (
    <div className="order-container">
      <div className="order-header">
        <div className="order-header-content">
          <img src={Logo} alt="Logo" className="order-header-logo" />
          <span className="order-header-title">Thanh toán</span>
        </div>
      </div>

      <div className="order-main-content">
        {/* Thông tin nhận hàng */}
        <div className="order-box order-address-box">
          <h2 className="order-title">Thông tin nhận hàng</h2>

          {/* Hàng ngang chứa Tên & Số điện thoại */}
          <div className="order-input-row">
            <div className="order-input-group">
              <h2 className="order-title">Tên</h2>
              <input
                type="text"
                value={orderData.name}
                onChange={(e) =>
                  setOrderData({ ...orderData, name: e.target.value })
                }
                placeholder="Nhập tên người nhận"
                required
              />
            </div>
            <div className="order-input-group">
              <h2 className="order-title">Số điện thoại</h2>
              <input
                type="text"
                value={orderData.phone}
                onChange={(e) =>
                  setOrderData({ ...orderData, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          {/* Hàng dọc chứa Email & Địa chỉ */}
          <div className="order-input-group">
            <h2 className="order-title">Email</h2>
            <input
              type="email"
              value={orderData.email}
              onChange={(e) =>
                setOrderData({ ...orderData, email: e.target.value })
              }
              placeholder="Nhập email"
              required
            />
          </div>

          <div className="order-input-group">
            <h2 className="order-title">Địa chỉ</h2>
            <input
              type="text"
              value={orderData.shippingAddress}
              onChange={(e) =>
                setOrderData({ ...orderData, shippingAddress: e.target.value })
              }
              placeholder="Nhập địa chỉ giao hàng"
              required
            />
          </div>
        </div>

       {/* Mã giảm giá */}
<div className="order-box">
    <h2 className="order-title">Mã giảm giá</h2>

    {/* Ô nhập mã + nút áp dụng */}
    <div className="voucher-input-container">
        <input
            type="text"
            placeholder="Nhập mã giảm giá"
            value={orderData.voucherCode}
            onChange={(e) => setOrderData({ ...orderData, voucherCode: e.target.value })}
            onFocus={() => setShowVoucherList(true)} // Khi nhấp vào input, hiển thị danh sách voucher
            className="order-input-field"
        />
        <button className="apply-voucher-btn" onClick={checkVoucher}>
            Áp dụng
        </button>
    </div>

    {/* Hiển thị danh sách voucher khi showVoucherList = true */}
    {showVoucherList && (
        <div className="voucher-list">
            {vouchers.length > 0 ? (
                <ul className="voucher-list-items">
                    {vouchers.map((voucher) => (
                        <li key={voucher._id} className="voucher-item">
                            <div className="voucher-info">
                                <span className="voucher-name">{voucher.name}</span>
                                <span className="voucher-description">{voucher.description}</span>
                                <span className="voucher-discount">🔖 Giảm {voucher.discount}%</span>
                            </div>
                            <button
                                className="use-voucher-btn"
                                onClick={() => {
                                    setOrderData({ ...orderData, voucherCode: voucher.name });
                                    setShowVoucherList(false); // Ẩn danh sách khi chọn mã
                                }}
                            >
                                Dùng mã
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-voucher">Không có mã giảm giá nào khả dụng.</p>
            )}
        </div>
    )}
</div>


        {/* Thông tin kiện hàng */}
        <div className="order-box order-shipping-info">
  <h2 className="order-title">Chi tiết đơn hàng</h2>

  <table className="order-product-table">
    <thead>
      <tr>
        <th>Sản phẩm</th>
        <th>Số lượng</th>
        <th>Giá </th>
      </tr>
    </thead>
    <tbody>
      {(orderData.productList || []).map((item, index) => (
        <tr key={index}>
          <td className="order-product-info">
            <img src={item.image} alt={item.name} className="order-product-img" />
            <span>{item.name}</span>
          </td>
          <td>{item.quantity}</td>
          <td>{item.price?.toLocaleString()}₫</td>
          

          
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>

      {/* Thanh toán ở góc phải */}
      <div className="order-payment-box">
        <div className="order-invoice-info"></div>
        <h2 className="order-title">Đơn hàng</h2>
        <div className="order-summary">
          <p>
            Tạm tính: <span>{orderData?.totalPrice?.toLocaleString("vi-VN")}₫</span>
          </p>

          {/* Hiển thị giảm giá nếu có */}
          <p>
            Giảm giá:
            <span>
              {voucherInfo
                ? `-${voucherInfo.discountAmount?.toLocaleString("vi-VN")}₫`
                : "-0₫"}
            </span>
          </p>

          <p>
            Phí vận chuyển:
            <span>
              {" "}
              {shippingFee > 0
                ? `${shippingFee?.toLocaleString("vi-VN")}₫`
                : "Miễn phí"}
            </span>
          </p>
          <p>
            VAT (10%): <span>{vat?.toLocaleString()}₫</span>
          </p>

          {/* Cập nhật lại tổng tiền sau giảm giá */}
          <p className="order-total">
            Thành tiền (Đã VAT):
            <span className="order-price">
              {voucherInfo
                ? voucherInfo.newTotal?.toLocaleString()
                : orderTotal?.toLocaleString()}
              ₫
            </span>
          </p>

          <button className="order-btn" onClick={handlePlaceOrder}>
            Đặt hàng
          </button>
        </div>
      </div>

      {/* Modal Địa chỉ */}
      {showAddressModal && (
        <Modal
          onClose={() => setShowAddressModal(false)}
          title="Chọn địa chỉ nhận hàng"
        >
          <p>Chức năng chọn địa chỉ sẽ được thêm sau.</p>
        </Modal>
      )}

      {/* Modal Thanh toán */}
      {showPaymentModal && (
        <Modal
          onClose={() => setShowPaymentModal(false)}
          title="Chọn hình thức thanh toán"
        >
          <p>Chức năng chọn thanh toán sẽ được thêm sau.</p>
        </Modal>
      )}
    </div>
  );
};

export default OrderPage;
