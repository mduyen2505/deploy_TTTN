import React, { useState, useEffect } from "react";
import axios from "axios";
import "./productsForm.css";
import { API_CATEGORY } from "../../ApiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_CATEGORY.GET_ALL);
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục cha:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert("Tên danh mục không được để trống!");
      return;
    }

    try {
      const response = await axios.post(API_CATEGORY.ADD, { Type_name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory("");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục cha:", error);
    }
  };

  const handleEditCategory = (category) => {
    setEditCategoryId(category._id);
    setEditCategoryName(category.Type_name);
  };

  const handleSaveEditCategory = async () => {
    if (!editCategoryName.trim()) {
      alert("Tên danh mục không được để trống!");
      return;
    }

    try {
      await axios.put(API_CATEGORY.UPDATE(editCategoryId), { Type_name: editCategoryName });
      setCategories(categories.map(cat => 
        cat._id === editCategoryId ? { ...cat, Type_name: editCategoryName } : cat
      ));
      setEditCategoryId(null);
      setEditCategoryName("");
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục cha:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditCategoryId(null);
    setEditCategoryName("");
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      await axios.delete(API_CATEGORY.DELETE(id));
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa danh mục cha:", error);
    }
  };

  return (
    <div className="category-container">
      <h1 className="category-title">Quản lý Danh Mục</h1>
      <div className="category-form">
        <input
          type="text"
          className="category-input"
          placeholder="Nhập tên danh mục"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="category-add-button" onClick={handleAddCategory}>
          Thêm Danh Mục
        </button>
      </div>
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Danh Mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category._id}</td>
              <td>
                {editCategoryId === category._id ? (
                  <input
                    type="text"
                    className="category-edit-input"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                ) : (
                  category.Type_name
                )}
              </td>
              <td>
                {editCategoryId === category._id ? (
                  <>
                    <button className="category-save-button" onClick={handleSaveEditCategory}>
                      Lưu
                    </button>
                    <button className="category-cancel-button" onClick={handleCancelEdit}>
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button className="category-edit-button" onClick={() => handleEditCategory(category)}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className="category-delete-button" onClick={() => handleDeleteCategory(category._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Category;
