import React from 'react';
import './sideBar.css';
import { Link } from 'react-router-dom';




function SideBar() {
  return (
    <aside id="sidebar" className='sidebar'>
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </a>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#components-nav"
              data-bs-toggle="collapse"
              href="#"
            >
              <i className="bi bi-people"></i>      
              <span>Users</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul 
              id="components-nav"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              
              <li>
                <a href="./Customers">
                  <i className="bi bi-circle"></i>
                    <span>Customers</span>
                 </a>   
              </li>
             

              
            </ul>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#form-nav"
              data-bs-toggle="collapse"
              href="#"
            >
              <i className="bi bi-journal-text"></i>
              <span>Products</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
            id="form-nav"
            className="nav-content collapse"
            data-bs-parent="#sidebar-nav"
            >
              <li>
                <a href="./ProductsForm">
                  <i className="bi bi-circle"></i>
                  <span>Category</span>
                </a>
              </li>
              <li>
              <a href="./SubCategory">
                  <i className="bi bi-circle"></i>
                  <span>SubCategory</span>
                </a>
              </li>
              <li>
              <a href="./Brand">
                  <i className="bi bi-circle"></i>
                  <span>Brand</span>
                </a>
              </li>
              <li>
              <a href="./allproduct">
                  <i className="bi bi-circle"></i>
                  <span>All Product</span>
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="./voucher"
            >
              <i className="bi bi-people"></i>      
              <span>Voucher</span>
              
            </a>
            
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#tables-nav"
              data-bs-toggle="collapse"
              href="#"
            >
              <i className="bi bi-layout-text-window-reverse"></i>
              <span>Orders</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="tables-nav"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <a href="./admin/orders">
                  <i className="bi bi-circle"></i>
                  <span>Orders</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-circle"></i>
                  <span>Data Tables</span>
                </a>
              </li>
            </ul>
          </li>

          <li className="nav-item">
          <Link className="nav-link collapsed" to="/blog">
            <i className="bi bi-substack"></i>
            <span>Blog</span>
          </Link>
        </li>

        




          <li className="nav-item">

          </li>
          <li className="nav-heading">Pages</li>
          
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
            >
              <i class="bi bi-facebook"></i>
              <span>Facebook</span>             
            </a>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
            >
              <i class="bi bi-instagram"></i>
              <span>Instagram</span>             
            </a>
          </li>
        </ul>
    </aside>
  );
}

export default SideBar;
