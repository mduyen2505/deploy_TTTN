


import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Style.css";
import { GET_BLOB } from "../../config/ApiConfig";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(GET_BLOB);
        setBlogs(response.data.data); // Lưu dữ liệu từ API vào state
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách blog:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <p>Đang tải bài viết...</p>;
  }

  return (
    <div className="blog-suggestion-section">
      <div className="container">
        <h2 className="blog-suggestion-title">BLOG</h2>
        <div className="blog-suggestion-list">
          {blogs.map((blog) => (
            <div className="blog-item" key={blog._id}>
              {/* Ảnh chính của bài blog */}
              <img
                src={`http://localhost:3000/images/${blog.images[0]}`}
                alt={blog.title}
                className="blog-img"
              />
              <div className="blog-info">
                {/* Tiêu đề blog */}
                <h5 className="blog-title">{blog.title}</h5>
                <p className="blog-meta">
                  {blog.author} |{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className="blog-description">{blog.descriptions}</p>
                {/* Link dẫn đến chi tiết blog */}
                <a href={`/blog/${blog._id}`} className="read-more">
                  Xem chi tiết
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
