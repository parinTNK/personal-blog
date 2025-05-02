import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function ProfileEdit() {
  const { currentUser, loginUser } = useUser();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setName(currentUser.name || "");
    }
  }, [currentUser]);

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
      { duration: 3000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");

    if (username === currentUser?.username && name === currentUser?.name) {
      showToast("error", "Your Profile", "No changes detected.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("error", "Authentication Required", "Please log in again.");
        setLoading(false);
        return;
      }

      const dataToUpdate = {};
      if (name !== currentUser?.name) dataToUpdate.name = name;
      if (username !== currentUser?.username) dataToUpdate.username = username;

      const response = await axios.put(`${API_BASE_URL}/api/member/edit`, dataToUpdate);

      if (response.data?.user) {
        showToast("success", "Saved Profile", "Your profile has been successfully updated.");
        loginUser(response.data.user);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to update profile. Please try again.";
      setApiError(errorMessage);

      const toastTitle = errorMessage.toLowerCase().includes("username already exists")
        ? "Username Taken"
        : "Update Failed";
      const toastDescription = errorMessage.toLowerCase().includes("username already exists")
        ? "This username is already in use. Please choose another one."
        : errorMessage;

      showToast("error", toastTitle, toastDescription);
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col gap-8">
      <div className="flex md:flex-row flex-col pb-8 border-b border-gray-300 w-full gap-8 items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
          {currentUser?.profile_pic ? (
            <img
              src={currentUser.profile_pic}
              alt={`${currentUser.username || "User"}'s profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-sm">No Pic</span>
          )}
        </div>
        {/* //TODO Update clound photo */}
        <button
          type="button"
          className="bg-white border border-gray-400 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-50 text-sm"
        >
          Update profile picture
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-row-2 gap-6 w-full">
        <InputField
          label="Username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <InputField
          label="Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-500">
            Email
          </label>
          <p className="text-gray-500 break-words">{currentUser?.email}</p>
        </div>
      </div>

      {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}

      <div className="flex mt-2">
        <button
          type="submit"
          className={`bg-black text-white py-2 px-6 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function InputField({ label, id, value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        disabled={disabled}
      />
    </div>
  );
}

export default ProfileEdit;
