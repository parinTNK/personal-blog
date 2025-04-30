import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster, toast } from 'react-hot-toast';
import ResetpasswordPopup from '@/components/ui/ResetpasswordPopup';
import axios from 'axios';
// Import icons for show/hide password
import { Eye, EyeOff } from 'lucide-react'; // Ensure you have lucide-react installed

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function AdminResetPassword() {
  const { currentUser } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Add states to toggle password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleResetClick = () => {
    // Validate fields before showing popup
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    setPasswordError('');
    setShowConfirmPopup(true);
  };

  const handleCancelReset = () => {
    setShowConfirmPopup(false);
  };

  const handleConfirmReset = async () => {
    if (!currentUser?.id) {
      toast.error('User data not available');
      setShowConfirmPopup(false);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/admin/users/${currentUser.id}/reset-password`,
        { 
          currentPassword,
          newPassword
        },
        { 
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
          } 
        }
      );
      
      // Fixed: Removed extra closing div tag
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-green-500 shadow-lg rounded-lg pointer-events-auto flex p-3 `}
        >
          <div className="flex items-start w-full">
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white">Password Reset</p>
              <p className="mt-1 text-sm text-white opacity-90">
                Your password has been reset successfully.
              </p>
            </div>
          </div>
        </div>
      ), { position: 'bottom-right' });
      
      // Clear the form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to reset password';
      
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-red-500 shadow-lg rounded-lg pointer-events-auto flex p-3 ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex items-start w-full">
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white">Reset Failed</p>
              <p className="mt-1 text-sm text-white opacity-90">{errorMessage}</p>
            </div>
          </div>
        </div>
      ), { position: 'bottom-right' });
      
      setPasswordError(errorMessage);
      
    } finally {
      setIsLoading(false);
      setShowConfirmPopup(false);
    }
  };

  if (!currentUser) {
    return <div className="flex-1 p-10">Loading user data...</div>;
  }

  return (
    <div className="flex-1 p-8 md:p-12 bg-stone-50 relative min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />
      
      {/* Confirmation popup */}
      <ResetpasswordPopup
        isOpen={showConfirmPopup}
        onClose={handleCancelReset}
        onConfirm={handleConfirmReset}
        loading={isLoading}
      />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-semibold text-gray-900">Reset password</h1>
        <Button 
          onClick={handleResetClick}
          disabled={isLoading}
          className="bg-gray-900 text-white hover:bg-gray-700 px-5"
        >
          Reset password
        </Button>
      </div>
      
      {/* Password Form */}
      <div className="space-y-8 max-w-2xl">
        {/* Current Password */}
        <div>
          <Label htmlFor="current-password" className="text-sm font-medium text-gray-700 mb-2 block">
            Current password
          </Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              className={`pr-10 ${passwordError && passwordError.toLowerCase().includes('current') ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        {/* New Password */}
        <div>
          <Label htmlFor="new-password" className="text-sm font-medium text-gray-700 mb-2 block">
            New password
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              className={`pr-10 ${passwordError && passwordError.toLowerCase().includes('new') ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        {/* Confirm New Password */}
        <div>
          <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 mb-2 block">
            Confirm new password
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className={`pr-10 ${passwordError && passwordError.toLowerCase().includes('match') ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        {/* Error message */}
        {passwordError && (
          <p className="text-red-600 text-sm mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
            {passwordError}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminResetPassword;