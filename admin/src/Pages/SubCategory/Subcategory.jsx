import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Subcategory.css"
import { API_SUBCATEGORY, API_CATEGORY} from "../../ApiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({ name: "", typeId: "" });
  const [editSubCategoryId, setEditSubCategoryId] = useState(null);
  const [editSubCategoryData, setEditSubCategoryData] = useState({ name: "", typeId: "" });

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchSubCategories();
    };
    fetchData();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(API_SUBCATEGORY.GET_ALL);
      const subCategoriesWithCategoryNames = response.data.map(subcategory => {
        const category = categories.find(cat => cat._id === subcategory.typeId);
        return {
          ...subcategory,
          typeName: category ? category.Type_name : "Không xác định"
        };
      });
      setSubCategories(subCategoriesWithCategoryNames);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục con:", error);
    }
  };
  
 
  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_CATEGORY.GET_ALL);
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục cha:", error);
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategory.name.trim() || !newSubCategory.typeId) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await axios.post(API_SUBCATEGORY.ADD, newSubCategory);
      const category = categories.find(cat => cat._id === response.data.typeId._id);
      setSubCategories([...subCategories, { ...response.data, typeName: category ? category.Type_name : "Không xác định" }]);
      setNewSubCategory({ name: "", typeId: "" });
    } catch (error) {
      console.error("Lỗi khi thêm danh mục con:", error);
    }
  };

  const handleEditSubCategory = (subcategory) => {
    setEditSubCategoryId(subcategory._id);
    setEditSubCategoryData({ name: subcategory.name, typeId: subcategory.typeId._id });
  };

  const handleSaveEditSubCategory = async () => {
    if (!editSubCategoryData.name.trim() || !editSubCategoryData.typeId) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await axios.put(API_SUBCATEGORY.UPDATE(editSubCategoryId), editSubCategoryData);
      const category = categories.find(cat => cat._id === editSubCategoryData.typeId);
      setSubCategories(subCategories.map(sub =>
        sub._id === editSubCategoryId ? { ...sub, ...editSubCategoryData, typeName: category ? category.Type_name : "Không xác định" } : sub
      ));
      setEditSubCategoryId(null);
      setEditSubCategoryData({ name: "", typeId: "" });
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục con:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditSubCategoryId(null);
    setEditSubCategoryData({ name: "", typeId: "" });
  };

  const handleDeleteSubCategory = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục con này?")) return;

    try {
      await axios.delete(API_SUBCATEGORY.DELETE(id));
      setSubCategories(subCategories.filter((subcategory) => subcategory._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa danh mục con:", error);
    }
  };

  return (
    <div className="product-page">
      <h1>Quản lý Danh Mục Con</h1>

      <div className="add-category">
        <input
          type="text"
          placeholder="Nhập tên danh mục con"
          value={newSubCategory.name}
          onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
        />
        <select
          value={newSubCategory.typeId}
          onChange={(e) => setNewSubCategory({ ...newSubCategory, typeId: e.target.value })}
        >
          <option value="">Chọn danh mục cha</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.Type_name}
            </option>
          ))}
        </select>
        <button className="add-product" onClick={handleAddSubCategory}>
          Thêm Danh Mục Con
        </button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Danh Mục Con</th>
            <th>Danh Mục Cha</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {subCategories.map((subcategory) => (
            <tr key={subcategory._id}>
              <td>{subcategory._id}</td>
              <td>
                {editSubCategoryId === subcategory._id ? (
                  <input
                    type="text"
                    value={editSubCategoryData.name}
                    onChange={(e) =>
                      setEditSubCategoryData({ ...editSubCategoryData, name: e.target.value })
                    }
                  />
                ) : (
                  subcategory.name
                )}
              </td>
              <td>
                {editSubCategoryId === subcategory._id ? (
                  <select
                    value={editSubCategoryData.typeId}
                    onChange={(e) =>
                      setEditSubCategoryData({ ...editSubCategoryData, typeId: e.target.value })
                    }
                  >
                    <option value="">Chọn danh mục cha</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.Type_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  subcategory.typeName
                )}
              </td>
              <td>
                {editSubCategoryId === subcategory._id ? (
                  <>
                    <button className="save-product" onClick={handleSaveEditSubCategory}>
                      Lưu
                    </button>
                    <button className="cancel-product" onClick={handleCancelEdit}>
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button className="edit-product" onClick={() => handleEditSubCategory(subcategory)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className="delete-product" onClick={() => handleDeleteSubCategory(subcategory._id)}>
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

export default SubCategory;