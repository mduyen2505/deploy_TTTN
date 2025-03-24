import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import "./register.css";
import logo from "../../assets/images/logo.png";
import { REGISTER_USER } from "../../config/ApiConfig";
import Swal from "sweetalert2";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Xử lý khi nhập dữ liệu vào input
  const handleChange = (e) => {
    setFormData((prev) => {
      const newData = { ...prev, [e.target.name]: e.target.value };
      console.log("Updating state:", newData); // Kiểm tra giá trị cập nhật
      return newData;
    });
  };

  // Xử lý đăng ký người dùng
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("Form Data:", formData); // Debug kiểm tra giá trị nhập vào

    if (!formData.password || !formData.confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu!");
      return;
    }

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      Swal.fire({
        toast: true,
        position: "top-end", // Hiển thị ở góc phải trên cùng
        title: "Nhập lại mật khẩu không khớp!",
        showConfirmButton: false,
        timer: 1000, // 
        timerProgressBar: true,
        background: "#f6e6ec", // Màu nền nhẹ nhàng
        color: "#333", // Màu chữ tối
        icon: "error", // Hiển thị icon lỗi
      });
      return;
    }

    try {
      const response = await axios.post(REGISTER_USER, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        resPassword: formData.confirmPassword,
      });

      if (response.data.message.includes("OTP sent")) {
        Swal.fire({
          title: "OTP đã gửi!",
          text: "Vui lòng kiểm tra email",
          icon: "success",
          timer: 1500,
        });

        localStorage.setItem("emailForOtp", formData.email);

        // Chuyển hướng đến trang nhập OTP
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        Swal.fire({
          toast: true,
          position: "top-end", 
          title: "Đăng ký không thành công!",
          showConfirmButton: false,
          timer: 1000, // 
          timerProgressBar: true,
          background: "#f6e6ec", 
          color: "#333", 
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error); // Ghi log chi tiết lỗi
      Swal.fire({
        toast: true,
        position: "top-end", // Hiển thị ở góc phải trên cùng
        title: "Đăng ký thất bại. Vui lòng thử lại!",
        showConfirmButton: false,
        timer: 1000, // 
        timerProgressBar: true,
        background: "#f6e6ec", // Màu nền nhẹ nhàng
        color: "#333", // Màu chữ tối
        icon: "error", // Hiển thị icon lỗi
      });
    }
  };

  return (
    <div className="register-page">
      <div className="register-auth-container">
        <div className="register-welcome-container">
          <img src={logo} alt="Logo" className="register-logo" />
          <h2 className="register-welcome-text">Welcome Back!</h2>
          <p className="register-account-question">Already have an account?</p>
          <Link to="/login" className="register-btn register-login-btn">Login</Link>
        </div>
        
        <div className="register-forms-container">
          <form className="register-sign-up-form" onSubmit={handleSubmit}>
            <h2 className="register-title">Đăng Ký</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="register-input-field">
              <i className="fas fa-user"></i>
              <input type="text" name="username" placeholder="Tên người dùng" onChange={handleChange} required />
            </div>
            <div className="register-input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </div>
            
            <div className="register-input-field">
              <i className="fas fa-lock"></i>
              <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
            </div>
            <div className="register-input-field">
              <i className="fas fa-lock"></i>
              <input type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" onChange={handleChange} required />
            </div>
            <input type="submit" className="register-btn" value="Gửi OTP" />
            
            <p className="register-social-text">Hoặc đăng ký bằng</p>
            <div className="register-social-media">
              <a href="#" className="register-social-icon">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="register-social-icon">
                <FontAwesomeIcon icon={faGoogle} />
              </a>
              <a href="#" className="register-social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="register-social-icon">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;