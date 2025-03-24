import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Address.css";

const AddressSelector = ({ onSelectAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Lỗi tải tỉnh/thành phố:", err));
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceName = e.target.options[e.target.selectedIndex].text;
    setSelectedProvince(provinceName);
    setSelectedDistrict("");
    setSelectedWard("");

    const provinceCode = e.target.value;
    if (provinceCode) {
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      setDistricts(res.data.districts);
      setWards([]);
    }

    updateFullAddress(provinceName, "", "", streetAddress);
  };

  const handleDistrictChange = async (e) => {
    const districtName = e.target.options[e.target.selectedIndex].text;
    setSelectedDistrict(districtName);
    setSelectedWard("");

    const districtCode = e.target.value;
    if (districtCode) {
      const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      setWards(res.data.wards);
    }

    updateFullAddress(selectedProvince, districtName, "", streetAddress);
  };

  const handleWardChange = (e) => {
    const wardName = e.target.options[e.target.selectedIndex].text;
    setSelectedWard(wardName);
    updateFullAddress(selectedProvince, selectedDistrict, wardName, streetAddress);
  };

  const handleStreetAddressChange = (e) => {
    const address = e.target.value;
    setStreetAddress(address);
    updateFullAddress(selectedProvince, selectedDistrict, selectedWard, address);
  };

  const updateFullAddress = (province, district, ward, street) => {
    const fullAddress = `${street ? street + ", " : ""}${ward ? ward + ", " : ""}${district ? district + ", " : ""}${province}`;
    onSelectAddress(fullAddress);
  };

  return (
    <div className="address-selector">
      <div className="address-form-group">
        <label>Tỉnh / Thành phố</label>
        <select onChange={handleProvinceChange}>
          <option value="">Chọn tỉnh</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="address-form-group">
        <label>Quận / Huyện</label>
        <select onChange={handleDistrictChange} disabled={!districts.length}>
          <option value="">Chọn quận</option>
          {districts.map((d) => (
            <option key={d.code} value={d.code}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="address-form-group">
        <label>Xã / Phường</label>
        <select onChange={handleWardChange} disabled={!wards.length}>
          <option value="">Chọn xã</option>
          {wards.map((w) => (
            <option key={w.code} value={w.code}>{w.name}</option>
          ))}
        </select>
      </div>

      <div className="address-form-group">
        <label>Số nhà, tên đường</label>
        <input
          type="text"
          value={streetAddress}
          onChange={handleStreetAddressChange}
          placeholder="Nhập số nhà, tên đường"
        />
      </div>
    </div>
  );
};

export default AddressSelector;
