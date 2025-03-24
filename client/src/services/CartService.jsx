

import axios from "axios";
import Swal from "sweetalert2";

import { API_CART } from "../config/ApiConfig";

// ✅ Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = async (productId, quantity = 1) => {
    try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) {
            Swal.fire({
                            toast: true,
                            position: "top-end", // Hiển thị ở góc phải trên cùng
                            title: "Bạn cần đăng nhập để thêm vào giỏ hàng!",
                            showConfirmButton: false,
                            timer: 1000, // 
                            timerProgressBar: true,
                            background: "#f6e6ec", // Màu nền nhẹ nhàng
                            color: "#333", // Màu chữ tối
                            icon: undefined, // ✅ Xóa icon
                        });
            return;
        }

        const response = await axios.post(
            API_CART,
            { productId, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200 || response.status === 201) {
            Swal.fire({
                toast: true,
                position: "top-end", // Hiển thị ở góc phải trên cùng
                title: "Sản phẩm đã được thêm vào giỏ hàng!",
                showConfirmButton: false,
                timer: 1000, // 
                timerProgressBar: true,
                background: "#f6e6ec", // Màu nền nhẹ nhàng
                color: "#333", // Màu chữ tối
                icon: undefined, // ✅ Xóa icon
            });
        } else {
            Swal.fire({
                toast: true,
                position: "top-end", // Hiển thị ở góc phải trên cùng
                title: "Thêm vào giỏ hàng thất bại!",
                showConfirmButton: false,
                timer: 1000, // 
                timerProgressBar: true,
                background: "#f6e6ec", // Màu nền nhẹ nhàng
                color: "#333", // Màu chữ tối
                icon: undefined, // ✅ Xóa icon
            });
        }
    } catch (error) {
        alert("Có lỗi xảy ra! Vui lòng thử lại.");
        Swal.fire({
            toast: true,
            position: "top-end", // Hiển thị ở góc phải trên cùng
            title: "Có lỗi xảy ra! Vui lòng thử lại.",
            showConfirmButton: false,
            timer: 1000, // 
            timerProgressBar: true,
            background: "#f6e6ec", // Màu nền nhẹ nhàng
            color: "#333", // Màu chữ tối
            icon: undefined, // ✅ Xóa icon
        });
    }
};
