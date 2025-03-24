import React, { useState, useEffect } from "react";
import { IoLocationSharp } from "react-icons/io5";
import Button from "@mui/material/Button";
import axios from "axios"; // Import axios để gọi API
import "./Style.css";

const Location = () => {
    const [location, setLocation] = useState("");

    useEffect(() => {
        // Kiểm tra xem địa chỉ đã được lưu trữ trong localStorage hay chưa
        const storedLocation = localStorage.getItem("location");
        if (storedLocation) {
            setLocation(storedLocation);
        } else {
            // Nếu chưa có, gọi API để lấy địa chỉ
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("Current Location:", latitude, longitude);

                        // Gọi API lấy địa chỉ từ tọa độ
                        try {
                            const response = await axios.get(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                            );

                            if (response.data && response.data.address) {
                                const { city, town, village, state, suburb, borough, county } = response.data.address;
                                const { road, neighbourhood, hamlet } = response.data.address;
                                const district = response.data.address.city_district || response.data.address.district;
                                
                                // Lấy thông tin Phường, Quận, TP
                                const ward = suburb || "";
                                const districtName = district || "";
                                const cityName = city || town || village || ""; // Chỉ lấy tên thành phố, thị trấn hoặc làng

                                // Tạo chuỗi địa chỉ mà không có dấu phẩy dư thừa
                                const addressParts = [ward, districtName, cityName].filter(part => part);
                                const address = addressParts.join(", ");

                                // Lưu trữ địa chỉ trong localStorage
                                localStorage.setItem("location", address);

                                setLocation(address);
                            } else {
                                alert("Unable to fetch address details.");
                            }
                        } catch (error) {
                            console.error("Error fetching address:", error);
                            alert("Error fetching address. Please try again.");
                        }
                    },
                    (error) => {
                        console.error("Error fetching location:", error);
                        alert("Unable to fetch location. Please enable location services.");
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        }
    }, []); // Chạy một lần khi component được mount

    return (
        <Button className="location">
            <IoLocationSharp className="location-icon" />
            <div className="info d-flex flex-column">
                <span className="label" style={{ fontSize: "10px" }}>{location ? ` ${location}` : "Your Location"}</span>
            </div>
        </Button>
    );
};

export default Location;