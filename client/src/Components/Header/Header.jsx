import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import Search from './Search/Search';
import Location from './Location/Location';
import { FiUser } from 'react-icons/fi';
import { IoBagOutline } from 'react-icons/io5';
import Button from '@mui/material/Button';
import './Style.css';
import Navigation from './Navigation/Navigation';
import { ClickAwayListener } from '@mui/material';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import axios from "axios";
import { GET_CART } from "../../config/ApiConfig";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [cartQuantity, setCartQuantity] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        checkLoginStatus();
        if (localStorage.getItem("token")) {
            fetchCartQuantity();
        }

        // ✅ Theo dõi thay đổi trong localStorage
        const handleStorageChange = () => {
            checkLoginStatus();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };

    }, []);
    const checkLoginStatus = () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setUsername(parsedUser.username);
        } else {
            setIsLoggedIn(false);
            setUsername("");
        }
    };

    const fetchCartQuantity = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const response = await axios.get(GET_CART, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && response.data.products.length > 0) {
                const totalQuantity = response.data.products.reduce(
                    (sum, product) => sum + product.quantity, 
                    0
                );
                setCartQuantity(totalQuantity);
            } else {
                setCartQuantity(0);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API giỏ hàng:", error);
            setCartQuantity(0);
        }
    };

    const handleUserClick = () => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            setIsDropdownOpen((prev) => !prev);
        }
    };
    const handleWishlistClick = () => {
        if (isLoggedIn) {
            navigate('/wishlist'); 
        } else {
            alert("Vui lòng đăng nhập để xem danh sách yêu thích!");
            navigate('/login');
        }
    };
    

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem("wishlist");
        setIsLoggedIn(false);
        setUsername("");
        setCartQuantity(0);
        navigate("/");
        window.dispatchEvent(new Event("storage"));
    };

    const handleCartClick = () => {
        if (isLoggedIn) {
            navigate('/cart'); 
        } else {
            alert("Vui lòng đăng nhập để xem giỏ hàng!");
            navigate('/login');
        }
    };
    const handleMyAccount = () => {
        if (isLoggedIn) {
            navigate('/account'); 
        } else {
            alert("Vui lòng đăng nhập để xem danh sách yêu thích!");
            navigate('/login');
        }
    };

    return (
        <>
            <div className="headerWrapper">
                <div className="top-strip bg-pink">
                    <div className="container">
                        <p className="mb-0 mt-0 text-center">Black Friday sale 50%</p>
                    </div>
                </div>
            </div>

            <header className="header">
                <div className="container d-flex align-items-center">
                    {/* Logo */}
                    <div className="logoWrapper col-sm-2">
                        <Link to="/">
                            <img src={Logo} alt="Logo" />
                        </Link>
                    </div>
                    
                    {/* Search and Location */}
                    <div className="col-sm-10 d-flex align-items-center part2">
                        <Search />
                        <Location />
                    </div>

                    {/* User and Cart */}
                    <div className="part3 d-flex align-items-center">
                        <ClickAwayListener onClickAway={() => setIsDropdownOpen(false)}>
                            <div className="userDropdown">
                                <Button className="circle" onClick={handleUserClick}>
                                    <FiUser />
                                </Button>
                                <div className="greeting">
                                {isLoggedIn ? (
    <span>Xin chào, {username}</span>
) : (
    <Link to="/login" className="login-link">Đăng nhập</Link>
)}

                                </div>

                                {isLoggedIn && isDropdownOpen && (
                                    <ul className="dropdownMenu">
                                        <li><Button onClick={handleMyAccount} ><Person2OutlinedIcon /> My Account</Button></li>
                                        <li><Button><RoomOutlinedIcon /> Order Tracking</Button></li>
                                        <li><Button onClick={handleWishlistClick}><FavoriteBorderOutlinedIcon /> My Wishlist</Button></li>
                                        <li><Button><SettingsOutlinedIcon /> Setting</Button></li>
                                        <li><Button onClick={handleLogout}><LogoutOutlinedIcon /> Sign Out</Button></li>
                                    </ul>
                                )}
                            </div>
                        </ClickAwayListener>

                        {/* Cart Tab */}
                        <div className="cartTab">
                            <Button className="circle" onClick={handleCartClick}>
                                <IoBagOutline />
                            </Button>
                            <span className="count d-flex align-items-center justify-content-center">
                                {cartQuantity}
                            </span>
                            <div className="cart-text">Giỏ hàng</div>
                        </div>
                    </div>
                </div>
            </header>
            <Navigation />
        </>
    );
};

export default Header;
