import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountPage.css";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header"; 
import Footer from "../../Components/Footer/Footer";
import AddressSelector from "../../Components/Address/Address";
import { GET_USER_INFO, UPDATE_USER_INFO } from "../../config/ApiConfig";
import AccountSidebar from "../../Components/AccountSidebar/AccountSidebar";

const AccountPage = () => {
  const [user, setUser] = useState({
    userId: "",
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn chưa đăng nhập!");
          setLoading(false);
          return;
        }

        const response = await axios.get(GET_USER_INFO, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          setUser({
            userId: response.data.data._id,
            username: response.data.data.username,
            email: response.data.data.email,
            phoneNumber: response.data.data.phoneNumber,
            address: response.data.data.address || "",
          });

          localStorage.setItem("user", JSON.stringify(response.data.data));
        } else {
          setError("Không thể lấy thông tin người dùng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setError("Lỗi kết nối. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (selectedAddress) => {
    setUser({ ...user, address: selectedAddress });
  };

  const handleSave = async () => {
    if (!user.userId) {
      alert("Lỗi: Không tìm thấy ID người dùng!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập lại!");
        return;
      }

      const response = await axios.put(
        UPDATE_USER_INFO,
        {
          userId: user.userId,
          username: user.username,
          phoneNumber: user.phoneNumber,
          address: user.address,
          email: user.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Cập nhật địa chỉ thành công!");
        localStorage.setItem("user", JSON.stringify({ ...user, address: user.address }));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <>
      <Header />
      <div className="account-container">
        
          <AccountSidebar />
         

        <div className="content">
          <h2 className="content-title">Contact Information</h2>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="username" value={user.username} onChange={handleChange} className="input-field" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} className="input-field" />
                </div>
              </div>

              <div className="form-group">
                <label>Mail</label>
                <input type="email" name="email" value={user.email} disabled className="input-field" />
              </div>

              <div className="form-group">
              <AddressSelector onSelectAddress={handleAddressSelect} />
                <label>Address</label>
                <input type="text" name="address" value={user.address} onChange={handleChange} className="input-field" />
              </div>

              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountPage;
