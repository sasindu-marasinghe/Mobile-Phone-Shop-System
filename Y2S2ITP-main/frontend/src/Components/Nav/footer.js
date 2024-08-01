import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-wrap justify-around">
          <div className="w-full sm:w-auto mb-8 sm:mb-0">
            <h3 className="text-2xl font-bold mb-4">Tech Connect</h3>
            <p>No:43, Namaluwa Rd, Dekatana, Sri Lanka</p>
            <p>+94 757 717 569</p>
            <p>techconnectstore@gmail.com</p>
          </div>
          <div className="w-full sm:w-auto mb-8 sm:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Meet the Team
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-auto mb-8 sm:mb-0">
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-auto mb-8 sm:mb-0">
            <h4 className="text-lg font-semibold mb-4">More</h4>
            <ul>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/giveFeedback" className="hover:text-gray-300">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-auto mb-8 sm:mb-0">
            <h4 className="text-lg font-semibold mb-4">
              Subscribe to Our Newsletter
            </h4>
            <form action="#" className="flex">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email address"
                className="px-4 py-2 rounded-l-lg focus:outline-none focus:ring focus:border-gray-500"
              />
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 rounded-r-lg hover:bg-gray-700 focus:outline-none focus:ring focus:border-gray-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="text-center py-4 bg-gray-800">
          <p>&copy; 2024 Tech-Connect, All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
