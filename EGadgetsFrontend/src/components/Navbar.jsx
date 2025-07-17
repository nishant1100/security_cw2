import { Link, useNavigate } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi";

import avatarImg from "../assets/avatar.png";
import { useState } from "react";
import { useSelector } from "react-redux";

import footerLogo from "../assets/EGadget_logo.png";

const navigation = [
    { name: "Dashboard", href: "/user-dashboard" },
    { name: "Orders", href: "/orders" },
    { name: "Cart Page", href: "/cart" },
    { name: "Check Out", href: "/checkout" },
];

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const handleLogOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="max-w-screen-2xl mx-auto px-4 py-4 border-b shadow-md bg-white">
            <nav className="flex justify-between items-center">
                {/* Left Side */}
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Logo */}
                    <Link to="/">
                        <img src={footerLogo} alt="Logo" className="w-28 md:w-36" />
                    </Link>

                    {/* Browse Button */}
                    <Link
                        to="/browse"
                        className="bg-primary py-1 px-4 flex items-center rounded-md text-black font-semibold hover:scale-105 transition-all duration-300 text-sm md:text-base"
                    >
                        Shop Now
                    </Link>
                </div>

                {/* Search Input */}
                <div className="relative w-28 sm:w-72">
                    <IoSearchOutline className="absolute left-3 top-2.5 text-gray-500 text-lg" />
                    <input
                        type="text"
                        placeholder="Search here"
                        className="bg-gray-200 w-full py-2 pl-10 pr-4 rounded-md focus:outline-none text-sm md:text-base"
                    />
                </div>

                {/* Right Side */}
                <div className="relative flex items-center space-x-3">
                    <div>
                        {token ? (
                            <>
                                {/* User Avatar and Dropdown */}
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <img
                                        src={avatarImg}
                                        alt="User Avatar"
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full ring-2 ring-blue-500"
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                                        <ul className="py-2">
                                            {navigation.map((item) => (
                                                <li key={item.name} onClick={() => setIsDropdownOpen(false)}>
                                                    <Link to={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                            <li>
                                                <button
                                                    onClick={handleLogOut}
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Show Login link when not logged in
                            <Link to="/login">
                                <HiOutlineUser className="text-2xl md:text-3xl" />
                            </Link>
                        )}
                    </div>

                    {/* Cart Button - Hidden on Small Screens */}
                    <Link
                        to="/cart"
                        className="hidden md:flex bg-primary py-1 px-4 items-center rounded-md font-semibold hover:scale-105 transition-all duration-300"
                    >
                        <HiOutlineShoppingCart className="text-lg md:text-xl" />
                        <span className="ml-1">{cartItems.length > 0 ? cartItems.length : 0}</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
