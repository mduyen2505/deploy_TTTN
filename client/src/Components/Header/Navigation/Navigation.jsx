import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { ClickAwayListener } from "@mui/material";
import { CATEGORIES, SUBCATEGORIES } from "../../../config/ApiConfig"; // Import API endpoints
import "./Style.css";

const Navigation = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({}); // Lưu danh mục con
  const [hoveredCategory, setHoveredCategory] = useState(null); // Lưu danh mục nào đang hover

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories from:", CATEGORIES);
        const response = await fetch(CATEGORIES);
        if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);

        const data = await response.json();
        console.log("Dữ liệu danh mục chính nhận được:", data);
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi fetch danh mục chính:", error.message);
      }
    };

    const fetchSubcategories = async () => {
      try {
        console.log("Fetching subcategories from:", SUBCATEGORIES);
        const response = await fetch(SUBCATEGORIES);
        if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);

        const data = await response.json();
        console.log("Dữ liệu danh mục con nhận được:", data);

        // Chuyển danh mục con thành object { category_id: [subcategories] }
        const formattedSubcategories = data.reduce((acc, sub) => {
          const parentId = sub.typeId._id; // Lấy ID danh mục cha
          if (!acc[parentId]) {
            acc[parentId] = [];
          }
          acc[parentId].push(sub);
          return acc;
        }, {});

        setSubcategories(formattedSubcategories);
      } catch (error) {
        console.error("Lỗi khi fetch danh mục con:", error.message);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  return (
    <div className={`layout ${isOpenSidebar ? "sidebar-open" : ""}`}>
      <nav className="navigation">
        <div className="container">
          <div className="row">
            <ClickAwayListener onClickAway={() => setIsOpenSidebar(false)}>
              <div className="col-sm-2 navPart1">
                <div className="catWrapper">
                  <Button
                    className="allCartTab align-items-center"
                    onClick={() => setIsOpenSidebar(!isOpenSidebar)}
                  >
                    <span className="icon1 mr-2"><IoIosMenu /></span>
                    <span className="text">ALL CATEGORIES</span>
                    <span className="icon2 ml-2"><FaAngleDown /></span>
                  </Button>

                  {/* Dropdown Menu */}
                  <div className={`sidebarNav ${isOpenSidebar ? "open" : ""}`}>
                    <ul>
                      {categories.map((category) => (
                        <li 
                          key={category._id}
                          onMouseEnter={() => setHoveredCategory(category._id)} // Khi hover vào
                          onMouseLeave={() => setHoveredCategory(null)} // Khi rời khỏi
                        >
                          <Link to={`/category/${category._id}`}>
                            <Button>
                              {category.Type_name}
                              <FaAngleRight className="ml-auto" />
                            </Button>
                          </Link>

                          {/* Hiển thị danh mục con khi hover */}
                          {hoveredCategory === category._id && subcategories[category._id] && (
                            <div className="submenu">
                              {subcategories[category._id].map((sub) => (
                                <Link key={sub._id} to={`/subcategory/${sub._id}`}>
                                  <Button>{sub.name}</Button>
                                </Link>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ClickAwayListener>

            {/* Right Part */}
            <div className="col-sm-10 navPart2 d-flex align-items-center">
              <ul className="list list-inline">
                <li className="list-inline-item"><Link to="/">HOME</Link></li>
                <li className="list-inline-item"><Link to="/menu">MENU</Link></li>
                <li className="list-inline-item"><Link to="/promo">PROMO</Link></li>
                <li className="list-inline-item"><Link to="/blog">BLOG</Link></li>
                <li className="list-inline-item"><Link to="/contact">CONTACT</Link></li>
                
              </ul>
              
            </div>
            
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
