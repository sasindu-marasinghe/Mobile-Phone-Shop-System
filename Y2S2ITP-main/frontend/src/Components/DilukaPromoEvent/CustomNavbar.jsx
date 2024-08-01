import React from "react";
import logo from "../assets/logo.webp";
import { FaHeart } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaTruck } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { USER_ROLES } from "../constants/roles";
import { usePromoEventStore } from "../store/usePromoEventStore";

const CustomNavbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
    isAuthenticated: state.isAuthenticated,
  }));
  //
  const { searchQuery, setSearchQuery } = usePromoEventStore((state) => ({
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
  }));
  //
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  //
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  //
  return (
    // flex between bootstrap bottom shadow
    <div
      className="d-flex justify-content-between border-bottom border-2"
      style={{ borderColor: "#3561A7", backgroundColor: "#1E447C" }}
    >
      <div className="d-flex" style={{ backgroundColor: "#1E447C" }}>
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            style={{ height: "150px", width: "150px" }}
          />
        </Link>
        <div className="d-flex flex-column justify-content-end p-3">
          {/* text decoration none */}
          <div className="d-flex gap-5 mb-3">
            <Link
              to="/"
              style={{ color: "#FFA534" }}
              className="text-decoration-none"
            >
              Home
            </Link>
            <Link
              to="/mobile-phones"
              style={{ color: "#FFA534" }}
              className="text-decoration-none"
            >
              Mobile Phones
            </Link>
            <Link
              to="/accessories"
              style={{ color: "#FFA534" }}
              className="text-decoration-none"
            >
              Accessories
            </Link>
            <Link
              to="/repair-services"
              style={{ color: "#FFA534" }}
              className="text-decoration-none"
            >
              Repair Services
            </Link>
          </div>
          <div className="d-flex gap-2 bg-white rounded-pill p-1">
            <IoSearch
              size={20}
              className="mt-1 mx-1"
              style={{ color: "#1E447C" }}
            />
            <input
              type="text"
              className="w-100 rounded-pill border-0"
              style={{ outline: "none" }}
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      <div
        className="d-flex flex-column justify-content-between p-3"
        style={{ backgroundColor: "#1E447C" }}
      >
        <div className="d-flex gap-5 justify-content-end">
          <div className="d-flex gap-2">
            <FaMapLocationDot
              size={20}
              className="mt-1"
              style={{ color: "#AED6F1" }}
            />
            <Link
              to="/store-locator"
              style={{ color: "#FFA534" }}
              className="text-decoration-none"
            >
              Store Locator
            </Link>
          </div>

          <div className="d-flex gap-2">
            <FaTruck size={20} className="mt-1" style={{ color: "#AED6F1" }} />
            <Link
              to="/track-order"
              style={{ color: "#FFA534" }}
              className="text-decoration-none"
            >
              Track Order
            </Link>
          </div>
          <div className="d-flex gap-2">
            <img
              src={
                user
                  ? user.profilePic
                  : `https://api.dicebear.com/8.x/micah/svg?seed=${user?.name}&flip=true&backgroundType=gradientLinear&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`
              }
              alt="User Avatar"
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                borderColor: "#FFA534",
                border: "2px solid",
              }}
            />
            {user && user?.role === USER_ROLES.PE_MANAGER ? (
              <>
                {/* dashboard link */}
                <Link
                  to="/pe-manager"
                  style={{ color: "#FFA534" }}
                  className="text-decoration-none"
                >
                  Dashboard
                </Link>
                <p
                  style={{ color: "#FFA534", cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </>
            ) : // check if user is authenticated
            (user && user?.role === USER_ROLES.EA_MANAGER) ||
              user?.role === USER_ROLES.CUSTOMER ? (
              <p
                style={{ color: "#FFA534", cursor: "pointer" }}
                onClick={handleLogout}
              >
                Logout
              </p>
            ) : (
              <>
                <Link
                  to="/register"
                  style={{ color: "#FFA534" }}
                  className="text-decoration-none"
                >
                  Register
                </Link>
                <p style={{ color: "#FFA534" }}>OR</p>
                <Link
                  to="/login"
                  style={{ color: "#FFA534" }}
                  className="text-decoration-none"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div
          className="d-flex gap-5 justify-content-end"
          style={{ position: "relative" }}
        >
          <FaHeart size={40} style={{ color: "#FFA534" }} />
          <img
            src={
              user
                ? user.profilePic
                : `https://api.dicebear.com/8.x/micah/svg?seed=${user?.name}&flip=true&backgroundType=gradientLinear&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`
            }
            alt="User Avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              borderColor: "#FFA534",
              border: "2px solid",
            }}
          />
          <div style={{ position: "relative" }}>
            <FaCartPlus size={40} style={{ color: "#FFA534" }} />
            {/* Badge for item count */}
            <span
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "12px",
                border: "2px solid #1E447C", // Match navbar bg for contrast
              }}
            >
              0 {/* Variable holding the number of items */}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomNavbar;
