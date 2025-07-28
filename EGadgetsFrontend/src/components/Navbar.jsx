import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";

import avatarImg from "../assets/avatar.png";
import footerLogo from "../assets/EGadget_logo.png";

import { useState } from "react";
import { useSelector } from "react-redux";


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Get userId safely (assuming it's stored in localStorage)
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const navigation = [
    { name: "Profile", href: userId ? `/profile/${userId}` : "/login" },
    { name: "Orders", href: "/orders" },
    { name: "Cart Page", href: "/cart" },
    { name: "Check Out", href: "/checkout" },
  ];


  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const scrollToFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="bg-blue-400 max-w-screen-2xl mx-auto px-4 py-4 border-b shadow-md bg-white">
      <nav className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img src={footerLogo} alt="Logo" className="w-28 md:w-36" />
          </Link>
        </div>

        {/* Center Navigation Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-800 transition">Home</Link>
            <Link to="/browse" className="hover:text-blue-800 transition">Products</Link>
            <button
              onClick={scrollToFooter}
              className="flex items-center space-x-6 text-gray-700 font-medium hover:text-blue-800 transition">
              Contact Us
            </button>
          </div>
        </div>

        {/* Right Icons Section */}
        <div className="relative flex items-center space-x-3">
          <div>
            {token ? (
              <>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img
                    src={avatarImg}
                    alt="User Avatar"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full ring-2 ring-blue-500"
                  />
                </button>

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
              <Link to="/login">
                <HiOutlineUser className="text-2xl md:text-3xl" />
              </Link>
            )}
          </div>

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
