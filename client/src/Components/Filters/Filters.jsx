import React, { useState } from "react";
import "./Style.css";

const Filter = ({ setSelectedPriceRange, applyFilters }) => {
    const [selectedRanges, setSelectedRanges] = useState([]);

    // Hàm xử lý thay đổi checkbox
    const handleCheckboxChange = (value) => {
        setSelectedRanges((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    // Hàm gọi khi nhấn nút "Áp dụng"
    const handleApplyFilters = () => {
        setSelectedPriceRange(selectedRanges);
        applyFilters();
    };

    return (
        <aside className="sidebar">
            <h2>Bộ lọc giá</h2>
            {[
                { label: "Dưới 100K", value: "0-100000" },
                { label: "100K - 200K", value: "100000-200000" },
                { label: "200K - 300K", value: "200000-300000" },
                { label: "300K - 400K", value: "300000-400000" },
                { label: "400K - 500K", value: "400000-500000" },
                { label: "500K - 1M", value: "500000-1000000" },
                { label: "1M - 2M", value: "1000000-2000000" },
                { label: "2M - 5M", value: "2000000-5000000" },
                { label: "5M - 10M", value: "5000000-10000000" },
                { label: "Trên 10M", value: "10000000+" },
            ].map((range, index) => (
                <label key={index} className="checkbox-container">
                    <input
                        type="checkbox"
                        value={range.value}
                        onChange={() => handleCheckboxChange(range.value)}
                    />{" "}
                    {range.label}
                </label>
            ))}
            <button className="apply-filter" onClick={handleApplyFilters}>
                Áp dụng
            </button>
        </aside>
    );
};

export default Filter;
