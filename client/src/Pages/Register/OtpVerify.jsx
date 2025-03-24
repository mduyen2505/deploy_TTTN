import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { VERIFY_OTP } from "../../config/ApiConfig";
import "./OtpVerify.css";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem("emailForOtp");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30); // Thời gian chờ gửi lại OTP

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  // Hàm gửi lại OTP
  const handleResendOtp = async () => {
    setIsDisabled(true);
    setCountdown(30); // Reset thời gian đếm ngược

    try {
      const response = await axios.post(`${VERIFY_OTP}/resend`, { email });
      console.log("Resend OTP response:", response.data);

      Swal.fire({
        title: "OTP mới đã được gửi!",
        text: "Vui lòng kiểm tra email của bạn.",
        icon: "success",
        timer: 1500,
      });

      // Đếm ngược để kích hoạt lại nút gửi
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi gửi lại OTP:", error);
      setError("Lỗi khi gửi lại OTP. Vui lòng thử lại.");
      setIsDisabled(false);
    }
  };

  // Hàm xử lý xác thực OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Sending OTP verification request for email:", email);
    console.log("Sending OTP:", otp);

    try {
      const response = await axios.post(VERIFY_OTP, { email, otp });

      console.log("OTP verification response:", response.data);

      if (response.data.message === "Xác thực thành công") {
        Swal.fire({
          title: "Xác thực thành công!",
          text: "Bạn đã đăng ký thành công.",
          icon: "success",
          timer: 1500,
        });

        navigate("/login");
      } else {
        setError("OTP không chính xác. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setError("Lỗi khi xác thực OTP. Vui lòng thử lại.");
    }
  };

  return (
    <div className="otp-verify-page">
      <div className="otp-verify-container">
        <h2>Xác Thực OTP</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            <input
              type="text"
              name="otp"
              placeholder="Nhập OTP"
              value={otp}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="otp-verify-btn">
            Xác Thực
          </button>
          <div className="otp-resend">
            <p>
              Không nhận được mã?
              <button
                className="otp-resend-btn"
                onClick={handleResendOtp}
                disabled={isDisabled}
              >
                {isDisabled ? `Gửi lại sau ${countdown}s` : "Gửi lại"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;
