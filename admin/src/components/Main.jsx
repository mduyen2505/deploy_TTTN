import React, { useState } from 'react';
import './main.css';
import PageTitle from './PageTitle';
import Dashboard from './Dashboard';
import Customers from '../Pages/User/Customers';
import ProductsForm from '../Pages/Category/ProductsForm';

function Main() {
  const [currentPage, setCurrentPage] = useState('Dashboard'); // Quản lý trang hiện tại

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Customers':
        return <Customers />;
      case 'ProductsForm':
        return <ProductsForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main id="main" className="main">
      <PageTitle page={currentPage} />
      <nav>
        <button onClick={() => setCurrentPage('Dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentPage('Customers')}>Customers</button>
        <button onClick={() => setCurrentPage('ProductsForm')}>Products Form</button>
      </nav>
      {renderPage()}
    </main>
  );
}


export default Main;
