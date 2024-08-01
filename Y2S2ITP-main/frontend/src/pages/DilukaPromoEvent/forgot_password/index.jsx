import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthAPI from "../../api/AuthAPI";
import { errorMessage, successMessage } from "../../utils/Alert";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import CustomNavbar from "../../components/CustomNavbar";
import CustomFooter from "../../components/CustomFooter";

const index = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!email) {
      isValid = false;
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      errors.email = "Email is invalid";
    }

    setErrors(errors);
    return isValid;
  };

  const redirectToLogin = (res) => {
    navigate("/login");
  };

  const { mutate, isLoading } = useMutation(AuthAPI.forgotPassword, {
    onSuccess: (res) => {
      successMessage("Success", res.data.message, () => {
        redirectToLogin();
      });
    },
    onError: (err) => {
      errorMessage("Error", err.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutate(email);
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <h1 className="card-header text-center">Reset Password</h1>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Send Reset Link"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomFooter />
    </>
  );
};

export default index;
