import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/blogs/${id}`
        );
        const blogData = response.data.data;
        setBlog(blogData);
        setLikes(blogData.likes.length);
        setDislikes(blogData.dislikes.length);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết blog:", error);
        setLoading(false);
      }
    };
    fetchBlogDetail();
  }, [id]);

  const handleLike = async () => {
    try {
      await axios.put(`http://localhost:3000/api/blogs/${id}/like`);
      setLikes(likes + 1);
    } catch (error) {
      console.error("Lỗi khi thích bài viết:", error);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.put(`http://localhost:3000/api/blogs/${id}/dislike`);
      setDislikes(dislikes + 1);
    } catch (error) {
      console.error("Lỗi khi không thích bài viết:", error);
    }
  };

  if (loading) {
    return <p>Đang tải bài viết...</p>;
  }

  if (!blog) {
    return <p>Bài viết không tồn tại.</p>;
  }

  return (
    <>
      {" "}
      <Header />
      <div className="blog-article-container">
        <div className="container">
          <h1 className="article-title">{blog.title}</h1>
          <p className="article-meta">
            Tác giả: {blog.author} | Ngày đăng:{" "}
            {new Date(blog.createdAt).toLocaleDateString()} |{" "}
            <button className="like-button" onClick={handleLike}>
              <FontAwesomeIcon icon={faThumbsUp} /> {likes}
            </button>
            <button className="dislike-button" onClick={handleDislike}>
              <FontAwesomeIcon icon={faThumbsDown} /> {dislikes}
            </button>
          </p>
          <p className="article-views">
            <FontAwesomeIcon icon={faEye} /> Lượt xem: {blog.numViews}
          </p>
          <div className="article-content-tag">
            {blog.tags.map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>
          <p className="article-description">{blog.descriptions}</p>

          {blog.content.map((item, index) => {
            const firstSentenceEnd = item.description.indexOf(".") + 1;
            const firstSentence = item.description.substring(
              0,
              firstSentenceEnd
            );
            const remainingText = item.description.substring(firstSentenceEnd);
            return (
              <div key={index} className="article-content-block">
                <p className="article-content-description">
                  <strong>{firstSentence}</strong>
                  <br />
                  {remainingText}
                </p>
                <img
                  src={`http://localhost:3000/images/${item.image}`}
                  alt={`Hình ảnh ${index + 1}`}
                  className="article-content-image"
                />
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;
