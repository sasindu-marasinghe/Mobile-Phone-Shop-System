import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { USER_ROLES } from "../../constants/roles";
import CustomNavbar from "../../components/CustomNavbar";
import CustomFooter from "../../components/CustomFooter";
import PromoEventListing from "../promo_event_listing";
import { Link } from "react-router-dom";

const Home = () => {
  const { user, isAuthenticated } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));
  //
  return (
    <>
      <CustomNavbar />
      <div className="container">
        {isAuthenticated ? (
          <PromoEventListing />
        ) : (
          // height 200px
          <div
            className="d-flex flex-column justify-content-center align-items-center gap-3"
            style={{ height: "400px" }}
          >
            <h1 className="text-center">Welcome to Tech Connect Store</h1>
            <h5 className="text-center">
              Please login to view the promotions and events
            </h5>
            {/* login button */}
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        )}
      </div>
      <CustomFooter />
    </>
  );
};

export default Home;
