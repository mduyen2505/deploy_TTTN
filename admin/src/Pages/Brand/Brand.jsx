import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { API_BRAND } from "../../ApiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "./Brand.css";

Modal.setAppElement("#root");

const BrandAdmin = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [editBrandId, setEditBrandId] = useState(null);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(API_BRAND.GET_ALL);
      setBrands(response.data.brands || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
      setError("Không thể tải danh sách thương hiệu.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (brand = null) => {
    if (brand) {
      setEditBrandId(brand._id);
      setNewBrand({
        title: brand.title,
        description: brand.description,
        image: brand.image,
      });
    } else {
      setEditBrandId(null);
      setNewBrand({ title: "", description: "", image: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewBrand({ title: "", description: "", image: "" });
  };

  const handleSaveBrand = async () => {
    if (!newBrand.title.trim()) {
      alert("Tên thương hiệu không được để trống!");
      return;
    }

    const requestBody = {
      title: newBrand.title,
      description: newBrand.description,
      image: newBrand.image,
    };

    try {
      if (editBrandId) {
        console.log("Updating brand:", requestBody);
        await axios.put(
          `deploytttn-production.up.railway.app/api/brands/${editBrandId}`,
          requestBody,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        fetchBrands();
      } else {
        console.log("Adding new brand:", requestBody);
        await axios.post(
          "deploytttn-production.up.railway.app/api/brands",
          requestBody,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        fetchBrands();
      }
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu thương hiệu:", error);
      alert("Không thể lưu thương hiệu!");
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) return;

    try {
      console.log("Deleting brand with ID:", id);
      await axios.delete(
        `deploytttn-production.up.railway.app/api/brands/${id}`
      );
      fetchBrands();
    } catch (error) {
      console.error("Lỗi khi xóa thương hiệu:", error);
      alert("Không thể xóa thương hiệu!");
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = brands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(brands.length / itemsPerPage);

  return (
    <div className="brand-page">
      <h1>Quản lý Thương Hiệu</h1>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error-message">{error}</p>}

      <button className="add-brand-btn" onClick={() => openModal()}>
        Thêm Thương Hiệu
      </button>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal">
        <h2>{editBrandId ? "Sửa Thương Hiệu" : "Thêm Thương Hiệu Mới"}</h2>
        <div className="add-brand">
          <label>Tên thương hiệu:</label>
          <input
            type="text"
            value={newBrand.title}
            onChange={(e) =>
              setNewBrand({ ...newBrand, title: e.target.value })
            }
            required
          />

          <label>Mô tả:</label>
          <textarea
            value={newBrand.description}
            onChange={(e) =>
              setNewBrand({ ...newBrand, description: e.target.value })
            }
          />

          <label>Hình ảnh (tên file):</label>
          <input
            type="text"
            value={newBrand.image}
            onChange={(e) =>
              setNewBrand({ ...newBrand, image: e.target.value })
            }
          />
        </div>
        <div className="modal-actions">
          <button className="save-brand-btn" onClick={handleSaveBrand}>
            Lưu
          </button>
          <button className="cancel-brand-btn" onClick={closeModal}>
            Hủy
          </button>
        </div>
      </Modal>

      <table className="brand-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Thương Hiệu</th>
            <th>Mô Tả</th>
            <th>Hình Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((brand) => (
            <tr key={brand._id}>
              <td>{brand._id}</td>
              <td>{brand.title}</td>
              <td>{brand.description}</td>
              <td>
                {brand.image ? (
                  <img
                    src={`deploytttn-production.up.railway.app/api/images/${brand.image}`}
                    alt={brand.title}
                    width="100"
                  />
                ) : (
                  "Chưa có ảnh"
                )}
              </td>
              <td>
                <button
                  className="edit-brand-btn"
                  onClick={() => openModal(brand)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="delete-brand-btn"
                  onClick={() => handleDeleteBrand(brand._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandAdmin;
