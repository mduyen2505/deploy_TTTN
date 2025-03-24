

import axios from "axios";

import { WISHLIST } from "../config/ApiConfig";
// Hàm lấy danh sách wishlist từ server
export const getWishlist = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return [];

        const response = await axios.get(WISHLIST, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.wishlist || [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error.response?.data || error.message);
        return [];
    }
};


// Thêm sản phẩm vào wishlist
export const addToWishlist = async (productId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Người dùng chưa đăng nhập");

        const response = await axios.post(`${WISHLIST}/add`, { productId }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào danh sách yêu thích:", error.response?.data || error.message);
        return null;
    }
};




// Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = async (productId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Người dùng chưa đăng nhập");

        const response = await axios.delete(`${WISHLIST}/remove`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { productId },
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi danh sách yêu thích:", error.response?.data || error.message);
        return null;
    }
};


 