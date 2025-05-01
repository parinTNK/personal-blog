import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/imageUpload';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function AdminProfile() {
  const { currentUser, loginUser, loading: userLoading } = useUser();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
      setBio(currentUser.bio || '');
      setProfilePic(currentUser.profile_pic || null);
    }
  }, [currentUser]);

  const showToast = (type, title, description) => {
    const bgColor = type === "success" ? "bg-green-500" : type === "info" ? "bg-blue-500" : "bg-red-500";
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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // แสดงตัวอย่างรูปภาพก่อนอัปโหลด
    const reader = new FileReader();
    reader.onloadend = () => { 
      setProfilePic(reader.result); 
    };
    reader.readAsDataURL(file);
    
    // อัปโหลดรูปภาพอัตโนมัติ
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });
      
      // บันทึกลงฐานข้อมูลทันที
      await updateProfilePic(result.imageUrl);
      showToast("success", "Success", "Profile picture updated successfully");
      
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast("error", "Error", error.message || "Failed to upload image");
      // กลับไปใช้รูปเดิมถ้าอัปโหลดไม่สำเร็จ
      setProfilePic(currentUser?.profile_pic || null);
    } finally {
      setIsUploading(false);
    }
  };
  
  const updateProfilePic = async (imageUrl) => {
    if (!currentUser || !currentUser.id) {
      showToast("error", "Error", "User data not available.");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("error", "Authentication Error", "Please log in again.");
        return;
      }
      
      // เรียกใช้ API อัพเดทรูปโปรไฟล์
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/users/${currentUser.id}`,
        { profile_pic: imageUrl },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          } 
        }
      );
      
      if (response.data?.user) {
        // อัพเดต state และ context
        setProfilePic(imageUrl);
        loginUser(response.data.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!currentUser || !currentUser.id) {
        showToast("error", "Error", "User data not available.");
        return;
    }
    setIsSaving(true);

    const isNameChanged = name !== (currentUser?.name || '');
    const isUsernameChanged = username !== (currentUser?.username || '');
    const isEmailChanged = email !== (currentUser?.email || '');
    const isBioChanged = bio !== (currentUser?.bio || '');

    if (!isNameChanged && !isUsernameChanged && !isEmailChanged && !isBioChanged) {
      showToast("info", "No Changes", "No changes detected to save.");
      setIsSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("error", "Authentication Error", "Please log in again.");
        setIsSaving(false);
        return;
      }

      const updatePayload = {};
      if (isNameChanged) updatePayload.name = name;
      if (isUsernameChanged) updatePayload.username = username;
      if (isEmailChanged) updatePayload.email = email;
      if (isBioChanged) updatePayload.bio = bio;

      const response = await axios.put(
        `${API_BASE_URL}/api/admin/users/${currentUser.id}`,
        updatePayload,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (response.data?.user) {
        showToast("success", "Profile Saved", "Your profile has been successfully updated.");
        loginUser(response.data.user);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to update profile. Please try again.";
      showToast("error", "Update Failed", errorMessage);
      console.error("Error updating profile via admin route:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (userLoading) {
    return <div className="flex-1 p-10">Loading...</div>;
  }

  return (
    <div className="flex-1 p-8 md:p-12 bg-stone-50 relative min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <Button
          onClick={handleSave}
          disabled={isSaving || isUploading}
          className="bg-gray-900 text-white hover:bg-gray-700 px-5"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative">
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <div className="loader w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              {uploadProgress > 0 && (
                <span className="text-white text-xs mt-1">{uploadProgress}%</span>
              )}
            </div>
          )}
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Pic</div>
          )}
        </div>
        <div>
          <input 
            type="file" 
            id="profilePicUpload" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="hidden" 
            disabled={isUploading}
          />
          <Button variant="outline" asChild disabled={isUploading}>
            <Label htmlFor="profilePicUpload" className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
              {isUploading ? 'Uploading...' : 'Upload profile picture'}
            </Label>
          </Button>
          <p className="text-xs text-gray-500 mt-1.5">PNG, JPG, GIF up to 5MB.</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSaving} />
        </div>
        <div>
          <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2 block">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isSaving} />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSaving} />
        </div>
        <div>
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700 mb-2 block">Bio (max 120 letters)</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={120}
            rows={5}
            disabled={isSaving}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-1.5 text-right">{bio.length}/120</p>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;