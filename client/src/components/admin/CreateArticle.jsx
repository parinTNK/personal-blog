import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster, toast } from 'react-hot-toast';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import { uploadImage } from '@/utils/imageUpload';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function CreateArticle({ onDone }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category_id: '',
    image: '',
    status_id: 2,
  });

  const [userData, setUserData] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('error', 'Error', 'Failed to load categories');
    }
  };

  const showToast = (type, title, message) => {
    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full ${bgColor} shadow-lg rounded-lg pointer-events-auto flex p-3`}
      >
        <div className="flex items-start w-full">
          <div className="ml-3 flex-1">
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="mt-1 text-sm text-white opacity-90">{message}</p>
          </div>
        </div>
      </div>
    ), { position: 'bottom-right' });
  };

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        showToast('error', 'Error', 'You must be logged in to create an article');
        if (onDone) {
          onDone();
        }
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUserData(response.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      showToast('error', 'Error', 'Failed to load user profile');

      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      await fetchCategories();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // แสดงตัวอย่างรูปภาพก่อนอัปโหลด
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, previewImage: reader.result }));
    };
    reader.readAsDataURL(file);
    
    setImageUploading(true);
    setUploadProgress(0);
    
    try {
      // ใช้ฟังก์ชัน uploadImage ที่สร้างไว้
      const result = await uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });
      
      // เก็บ URL รูปภาพใน state
      setFormData(prev => ({
        ...prev,
        image: result.imageUrl
      }));
      
      showToast('success', 'Success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('error', 'Error', error.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

const handleSubmit = async (status) => {
  // ตรวจสอบข้อมูลที่จำเป็นก่อนส่ง
  if (!formData.title) {
    showToast('error', 'Error', 'Title is required');
    return;
  }
  
  if (!formData.category_id) {
    showToast('error', 'Error', 'Category is required');
    return;
  }
  
  if (!formData.content) {
    showToast('error', 'Error', 'Content is required');
    return;
  }
  
  const statusId = status === 'publish' ? 2 : 1;
  
  setIsSaving(true);
  
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      showToast('error', 'Error', 'You must be logged in to create an article');
      return;
    }
    
    // ข้อมูลที่จะส่งไปยัง API
    const postData = {
      title: formData.title,
      content: formData.content,
      category_id: formData.category_id,
      description: formData.description,
      status_id: statusId,
      image: formData.image // ใช้ URL รูปภาพที่อัพโหลดไว้แล้ว
    };
    
    console.log('Sending post data to API:', postData);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/posts`,
      postData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('API response:', response.data);
    
    showToast('success', 'Success', status === 'publish' ? 'Article published successfully' : 'Article saved as draft');
    
    // รอสักครู่ก่อนไปหน้าอื่น
    setTimeout(() => {
      if (onDone) {
        onDone();
      }
    }, 1500);
    
  } catch (error) {
    console.error('Error creating article:', error.response?.data || error);
    showToast('error', 'Error', error.response?.data?.error || 'Failed to create article');
  } finally {
    setIsSaving(false);
  }
};

  const handleGoBack = () => {
    if (onDone) {
      onDone();
    }
  };

  return (
    <div className="flex-1 p-8 md:p-12 bg-stone-50 relative min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Create article</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author name
            </label>
            <Input
              type="text"
              value={userData?.name || 'Loading...'}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail image
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center"
              style={{ height: '240px' }}
            >
              {formData.image ? (
                <div className="h-full w-full relative">
                  <img 
                    src={formData.previewImage || formData.image} 
                    alt="Article thumbnail" 
                    className="h-full w-full object-contain"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-white"
                    disabled={imageUploading}
                  >
                    {imageUploading ? 'Uploading...' : 'Change'}
                  </Button>
                  
                  {/* แสดงความคืบหน้า */}
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                      <p className="text-white">{uploadProgress}% Uploaded</p>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {imageUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
                      <p className="text-gray-500">Uploading image... {uploadProgress}%</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">Click to upload thumbnail image</p>
                      <p className="text-gray-400 text-sm mt-1">JPG, PNG, GIF, WebP up to 5MB</p>
                    </>
                  )}
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden"
                accept="image/jpeg,image/png,image/gif,image/webp"
                disabled={imageUploading}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select 
              value={formData.category_id}
              onValueChange={(value) => handleSelectChange('category_id', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              type="text"
              name="title"
              placeholder="Article title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Introduction (max 120 letters)
            </label>
            <Textarea
              name="description"
              placeholder="Introduction"
              value={formData.description}
              onChange={handleInputChange}
              className="h-24"
              maxLength={120}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/120 characters
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <Textarea
              name="content"
              placeholder="Content"
              value={formData.content}
              onChange={handleInputChange}
              className="h-64"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={isSaving}
            >
              {isSaving && formData.status_id === 2 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save as draft
                </>
              )}
            </Button>
            <Button
              onClick={() => handleSubmit('publish')}
              className="bg-gray-900 text-white hover:bg-gray-700"
              disabled={isSaving}
            >
              {isSaving && formData.status_id === 1 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Save and publish'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateArticle;
