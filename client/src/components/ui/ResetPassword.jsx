import React, { useState } from 'react';
import axios from "axios";
import { toast } from "react-hot-toast";
import ResetpasswordPopup from "./ResetpasswordPopup";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;


function InputField({ label, id, value, onChange, disabled, type = "text" }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-gray-600">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-black focus:border-black bg-white text-sm ${isPasswordType ? 'pr-10' : ''}`}
          disabled={disabled}
          autoComplete={isPasswordType ? "new-password" : "off"}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}


function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ... showToast, performPasswordReset, handleSubmit, handleConfirmReset, handleCloseModal ...
  const showToast = (type, title, description) => {
    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full ${bgColor} shadow-lg rounded-lg pointer-events-auto flex p-3`}
        >
          <div className="flex items-start w-full">
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-white opacity-90">{description}</p>
            </div>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  const performPasswordReset = async () => {
    setLoading(true);
    setApiError("");
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/member/reset-password`,
        { currentPassword, newPassword, confirmNewPassword }
      );
      if (response.data?.message) {
        showToast("success", "Password Updated", response.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setApiError("");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to update password. Please try again.";
      setApiError(errorMessage);
      showToast("error", "Update Failed", errorMessage);
      console.error("Error updating password:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setApiError("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setApiError("New passwords do not match.");
      return;
    }

    setIsModalOpen(true);
  };


  const handleConfirmReset = () => {
    setIsModalOpen(false);
    performPasswordReset();
  };


  const handleCloseModal = () => {
    if (!loading) {
        setIsModalOpen(false);
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-sm flex flex-col gap-5">
        <InputField
          label="Current password"
          id="currentPassword"
          type="password" // Specify type
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={loading}
        />
        <InputField
          label="New password"
          id="newPassword"
          type="password" // Specify type
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />
        <InputField
          label="Confirm new password"
          id="confirmNewPassword"
          type="password" // Specify type
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          disabled={loading}
        />

        {apiError && <p className="text-red-500 text-xs -mt-2">{apiError}</p>}

        <div className="flex mt-3">
          <button
            type="submit"
            className={`bg-black text-white text-sm py-2 px-5 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            Reset password
          </button>
        </div>
      </form>

      <ResetpasswordPopup
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmReset}
        loading={loading}
      />
    </>
  );
}

export default ResetPassword;