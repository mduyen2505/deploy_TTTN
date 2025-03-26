import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./OrderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [timePeriod, setTimePeriod] = useState("week");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Tính toán danh sách đơn hàng hiện tại dựa vào phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Chuyển trang
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "deploytttn-production.up.railway.app/orders/getAll"
      );
      const data = await response.json();
      if (data.status === "OK") {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filterOrders = async () => {
    if (!statusFilter || !selectedDate) return;
    try {
      const response = await fetch(
        "deploytttn-production.up.railway.app/orders/orders-by-time",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: statusFilter,
            date: selectedDate,
            timePeriod: timePeriod,
          }),
        }
      );
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error filtering orders:", error);
    }
  };

  const updateOrderStatus = async (url, orderId) => {
    try {
      await fetch(url, {
        method: url.includes("shippOrder") ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div className="order-list-container">
      <h2>Danh sách đơn hàng</h2>
      <div className="filter-section">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Order</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        >
          <option value="day">Ngày</option>
          <option value="week">Tuần</option>
          <option value="month">Tháng</option>
        </select>
        <button onClick={filterOrders}>Lọc</button>
      </div>
      <div className="orders">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <h3>Đơn hàng #{order._id}</h3>
            <p>
              <strong>Người đặt:</strong> {order.name}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Trạng thái:</strong> {order.status}
            </p>
            <p>
              <strong>Trạng thái thanh toán:</strong> {order.paymentResult}
            </p>

            <p>
              <strong>Tổng tiền:</strong> {order.orderTotal} VND
            </p>
            {order.status === "Pending" && (
              <button
                onClick={() =>
                  updateOrderStatus(
                    "deploytttn-production.up.railway.app/orders/confirm",
                    order._id
                  )
                }
              >
                Xác nhận
              </button>
            )}
            {order.status === "Confirmed" && (
              <button
                onClick={() =>
                  updateOrderStatus(
                    "deploytttn-production.up.railway.app/orders/shippOrder",
                    order._id
                  )
                }
              >
                Xác nhận giao hàng
              </button>
            )}
            {order.status === "Shipped" && (
              <button
                onClick={() =>
                  updateOrderStatus(
                    "deploytttn-production.up.railway.app/orders/auto-confirm-delivery",
                    order._id
                  )
                }
              >
                Xác nhận giao thành công
              </button>
            )}
            <button onClick={() => openModal(order)}>Xem chi tiết</button>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Order Details"
        >
          <h2>Chi Tiết Đơn Hàng #{selectedOrder._id}</h2>
          <div className="order-modal-content">
            <div className="order-modal-left">
              <p>
                <strong>Người đặt:</strong> {selectedOrder.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Địa chỉ giao hàng:</strong>{" "}
                {selectedOrder.shippingAddress}
              </p>
            </div>
            <hr />
            <div className="order-modal-right">
              <p>
                <strong>Trạng thái:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Phí vận chuyển:</strong> {selectedOrder.shippingFee} VND
              </p>
              <p>
                <strong>VAT:</strong> {selectedOrder.VAT} VND
              </p>
              <p>
                <strong>Tổng tiền:</strong> {selectedOrder.orderTotal} VND
              </p>
              <p>
                <strong>Kết quả thanh toán:</strong>{" "}
                {selectedOrder.paymentResult}
              </p>
            </div>
          </div>
          <h3>Danh sách sản phẩm</h3>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá (VND)</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.products.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.productId.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.productId.promotionPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={closeModal}>Đóng</button>
        </Modal>
      )}
    </div>
  );
};
export default OrderList;
