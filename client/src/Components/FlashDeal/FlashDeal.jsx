import React, { useState, useEffect } from "react";
import "./Style.css";

const products = [
  {
    id: 1,
    image: "https://media.hcdn.vn/catalog/product/p/r/promotions-auto-sua-chong-nang-anessa-duong-da-kiem-dau-60ml-moi_FtmKmTocW8hvmJRj_img_385x385_622873_fit_center.png",
    name: "Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml",
    originalPrice: 715000,
    salePrice: 534000,
    discount: 25,
    progress: 47,
  },
  {
    id: 2,
    image: "https://media.hcdn.vn/catalog/product/p/r/promotions-auto-nuoc-hoa-hong-khong-mui-klairs-danh-cho-da-nhay-cam-180ml_4FacjDarP86r6JCh_img_385x385_622873_fit_center.png",
    name: "Kem Dưỡng La Roche-Posay",
    originalPrice: 410000,
    salePrice: 268000,
    discount: 35,
    progress: 10,
  },
  {
    id: 3,
    image: "https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-422204906-1696235881_img_220x220_0dff4c_fit_center.png",
    name: "Nước Tẩy Trang L'Oreal Tươi Mát 400ml",
    originalPrice: 229000,
    salePrice: 134000,
    discount: 41,
    progress: 5,
  },
  {
    id: 4,
    image: "https://media.hcdn.vn/catalog/product/p/r/promotions-auto-sua-rua-mat-cerave-sach-sau-cho-da-thuong-den-da-dau-473ml_96RMtapoKRmu65aT_img_220x220_0dff4c_fit_center.png",
    name: "Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu",
    originalPrice: 455000,
    salePrice: 333000,
    discount: 27,
    progress: 10,
  },
  {
    id: 5,
    image: "https://media.hcdn.vn/catalog/product/p/r/promotions-auto-nuoc-hoa-hong-khong-mui-klairs-danh-cho-da-nhay-cam-180ml_4FacjDarP86r6JCh_img_220x220_0dff4c_fit_center.png",
    name: "Nước Hoa Hồng Klairs Không Mùi Cho Da Nhạy Cảm 180ml",
    originalPrice: 435000,
    salePrice: 209000,
    discount: 52,
    progress: 47,
  },
  {
    id:6,
    image: "https://media.hcdn.vn/catalog/product/p/r/promotions-auto-nuoc-tay-trang-bioderma-danh-cho-da-nhay-cam-500ml_WMciTXCqXYvVmHvN_img_220x220_0dff4c_fit_center.png",
    name: "Nước Tẩy Trang Bioderma Dành Cho Da Nhạy Cảm 500ml",
    originalPrice: 525000,
    salePrice: 311000,
    discount: 41,
    progress: 16,
  },
  {
    id: 7,
    image: "https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-205100137-1695896128_img_220x220_0dff4c_fit_center.png",
    name: "Nước Tẩy Trang L'Oreal Tươi Mát Cho Da Dầu, Hỗn Hợp",
    originalPrice: 229000,
    salePrice: 134000,
    discount: 41,
    progress: 5,
  },
  {
    id: 8,
    image: "https://media.hcdn.vn/catalog/product/p/r/promotions-auto-kem-chong-nang-skin1004-chiet-xuat-rau-ma-spf50-pa-50ml_bN4b2NsP6HNzTjqR_img_220x220_0dff4c_fit_center.png",
    name: "Kem Chống Nắng Skin1004 Cho Da Nhạy Cảm SPF 50+ 50ml",
    originalPrice: 445000,
    salePrice: 205000,
    discount: 54,
    progress: 47,
  },
  
];

const FlashDeal = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 2);

    const timer = setInterval(() => {
      const now = new Date();
      const timeDiff = endTime - now;

      if (timeDiff > 0) {
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flash-deal">
      <div className="flash-deal-header">
        <h2>Flash Deals</h2>
        <a href="/deals">Xem tất cả</a>
      </div>
      <div className="countdown-timer">
        Kết thúc sau:{" "}
        <span>
          {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <p className="product-name">{product.name}</p>
            <div className="product-price">
              <span className="original-price">
                {product?.originalPrice?.toLocaleString()} đ
              </span>
              <span className="sale-price">
                {product?.salePrice?.toLocaleString()} đ
              </span>
            </div>
            <p className="product-discount">-{product.discount}%</p>
            <div className="progress-bar">
              <div
                style={{ width: `${product.progress}%` }}
                className="progress"
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashDeal;
