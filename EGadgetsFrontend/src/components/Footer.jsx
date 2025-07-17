import React from 'react';
import footerLogo from "../assets/wh-logo.png";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer id="footer" className="bg-blue-400 text-white px-6 py-12">
      {/* Top Grid Section */}
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left Side - Logo + Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src={footerLogo} alt="EGadget Logo" className="w-56 mb-4" />

          <p className="text-base text-white mb-4 max-w-md">
            EGadget is Nepal’s trusted platform for buying smartphones discover the latest models at unbeatable prices.
          </p>
        </div>

        {/* Right Side - Sections */}
        <div className="grid sm:grid-cols-3 gap-6 text-left">
          {/* Services Section */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Services</h3>
            <ul className="space-y-1 text-sm">
              <li>Phone Comparison</li>
              <li>Exchange Offers</li>
              <li>Warranty & Support</li>
              <li>Free Delivery</li>
            </ul>
          </div>

          {/* About Us Section */}
          <div>
            <h3 className="text-xl font-semibold mb-2">About Us</h3>
            <ul className="space-y-1 text-sm">
              <li>Our Story</li>
              <li>Careers</li>
              <li>Media & Press</li>
              <li>Customer Reviews</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <ul className="space-y-1 text-sm">
              <li>Email: info@egadget.com</li>
              <li>Phone: +977-9812345678</li>
              <li>Location: Bhaktapur, Nepal</li>
              <li>Hours: 9:00 AM – 6:00 PM</li>
            </ul>
          </div>

          {/* Social Icons Under All Sections */}
          <div className="col-span-full mt-6 flex justify-center md:justify-start gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transform hover:scale-110 transition-transform duration-300"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transform hover:scale-110 transition-transform duration-300"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transform hover:scale-110 transition-transform duration-300"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white-600 mt-12 pt-6 container mx-auto text-center text-sm text-gray-200">
        © {new Date().getFullYear()} EGadget. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
