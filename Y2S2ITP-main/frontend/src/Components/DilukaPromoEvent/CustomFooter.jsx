import React from "react";
import { GrLocation } from "react-icons/gr";
import { FiPhone } from "react-icons/fi";
import { SlEnvolope } from "react-icons/sl";
import { ImFacebook2 } from "react-icons/im";
import { FaSquareTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { ImGooglePlus2 } from "react-icons/im";

const CustomFooter = () => {
  return (
    <div
      className="d-flex flex-column justify-content-between border-top border-2"
      style={{ borderColor: "#3561A7", backgroundColor: "#1E447C" }}
    >
      <div
        className="d-flex justify-content-between p-3"
        style={{ color: "#FFA534" }}
      >
        <div>
          <h1 style={{ color: "#FFA534" }} className="mb-5">
            Tech-Connect
          </h1>
          {/* <p>Address</p> */}
          <p>
            <GrLocation size={20} className="mx-2" />
            <span>NO:43, Namaluwa Rd, Dekatana, Sri Lanka</span>
          </p>
          {/* <p>Phone</p> */}
          <p>
            <FiPhone size={20} className="mx-2" />
            <span>+94 757 717 569</span>
          </p>
          {/* <p>Email</p> */}
          <p>
            <SlEnvolope size={20} className="mx-2" />
            <span>techconnectstore@gmail.com</span>
          </p>
        </div>
        <div>
          {/* bold */}
          <p className="mb-5" style={{ fontWeight: "bold" }}>
            Quick Links
          </p>
          <p>Home</p>
          <p>Shop</p>
          <p>Categories</p>
          <p>My Account</p>
          <p>Cart</p>
        </div>
        <div>
          <p className="mb-5" style={{ fontWeight: "bold" }}>
            Customer Service
          </p>
          <p>Contact Us</p>
          <p>FAQs</p>
          <p>Shipping & Returns</p>
          <p>Privacy Policy</p>
          <p>Terms & Conditions</p>
        </div>
        <div className="mx-5">
          <p className="mb-5" style={{ fontWeight: "bold" }}>
            About Us
          </p>
          <p>Our Story</p>
          <p>Meet the Team</p>
          <p>Blog</p>
          <p>Careers</p>
        </div>
      </div>
      <hr
        className="mx-5"
        style={{ borderColor: "#000", borderWidth: "3px" }}
      />
      <div
        className="d-flex justify-content-between"
        style={{ color: "#FFA534" }}
      >
        <div className="d-flex flex-column flex-content-between p-3">
          <div className="d-flex gap-5 mb-2">
            {/* <p>facebook</p> */}
            <ImFacebook2 size={30} />
            {/* <p>twitter</p> */}
            <FaSquareTwitter size={30} />
            {/* <p>instagram</p> */}
            <FaInstagram size={30} />
            {/* <p>google+</p> */}
            <ImGooglePlus2 size={30} />
          </div>
          <div>
            <p>© 2021 Tech-Connect, All Rights Reserved</p>
          </div>
        </div>
        <button
          className="btn m-5"
          style={{ backgroundColor: "#FFA534", color: "#1E447C" }}
        >
          <SlEnvolope size={20} className="mx-2" />
          <span className="mx-2">Subscribe to our newsletter</span>
        </button>
      </div>
    </div>
  );
};

export default CustomFooter;
