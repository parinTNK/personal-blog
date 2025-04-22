import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SignupSuccess from "../components/ui/SingupSuccess.jsx";

// ดึง URL จาก environment variables
const API_BASE_URL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (!formData.username) {
      errors.username = "Username is required";
    }
    if (!validateEmail(formData.email)) {
      errors.email = "Email must be a valid email";
    }
    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    const clientErrors = validateForm();

    let apiFieldErrors = {};
    let generalApiError = "";

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        formData
      );
      setSuccess(response.data.message);
      setFormData({ username: "", email: "", password: "", name: "" });
      setFormErrors({});
      return;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Registration failed. Please try again.";
      const status = err.response?.status;

      if (status === 400) {
        if (errorMessage.toLowerCase().includes("email already exists")) {
          apiFieldErrors.email =
            "Email is already taken, Please try another email.";
        }
        if (errorMessage.toLowerCase().includes("username already exists")) {
          apiFieldErrors.username =
            "Username is already taken, Please try another one.";
        }
        if (Object.keys(apiFieldErrors).length === 0) {
          generalApiError = errorMessage;
        }
      } else {
        generalApiError = errorMessage;
      }
    }

    const combinedErrors = { ...clientErrors, ...apiFieldErrors };
    setFormErrors(combinedErrors);

    if (generalApiError) {
      setApiError(generalApiError);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-grow items-center justify-center py-12 px-4 sm:px-6 lg:px-120 flex-col">
        {success ? (
          <SignupSuccess />
        ) : (
          <div className="w-full space-y-6 md:p-20 px-8 py-10 rounded-xl bg-gray-100 md:mt-20">
            <div>
              <h2 className="text-center text-5xl font-bold tracking-tight text-gray-900">
                Sign up
              </h2>
            </div>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {apiError && (
                <div className="text-red-600 text-sm text-center p-2 bg-red-100 rounded">
                  {apiError}
                </div>
              )}
              {success && (
                <div className="text-green-600 text-sm text-center p-2 bg-green-100 rounded">
                  {success}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`block w-full rounded-md bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                    formErrors.name
                      ? "border border-red-500 ring-1 ring-red-500"
                      : ""
                  }`}
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!!success}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={`block w-full rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                    formErrors.username
                      ? "border border-red-500 ring-1 ring-red-500"
                      : ""
                  }`}
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!!success}
                />
                {formErrors.username && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.username}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                    formErrors.email
                      ? "border border-red-500 ring-1 ring-red-500"
                      : ""
                  }`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!!success}
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`block w-full rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                    formErrors.password
                      ? "border border-red-500 ring-1 ring-red-500"
                      : ""
                  }`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={!!success}
                />
                {formErrors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="flex w-40 justify-center rounded-full border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  disabled={!!success}
                >
                  Sign up
                </button>
              </div>
            </form>
            <div className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-black hover:text-gray-700 underline"
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Register;
