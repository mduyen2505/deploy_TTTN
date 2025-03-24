import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import React from "react";
import Slider from "react-slick";
import './Style.css';

const HomeBanner = () => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: (
            <button className="slick-prev">
                <ArrowBackIosNew />
            </button>
        ),
        nextArrow: (
            <button className="slick-next">
                <ArrowForwardIos />
            </button>
        ),
    };
    return (
        <div className="homeBannerSection">
            <Slider {...settings}>
                <div className="item">
                    <img src="https://theme.hstatic.net/200000150709/1001127896/14/slider_3.jpg?v=486" className="w-100" />
                </div>
                <div className="item">
                    <img src="https://media.hcdn.vn/hsk/1735633480nuoc-hoahome3112.jpg" className="w-100" />
                </div>
                <div className="item">
                    <img src="https://media.hcdn.vn/hsk/1735814257homexakho21.jpg" className="w-100" />
                </div>
                <div className="item">
                    <img src="https://media.hcdn.vn/hsk/1735786059byshome21.jpg" className="w-100" />
                </div>
            </Slider>
        </div>
    );
};

export default HomeBanner;
