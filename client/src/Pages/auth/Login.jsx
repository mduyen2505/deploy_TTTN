import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import logo from "../../assets/images/logo.png";
import "./Login.css";
import { LOGIN_USER, FORGOT_PASSWORD, RESET_PASSWORD } from "../../config/ApiConfig";
import Swal from "sweetalert2";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "", 
    newPassword: "" 
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const refreshToken = urlParams.get('refreshToken');
    const username = urlParams.get("username");
    const email = urlParams.get("email");

    if (token && refreshToken && username && email) {
        const user = {
            username,
            email,
            token,
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        window.history.replaceState({}, document.title, "/");

        Swal.fire({
            toast: true,
            position: "top-end",
            title: "Đăng nhập thành công!",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            background: "#f6e6ec",
            color: "#333",
        });

        window.dispatchEvent(new Event("storage"));

        setTimeout(() => navigate("/"), 1000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Vui lòng nhập email",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        background: "#f6e6ec",
        color: "#333",
      });
      return;
    }
    
    try {
      const response = await axios.post(FORGOT_PASSWORD, { email: formData.email });
      Swal.fire({
        toast: true, 
        position: "top-end",
        title: response.data.message,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        background: "#f6e6ec",
        color: "#333",
      });
      setShowForgotPasswordModal(false);
      setShowResetPasswordForm(true);
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        title: error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        background: "#f6e6ec",
        color: "#333",
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(RESET_PASSWORD, {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      if (response.data) {
        Swal.fire({
          toast: true,
          position: "top-end",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          background: "#f6e6ec",
          color: "#333",
        });

        setShowResetPasswordForm(false);
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        title: error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        background: "#f6e6ec",
        color: "#333",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(LOGIN_USER, {
        email: formData.email,
        password: formData.password
      });

      if (response.data && response.data.token) {
        const user = {
          username: response.data.username,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber || "",
          token: response.data.token,
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", response.data.token);
        window.dispatchEvent(new Event("storage"));

        Swal.fire({
          toast: true,
          position: "top-end",
          title: "Đăng nhập thành công!",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          background: "#f6e6ec",
          color: "#333",
          icon: undefined,
        });

        setTimeout(() => navigate("/"), 1000);
      } else {
        setError("Lỗi: Không nhận được token từ server!");
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Đăng nhập thất bại. Vui lòng thử lại!",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        background: "#f6e6ec",
        color: "#333",
        icon: undefined,
      });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/users/auth/google";
  };
  
  return (
    <div className="login-page">
      <div className="login-auth-container">
        <div className="login-forms-container">
          {!showResetPasswordForm ? (
            <form className="login-sign-in-form" onSubmit={handleSubmit}>
              <h2 className="login-title">Đăng Nhập </h2>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <div className="login-input-field">
                <i className="fas fa-envelope"></i>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
              </div>

              <div className="login-input-field">
                <i className="fas fa-lock"></i>
                <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
              </div>

              <input type="submit" value="Đăng nhập" className="login-btn login-solid" />

              <p className="login-social-text">Hoặc đăng nhập bằng</p>
              <div className="login-social-media">
                <a href="#" className="login-social-icon">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#" className="login-social-icon" onClick={handleGoogleLogin}>
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
                <a href="#" className="login-social-icon">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="#" className="login-social-icon">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              </div>
              <p className="forgot-password-link" onClick={handleForgotPasswordClick}>
            Quên mật khẩu?
          </p>
        </form>
      ) : (
        <form className="reset-password-form" onSubmit={handleResetPassword}>
          <h2>Đặt lại mật khẩu</h2>
          <div className="login-input-field">
            <input
              type="text"
              name="otp"
              placeholder="Nhập mã OTP"
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-field">
            <input
              type="password"
              name="newPassword"
              placeholder="Mật khẩu mới"
              onChange={handleChange}
              required
            />
          </div>

          <input type="submit" value="Đặt lại mật khẩu" className="login-btn login-solid" />
          <button className="cancel-btn" onClick={() => setShowResetPasswordForm(false)}>
            Quay lại đăng nhập
          </button>
        </form>
      )}
    </div>

        <div className="login-welcome-container">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2 className="login-welcome-text">Hello, Welcome!</h2>
          <p className="login-account-question">Don't have an account?</p>
          <Link to="/signup" className="login-btn login-register-btn">Register</Link>
        </div>
      </div>

     {/* Modal quên mật khẩu */}
   {/* Modal quên mật khẩu */}
   {showForgotPasswordModal && (
    <div className="forgot-password-modal">
      <div className="modal-content">
        <h3>Quên mật khẩu</h3>
        <p>Vui lòng nhập email để nhận mã OTP đặt lại mật khẩu</p>
        <div className="login-input-field">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modal-buttons">
          <button
            className="cancel-btn"
            onClick={() => setShowForgotPasswordModal(false)}
          >
            Hủy
          </button>
          <button
            className="forgot-password-modal-btn"
            onClick={handleForgotPassword}
          >
            Gửi OTP
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default LoginPage;
