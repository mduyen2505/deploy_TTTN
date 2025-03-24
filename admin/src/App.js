// import Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';

// import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './App.css';
import Header from './components/Header';
import SideBar from './components/SideBar';
import Main from './components/Main';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Customers from "./Pages/User/Customers"

import React from "react";
import { Routes, Route } from 'react-router-dom';
import ProductsForm from './Pages/Category/ProductsForm';
import SubCategory from './Pages/SubCategory/Subcategory';
import AllProduct from './Pages/AllProduct/AllProduct';
import Brand from './Pages/Brand/Brand';
// import Order from './components/Order';
import OrdersPage from './Pages/OrdersPage/OrdersPage';
import Voucher from './Pages/Voucher/Voucher';
import Blog from './Pages/BLog/Blog';


function App() {
    return (
            <>
                  <Header />
            <SideBar />
            <div className="content-wrapper">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/Customers" element={<Customers />} />
                    <Route path="/ProductsForm" element={<ProductsForm />} />
                    <Route path="/SubCategory" element={<SubCategory/>} />
                    <Route path="/AllProduct" element={<AllProduct/>} />
                    <Route path="/Brand" element={<Brand/>} />
                    <Route path="/admin/orders" element={<OrdersPage />} />
                    <Route path="/voucher" element={<Voucher/>} />
                    <Route path="/blog" element={<Blog/>} />





                    {/* <Route path="/Order" element={<Order />} /> */}
                </Routes>
            </div>
            <Footer />
            <BackToTop />
            </>    
    );
}

export default App;
