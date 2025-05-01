import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster, toast } from 'react-hot-toast';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function EditArticle({ id, onDone }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category_id: '',
    image: '',
    status_id: 2,
  });
  
  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const article = response.data.post;
      
      setFormData({
        title: article.title,
        content: article.content,
        category_id: article.category_id?.toString(),
        image: article.image || '',
        description: article.description || '',
        status_id: article.status_id,
      });
      
      console.log('Form data after fetch:', {
        status_id: article.status_id,
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      showToast('error', 'Error', 'Failed to load article');
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('error', 'Error', 'Failed to load categories');
    } finally {
      setIsLoading(false);
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
  
  useEffect(() => {
    if (id) {
      fetchArticle();
      fetchCategories();
    }
  }, [id]);
  
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
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    
    if (!allowedTypes.includes(file.type)) {
      showToast('error', 'Error', 'Only JPG, PNG, GIF and WebP files are allowed');
      return;
    }
    
    if (file.size > maxSize) {
      showToast('error', 'Error', 'Image size should be less than 5MB');
      return;
    }
    
    setImageUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setFormData(prev => ({
        ...prev,
        image: response.data.imageUrl
      }));
      
      showToast('success', 'Success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('error', 'Error', 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };
  
  const handleSubmit = async (status) => {
    const statusId = status === 'publish' ? 2 : 1;
    
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const postData = {
        ...formData,
        status_id: statusId
      };
      
      await axios.put(
        `${API_BASE_URL}/api/posts/${id}`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      showToast('success', 'Success', status === 'publish' ? 'Article published successfully' : 'Article saved as draft');
      
      setTimeout(() => {
        if (onDone) {
          onDone();
        }
      }, 1500);
      
    } catch (error) {
      console.error('Error updating article:', error.response?.data || error);
      showToast('error', 'Error', 'Failed to update article');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    if (onDone) {
      onDone();
    }
  };
  
  return (
    <div className="flex-1 p-8 md:p-12 bg-stone-50 relative min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit article</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={isSaving}
            className="bg-white hover:bg-gray-50"
          >
            {isSaving && formData.status_id === 2 ? 'Saving...' : 'Save as draft'}
          </Button>
          <Button
            onClick={() => handleSubmit('publish')}
            disabled={isSaving}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            {isSaving && formData.status_id === 1 ? 'Publishing...' : 'Save and publish'}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="mt-2 text-gray-500">Loading article...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl">
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
                    src={formData.image} 
                    alt="Article thumbnail" 
                    className="h-full w-full object-contain"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-white"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {imageUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
                      <p className="text-gray-500">Uploading image...</p>
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

export default EditArticle;
