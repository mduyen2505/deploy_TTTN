import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Pages/Home/Home';
import Header from './Components/Header/Header';
import LoginPage from './Pages/auth/Login';
import SubCategoryPage from './Pages/SubCategory/SubCategory';
import Promo from './Pages/Promotion/Promotion';
import MenuPage from './Pages/Menu/MenuPage';
import CategoryPage from './Pages/Category/CategoryPage';
import ProductsbyBrand from './Pages/ProductsbyBrand/ProductsbyBrand';
import ProductDetail from './Pages/ProductDetail/ProductDetail';
import SignUpPage from './Pages/Register/register';
import CartPage from './Pages/Cart/CartPage';
import WishlistPage from './Pages/Wishlist/WishlistPage';
import OrderPage from './Pages/Order/OrderPage';
import AccountPage from './Pages/Account/AccountPage';
import OrderAccount from './Pages/OrderAccount/OrderAccount';
import OrderDetail from './Pages/OrderDetailAccount/OrderDetailAccount';
import OrderPending from './Pages/OrderPending/OrderPending ';
import OrderConfirmed from './Pages/OrderConfirmed/OrderConfirmed';
import Ordershipped from './Pages/OrderShipped/OrderShipped';
import OrderCancelled from './Pages/OrderCancelled/OrderCancelled';
import OrderDelivered from './Pages/OrderDelivered/OrderDelivered';
import BlogDetail  from './Components/Blog/BlogDetail';
import OtpVerify from './Pages/Register/OtpVerify';
import Chatbox from './Components/Chatbox/Chatbox'; 
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Header /><Home /></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/subcategory/:subCategoryId" element={<SubCategoryPage />} />
        <Route path="/promo" element={<Promo />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/category/:typeId" element={<CategoryPage />} />
        <Route path="/brand/:brandId" element={<ProductsbyBrand />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />  
        <Route path="/order" element={<OrderPage />} />  
        <Route path="/account" element={<AccountPage />} />  
        <Route path="/orderslist" element={<OrderAccount />} /> {/* ✅ Thêm route mới */}
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/orders/pending" element={<OrderPending />} />
        <Route path="/orders/confirmed" element={<OrderConfirmed />} />
        <Route path="/orders/shipped" element={<Ordershipped/>} />
        <Route path="/orders/delivered" element={<OrderDelivered/>} />
        <Route path="/orders/cancelled" element={<OrderCancelled/>} />      
         <Route path="/blog/:id" element={<BlogDetail />} />
         <Route path="/verify-otp" element={<OtpVerify />} /> {/* ✅ Thêm route này */}



       




 




      </Routes>
    </BrowserRouter>
    <Chatbox />
    </>
  );
}

export default App;