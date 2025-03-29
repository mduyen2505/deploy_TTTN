import React, { useEffect, useState } from "react";
import "./Blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    images: "",
    category: "",
    author: "",
    tags: "",
    descriptions: "",
    content: [],
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(
        "https://deploytttn-production.up.railway.app/api/blogs"
      );
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách blog:", error);
    }
  };

  const handleAddBlog = async () => {
    try {
      const requestBody = {
        title: newBlog.title,
        images: newBlog.images.split(","),
        category: newBlog.category,
        author: newBlog.author,
        tags: newBlog.tags.split(","),
        descriptions: newBlog.descriptions,
        content: newBlog.content,
      };

      const response = await fetch(
        "https://deploytttn-production.up.railway.app/api/blogs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        fetchBlogs();
        setNewBlog({
          title: "",
          images: "",
          category: "",
          author: "",
          tags: "",
          descriptions: "",
          content: [],
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm blog:", error);
    }
  };

  const handleEditBlog = async () => {
    if (!editingBlog) return;

    const requestBody = {
      title: editingBlog.title,
      images: editingBlog.images.split(","),
      category: editingBlog.category,
      author: editingBlog.author,
      tags: editingBlog.tags.split(","),
      descriptions: editingBlog.descriptions,
      content: editingBlog.content,
    };

    try {
      const response = await fetch(
        `https://deploytttn-production.up.railway.app/api/blogs/${editingBlog._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        fetchBlogs();
        setEditingBlog(null);
        alert("Cập nhật blog thành công!");
      } else {
        const result = await response.json();
        console.error("Lỗi khi cập nhật blog:", result);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật blog:", error);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      const response = await fetch(
        `https://deploytttn-production.up.railway.app/api/blogs/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error("Lỗi khi xóa blog:", error);
    }
  };

  const handleSelectBlog = (blog) => {
    setSelectedBlog(blog);
  };

  const handleCloseModal = () => {
    setSelectedBlog(null);
  };

  const handleContentChange = (index, field, value) => {
    const updatedContent = [...newBlog.content];
    updatedContent[index] = { ...updatedContent[index], [field]: value };
    setNewBlog({ ...newBlog, content: updatedContent });
  };

  const handleEditContentChange = (index, field, value) => {
    const updatedContent = [...editingBlog.content];
    updatedContent[index] = { ...updatedContent[index], [field]: value };
    setEditingBlog({ ...editingBlog, content: updatedContent });
  };

  const addContentField = () => {
    setNewBlog({
      ...newBlog,
      content: [...newBlog.content, { image: "", description: "" }],
    });
  };

  const addEditContentField = () => {
    setEditingBlog({
      ...editingBlog,
      content: [...editingBlog.content, { image: "", description: "" }],
    });
  };

  const handleEditClick = (blog) => {
    setEditingBlog({
      ...blog,
      images: blog.images.join(","),
      tags: blog.tags.join(","),
    });
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
  };

  return (
    <div className="blog-management">
      <h2>Quản lý Blog</h2>
      <div className="blog-form">
        <h3>{editingBlog ? "Chỉnh sửa Blog" : "Thêm Blog"}</h3>
        <input
          type="text"
          placeholder="Tiêu đề"
          value={editingBlog ? editingBlog.title : newBlog.title}
          onChange={(e) =>
            editingBlog
              ? setEditingBlog({ ...editingBlog, title: e.target.value })
              : setNewBlog({ ...newBlog, title: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Hình ảnh (URL, cách nhau bởi dấu phẩy)"
          value={editingBlog ? editingBlog.images : newBlog.images}
          onChange={(e) =>
            editingBlog
              ? setEditingBlog({ ...editingBlog, images: e.target.value })
              : setNewBlog({ ...newBlog, images: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Danh mục"
          value={editingBlog ? editingBlog.category : newBlog.category}
          onChange={(e) =>
            editingBlog
              ? setEditingBlog({ ...editingBlog, category: e.target.value })
              : setNewBlog({ ...newBlog, category: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Tác giả"
          value={editingBlog ? editingBlog.author : newBlog.author}
          onChange={(e) =>
            editingBlog
              ? setEditingBlog({ ...editingBlog, author: e.target.value })
              : setNewBlog({ ...newBlog, author: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Tags (cách nhau bởi dấu phẩy)"
          value={editingBlog ? editingBlog.tags : newBlog.tags}
          onChange={(e) =>
            editingBlog
              ? setEditingBlog({ ...editingBlog, tags: e.target.value })
              : setNewBlog({ ...newBlog, tags: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Mô tả"
          value={editingBlog ? editingBlog.descriptions : newBlog.descriptions}
          onChange={(e) =>
            editingBlog
              ? setEditingBlog({ ...editingBlog, descriptions: e.target.value })
              : setNewBlog({ ...newBlog, descriptions: e.target.value })
          }
          required
        />
        <div>
          <h4>Nội dung</h4>
          {(editingBlog ? editingBlog.content : newBlog.content).map(
            (item, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Hình ảnh nội dung (URL)"
                  value={item.image}
                  onChange={(e) =>
                    editingBlog
                      ? handleEditContentChange(index, "image", e.target.value)
                      : handleContentChange(index, "image", e.target.value)
                  }
                  required
                />
                <textarea
                  placeholder="Mô tả nội dung"
                  value={item.description}
                  onChange={(e) =>
                    editingBlog
                      ? handleEditContentChange(
                          index,
                          "description",
                          e.target.value
                        )
                      : handleContentChange(
                          index,
                          "description",
                          e.target.value
                        )
                  }
                  required
                />
              </div>
            )
          )}
          <button onClick={editingBlog ? addEditContentField : addContentField}>
            Thêm Nội Dung
          </button>
        </div>
        <button onClick={editingBlog ? handleEditBlog : handleAddBlog}>
          {editingBlog ? "Lưu" : "Thêm Blog"}
        </button>
        {editingBlog && <button onClick={handleCancelEdit}>Hủy</button>}
      </div>
      <div className="blog-list">
        <h3>Danh sách Blog</h3>
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="blog-item"
            onClick={() => handleSelectBlog(blog)}
          >
            <h4>{blog.title}</h4>
            <p>{blog.descriptions}</p>
            <p>Danh mục: {blog.category}</p>
            <p>Tác giả: {blog.author}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(blog);
              }}
            >
              Sửa
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBlog(blog._id);
              }}
            >
              Xóa
            </button>
          </div>
        ))}
      </div>

      {selectedBlog && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>{selectedBlog.title}</h2>
            <p>{selectedBlog.descriptions}</p>
            <p>Danh mục: {selectedBlog.category}</p>
            <p>Tác giả: {selectedBlog.author}</p>
            <p>Tags: {selectedBlog.tags.join(", ")}</p>
            <p>Lượt xem: {selectedBlog.numViews}</p>
            <p>Thích: {selectedBlog.likes.length}</p>
            <p>Không thích: {selectedBlog.dislikes.length}</p>
            <div>
              <h3>Hình ảnh</h3>
              {selectedBlog.images.map((image, index) => (
                <img
                  src={`https://deploytttn-production.up.railway.app/api/images/${selectedBlog.images[0]}`}
                  alt={selectedBlog.title}
                  className="blog-img"
                />
              ))}
            </div>
            <div>
              <h3>Nội dung</h3>
              {selectedBlog.content.map((item, index) => (
                <div key={index}>
                  <img
                    src={`https://deploytttn-production.up.railway.app/api/images/${item.image}`}
                    alt={`Hình ảnh ${index + 1}`}
                    className="article-content-image"
                  />
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
