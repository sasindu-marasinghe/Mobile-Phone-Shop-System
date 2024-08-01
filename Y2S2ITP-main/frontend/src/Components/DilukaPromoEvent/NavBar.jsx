import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import LOGO from "../assets/logo.webp";
import { USER_ROLES } from "../constants/roles";

const NavBar = () => {
  const { logout, user } = useAuthStore((state) => ({
    logout: state.logout,
    user: state.user,
  }));
  //
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: "#000" }}
    >
      {/* logo */}
      <a className="navbar-brand mx-3" href="/">
        <img
          src={LOGO}
          alt="Logo"
          style={{
            maxWidth: "100%",
            maxHeight: "45px",
            // padding: "5px",
            backgroundColor: "#fff",
          }}
          className="rounded"
        />
      </a>

      {/* vertical line using plain css */}
      <div
        className="d-none d-lg-block"
        style={{ borderLeft: "3px solid #fff", height: 40 }}
      ></div>

      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        {user && (
          <>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-3">
                <img
                  src={user?.profilePic}
                  alt="User Avatar"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "2px solid #fff",
                  }}
                />{" "}
              </li>

              <li className="nav-item mx-2 align-self-center">
                <a
                  className="btn btn-dark btn-outline-light"
                  href={user?.role === USER_ROLES.USER ? "/user" : "/"}
                >
                  Dashboard
                </a>
              </li>
              <li className="nav-item mx-2 align-self-center">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    logout();
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
