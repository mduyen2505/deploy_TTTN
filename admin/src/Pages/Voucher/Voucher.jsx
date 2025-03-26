import React, { useEffect, useState } from "react";
import "./Voucher.css";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [newVoucher, setNewVoucher] = useState({
    name: "",
    description: "",
    expiry: "",
    discount: "",
    stock: "",
    image: null,
  });
  const [editingVoucher, setEditingVoucher] = useState(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      console.log("Fetching vouchers...");
      const response = await fetch(
        "deploytttn-production.up.railway.app/api/coupons"
      );
      const data = await response.json();
      console.log("Response from server:", data);

      if (data.status === "OK") {
        setVouchers(data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách voucher:", error);
    }
  };

  const handleAddVoucher = async () => {
    try {
      const requestBody = {
        name: newVoucher.name.toUpperCase(), // Ensure name is uppercase
        description: newVoucher.description,
        expiry: new Date(newVoucher.expiry).toISOString(), // Convert to valid Date format
        discount: parseFloat(newVoucher.discount),
        stock: Math.max(0, parseInt(newVoucher.stock)), // Ensure stock is non-negative
        image: newVoucher.image,
      };

      console.log("Dữ liệu gửi lên:", requestBody);

      const response = await fetch(
        "deploytttn-production.up.railway.app/api/coupons",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log("Phản hồi từ server:", result);

      if (response.ok) {
        fetchVouchers();
        setNewVoucher({
          name: "",
          description: "",
          expiry: "",
          discount: "",
          stock: "",
          image: "",
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm voucher:", error);
    }
  };

  const handleEditVoucher = async () => {
    if (!editingVoucher) return;

    let requestBody;
    let headers = { "Content-Type": "application/json" };

    if (editingVoucher.image instanceof File) {
      const newFileName = `voucher_${Date.now()}_${editingVoucher.image.name}`;
      const renamedImage = new File([editingVoucher.image], newFileName, {
        type: editingVoucher.image.type,
      });

      requestBody = new FormData();
      requestBody.append("name", editingVoucher.name);
      requestBody.append("description", editingVoucher.description);
      requestBody.append("expiry", editingVoucher.expiry);
      requestBody.append("discount", parseFloat(editingVoucher.discount));
      requestBody.append("stock", parseInt(editingVoucher.stock));
      requestBody.append("image", renamedImage);
      headers = {};
    } else {
      requestBody = JSON.stringify({
        name: editingVoucher.name,
        description: editingVoucher.description,
        expiry: editingVoucher.expiry,
        discount: parseFloat(editingVoucher.discount),
        stock: parseInt(editingVoucher.stock),
        image: editingVoucher.image,
      });
    }

    console.log("Chỉnh sửa voucher:", editingVoucher);
    console.log("Dữ liệu gửi lên server:", requestBody);

    try {
      const response = await fetch(
        `deploytttn-production.up.railway.app/api/coupons/${editingVoucher._id}`,
        {
          method: "PUT",
          headers: headers,
          body: requestBody,
        }
      );

      const result = await response.json();
      console.log("Phản hồi từ server:", result);

      if (response.ok) {
        fetchVouchers();
        setEditingVoucher(null);
        alert("Cập nhật voucher thành công!");
      } else {
        console.error("Lỗi khi cập nhật voucher:", result);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
    }
  };

  const handleDeleteVoucher = async (id) => {
    try {
      const response = await fetch(
        `deploytttn-production.up.railway.app/api/coupons/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchVouchers();
      }
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
    }
  };

  return (
    <div className="voucher-management">
      <h2>Quản lý Voucher</h2>

      <div className="voucher-form">
        <h3>Thêm Voucher</h3>
        <input
          type="text"
          placeholder="Tên"
          value={newVoucher.name}
          onChange={(e) =>
            setNewVoucher({ ...newVoucher, name: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Mô tả"
          value={newVoucher.description}
          onChange={(e) =>
            setNewVoucher({ ...newVoucher, description: e.target.value })
          }
          required
        />
        <input
          type="date"
          value={newVoucher.expiry}
          onChange={(e) =>
            setNewVoucher({ ...newVoucher, expiry: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Giảm giá (%)"
          value={newVoucher.discount}
          onChange={(e) =>
            setNewVoucher({ ...newVoucher, discount: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Số lượng"
          value={newVoucher.stock}
          onChange={(e) =>
            setNewVoucher({ ...newVoucher, stock: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="URL hình ảnh"
          value={newVoucher.image}
          onChange={(e) =>
            setNewVoucher({ ...newVoucher, image: e.target.value })
          }
          required
        />
        <button onClick={handleAddVoucher}>Thêm Voucher</button>
      </div>

      <div className="voucher-list">
        <h3>Danh sách Voucher</h3>
        {vouchers.map((voucher) => (
          <div key={voucher._id} className="voucher-item">
            <img
              src={`deploytttn-production.up.railway.app/images/${voucher.image}`}
              alt={voucher.name}
              className="voucher-logo"
            />
            <h4>{voucher.name}</h4>
            <p>{voucher.description}</p>
            <p>Giảm giá: {voucher.discount}%</p>
            <p>
              Hết hạn: {new Date(voucher.expiry).toISOString().split("T")[0]}
            </p>
            <p>Số lượng: {voucher.stock}</p>
            <button onClick={() => setEditingVoucher(voucher)}>Sửa</button>
            <button onClick={() => handleDeleteVoucher(voucher._id)}>
              Xóa
            </button>
          </div>
        ))}
      </div>

      {editingVoucher && (
        <div className="edit-modal">
          <h3>Chỉnh sửa Voucher</h3>

          <input
            type="text"
            placeholder="Tên"
            value={editingVoucher.name}
            onChange={(e) =>
              setEditingVoucher({ ...editingVoucher, name: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Mô tả"
            value={editingVoucher.description}
            onChange={(e) =>
              setEditingVoucher({
                ...editingVoucher,
                description: e.target.value,
              })
            }
            required
          />

          <input
            type="date"
            value={
              editingVoucher.expiry
                ? new Date(editingVoucher.expiry).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setEditingVoucher({ ...editingVoucher, expiry: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Giảm giá (%)"
            value={editingVoucher.discount}
            onChange={(e) =>
              setEditingVoucher({ ...editingVoucher, discount: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Số lượng"
            value={editingVoucher.stock}
            onChange={(e) =>
              setEditingVoucher({ ...editingVoucher, stock: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="URL hình ảnh"
            value={editingVoucher.image}
            onChange={(e) =>
              setEditingVoucher({ ...editingVoucher, image: e.target.value })
            }
            required
          />

          <button onClick={handleEditVoucher}>Lưu</button>
          <button onClick={() => setEditingVoucher(null)}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default Voucher;
