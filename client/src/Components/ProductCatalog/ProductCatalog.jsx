import React, { useState, useEffect } from "react";
import "./Style.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid"; 
import { Navigation, Grid } from "swiper/modules"; 
import { BRANDS } from "../../config/ApiConfig"; 
const ProductCatalog = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(BRANDS);
        const data = await response.json();

        if (data && Array.isArray(data.brands)) {
          setBrands(data.brands);
        } else {
          console.error("Dữ liệu API không đúng:", data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <section className="productCat">
      <div className="container">
        <h3 className="mb-4 hd">Brands</h3> {/* Tiêu đề căn trái */}
        {brands.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className="swiper-container">
            <Swiper
              slidesPerView={3} // 2 cột
              grid={{ rows: 3, fill: "row" }} // 2 hàng, lấp đầy theo chiều dọc
              spaceBetween={10}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              slidesPerGroup={3} // Lướt qua 2 cột mỗi lần
              modules={[Navigation, Grid]} // Thêm Grid module
              className="mySwiper"
            >
              {brands.map((brand) => (
                <SwiperSlide key={brand._id}>
                  <div className="item text-center cursor">
                    <Link to={`/brand/${brand._id}`}>
                      <img
                        src={
                          brand.image.startsWith("http")
                            ? brand.image
                            : `http://localhost:3000/images/${brand.image}`
                        }
                        alt={brand.title}
                      />
                    </Link>

                    <h6>{brand.title}</h6>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Chỉ 2 nút điều hướng nằm bên phải */}
            <div className="swiper-nav-buttons">
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
