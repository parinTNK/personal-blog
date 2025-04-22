import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster, toast } from 'react-hot-toast';
import { useUser } from "../context/UserContext";

// ดึง URL จาก environment variables
const API_BASE_URL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [apiError, setApiError] = useState("");
    const { loginUser } = useUser();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (apiError) {
            setApiError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        if (!formData.email || !formData.password) {
            toast.error("Please enter both email and password.");
            setApiError("Validation failed");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/login`, // ใช้ URL จาก env
                formData,
                { withCredentials: true } // เพื่อให้ browser รับ cookie จาก server
            );

            console.log("Login successful:", response.data.user);
            loginUser(response.data.user); // เมื่อ login สำเร็จ ให้ update user state
            navigate("/");

        } catch (err) { 
            const errorMessage = err.response?.data?.error || "Login failed. Please check your credentials.";
            setApiError(errorMessage);

            let toastTitle = "Login Failed";
            let toastDescription = "Please check your credentials and try again.";

            if (errorMessage.toLowerCase().includes('invalid credentials') || errorMessage.toLowerCase().includes('user not found') || errorMessage.toLowerCase().includes('password')) {
                toastTitle = "Your password is incorrect or this email doesn’t exist";
                toastDescription = "Please try another password or email";
            } else {
                toastTitle = "Login Error";
                toastDescription = errorMessage;
            }

            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-red-500 shadow-lg rounded-lg pointer-events-auto flex p-3 ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex items-start w-full">
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-semibold text-white">
                      {toastTitle}
                    </p>
                    <p className="mt-1 text-sm text-white opacity-90">
                      {toastDescription}
                    </p>
                  </div>
                </div>
              </div>
            ), {
            });
        }
    };

    return (
        <div className="">
            <Toaster position="bottom-right" />
            <Navbar />
            <div className="flex flex-grow items-center justify-center py-12 px-4 sm:px-6 lg:px-120">
                <div className="w-full space-y-6 md:p-20 px-8 py-10 rounded-xl bg-gray-100 md:mt-20">
                    <div>
                        <h2 className="text-center text-5xl font-bold tracking-tight text-gray-900">
                            Log in
                        </h2>
                    </div>
                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>

                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required

                                className={`block w-full rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${apiError.toLowerCase().includes('email') || apiError.toLowerCase().includes('user not found') || apiError.toLowerCase().includes('invalid credentials') ? 'border border-red-500 ring-1 ring-red-500' : ''
                                    }`}
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>


                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required

                                className={`block w-full rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${apiError.toLowerCase().includes('password') || apiError.toLowerCase().includes('invalid credentials') ? 'border border-red-500 ring-1 ring-red-500' : ''
                                    }`}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>


                        <div className="pt-4 flex justify-center">
                            <button
                                type="submit"
                                className="flex w-40 justify-center rounded-full border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Log in
                            </button>
                        </div>
                    </form>

                    <div className="text-sm text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-black hover:text-gray-700 underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;