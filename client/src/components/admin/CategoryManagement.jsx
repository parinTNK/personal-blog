import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster, toast } from 'react-hot-toast';
import { Pencil, Trash2, X, Search } from 'lucide-react'; // เพิ่ม Search icon
import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  // เพิ่ม state สำหรับการค้นหา
  const [isSearching, setIsSearching] = useState(false);
  
  // ใช้ useRef สำหรับเก็บ timeout ID เพื่อทำ debounce
  const searchTimeout = useRef(null);

  // ฟังก์ชันค้นหาแบบ debounced
  const debouncedSearch = useCallback((value) => {
    // ถ้ามีการตั้งเวลาไว้แล้ว ให้ยกเลิกก่อน
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // ตั้งเวลาใหม่ เพื่อรอให้ผู้ใช้พิมพ์เสร็จ
    setIsSearching(true);
    searchTimeout.current = setTimeout(() => {
      setSearchTerm(value);
      setIsSearching(false);
    }, 300); // รอ 300ms
  }, []);
  
  // ฟังก์ชัน handle การพิมพ์ค้นหา
  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    // ถ้าค่าว่างเปล่า ให้เซ็ต searchTerm ทันทีโดยไม่ต้อง debounce
    if (!value.trim()) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      setSearchTerm('');
      setIsSearching(false);
      return;
    }
    
    // ถ้ามีค่า ให้ใช้ debounce
    debouncedSearch(value);
  };

  // Function definition BEFORE usage in useEffect
  const fetchCategories = async () => {
    setIsLoading(true);
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

  // Toast function declaration before its usage
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

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Show success message with auto-dismiss
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast('error', 'Error', 'Category name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/categories`,
        { name: newCategoryName.trim() },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Add the new category to state
      setCategories([...categories, response.data.category]);
      
      // Reset form and close modal
      setNewCategoryName('');
      setShowCreateModal(false);
      
      // แทนที่การใช้ successMessage ด้วยการใช้ toast
      showToast('success', 'Create category', 'Category has been successfully created.');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create category';
      showToast('error', 'Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (id, newName) => {
    if (!newName.trim()) {
      showToast('error', 'Error', 'Category name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/categories/${id}`,
        { name: newName.trim() },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the category in state
      setCategories(categories.map(cat => 
        cat.id === id ? response.data.category : cat
      ));
      
      // Exit edit mode
      setEditingCategory(null);
      
      // Show success message
      showToast('success', 'Success', 'Category updated successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update category';
      showToast('error', 'Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/categories/${categoryToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // Remove the category from state
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      
      // Show success message
      showToast('success', 'Success', 'Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      
      // ปรับปรุงการแสดงข้อความแจ้งเตือนข้อผิดพลาด
      let errorMessage = 'Failed to delete category';
      
      if (error.response) {
        if (error.response.status === 400 && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.status === 404) {
          errorMessage = "Category not found. It may have been deleted already.";
          fetchCategories();
        } else {
          errorMessage = error.response.data.error || errorMessage;
        }
      }
      
      showToast('error', 'Error', errorMessage);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  // Filter categories based on search term
  const filteredCategories = searchTerm
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  // ล้าง timeout เมื่อ component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <div className="flex-1 p-8 md:p-12 bg-stone-50 relative min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />
      
      {/* Header with Create button */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-semibold text-gray-900">Category management</h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          disabled={isLoading}
          className="bg-gray-900 text-white hover:bg-gray-700 flex items-center"
        >
          <span className="mr-1">+</span> Create category
        </Button>
      </div>
      
      {/* Search bar - ปรับปรุงให้มีไอคอนและแสดงสถานะค้นหา */}
      <div className="mb-8">
        <div className="relative max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search categories..."
            onChange={handleSearchChange}
            className="pl-10 pr-8" // เพิ่มพื้นที่สำหรับไอคอน
            disabled={isLoading}
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        {/* แสดงจำนวนผลการค้นหา เมื่อมีการค้นหา */}
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-2">
            Found {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
          </p>
        )}
      </div>
      
      {/* Categories list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-sm font-medium text-gray-500">Category</h2>
        </div>
        
        {/* List */}
        <div className="divide-y">
          {isLoading && <div className="p-4 text-center text-gray-500">Loading...</div>}
          
          {!isLoading && filteredCategories.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No categories found matching your search' : 'No categories yet'}
            </div>
          )}
          
          {filteredCategories.map(category => (
            <div key={category.id} className="px-6 py-4 flex items-center justify-between">
              {editingCategory?.id === category.id ? (
                <Input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateCategory(category.id, editingCategory.name);
                    } else if (e.key === 'Escape') {
                      setEditingCategory(null);
                    }
                  }}
                  autoFocus
                  className="max-w-xs"
                />
              ) : (
                <span className="text-gray-900">{category.name}</span>
              )}
              
              <div className="flex space-x-2">
                {editingCategory?.id === category.id ? (
                  <>
                    <Button 
                      onClick={() => handleUpdateCategory(category.id, editingCategory.name)}
                      disabled={isLoading}
                      className="bg-gray-900 text-white hover:bg-gray-700 h-8 w-8 p-0"
                    >
                      ✓
                    </Button>
                    <Button 
                      onClick={() => setEditingCategory(null)}
                      variant="outline" 
                      className="h-8 w-8 p-0"
                    >
                      ✕
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => setEditingCategory({id: category.id, name: category.name})}
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      onClick={() => openDeleteModal(category)}
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Create new category</h3>
            <Input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateCategory();
                }
              }}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setNewCategoryName('');
                  setShowCreateModal(false);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCategory}
                disabled={isLoading || !newCategoryName.trim()}
                className="bg-black text-white hover:bg-black-700"
              >
                {isLoading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4 text-center">Delete category</h3>
            <p className="text-center mb-6 text-gray-600">Do you want to delete this category?</p>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                disabled={isLoading}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteCategory}
                disabled={isLoading}
                className="bg-gray-900 text-white hover:bg-gray-800 px-6"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryManagement;