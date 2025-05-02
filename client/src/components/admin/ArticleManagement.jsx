import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // ยังคงใช้ useNavigate แต่ลบ useSearchParams
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster, toast } from 'react-hot-toast';
import { Search, Edit2, Trash2, PlusCircle, ExternalLink } from 'lucide-react';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  
  // ลบ const [searchParams] = useSearchParams(); เพราะไม่ได้ใช้งาน
  
  // ใช้ useRef สำหรับเก็บ timeout ID เพื่อทำ debounce
  const searchTimeout = useRef(null);
  
  // ฟังก์ชันแสดง toast notification
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
  
  // ฟังก์ชันค้นหาแบบ debounced
  const debouncedSearch = useCallback((value) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    setIsSearching(true);
    searchTimeout.current = setTimeout(() => {
      setSearchTerm(value);
      
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(value.toLowerCase())
      );
      
      setFilteredArticles(filtered);
      setIsSearching(false);
    }, 300);
  }, [articles]);
  
  // ฟังก์ชัน handle การพิมพ์ค้นหา
  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    if (!value.trim()) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      setSearchTerm('');
      setFilteredArticles(articles);
      setIsSearching(false);
      return;
    }
    
    debouncedSearch(value);
  };
  
  // ฟังก์ชันนำทางไปหน้าสร้างบทความ (ใช้ query params แทนการเปลี่ยนเส้นทาง)
  const handleCreateArticle = () => {
    navigate('/admin?section=articles&action=create');
  };
  
  // ฟังก์ชันนำทางไปหน้าแก้ไขบทความ (ใช้ query params แทนการเปลี่ยนเส้นทาง)
  const handleEditArticle = (id) => {
    navigate(`/admin?section=articles&action=edit&articleId=${id}`);
  };
  
  // ฟังก์ชันลบบทความ
  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // อัปเดต state เพื่อลบบทความออกจากรายการ
      const updatedArticles = articles.filter(article => article.id !== id);
      setArticles(updatedArticles);
      setFilteredArticles(updatedArticles);
      
      showToast('success', 'Success', 'Article deleted successfully');
    } catch (error) {
      console.error('Error deleting article:', error);
      showToast('error', 'Error', 'Failed to delete article');
    }
  };
  
  // ฟังก์ชันดูบทความ
  const handleViewArticle = (slug) => {
    window.open(`/viwe-post/${slug}`, '_blank');
  };
  
  // โหลดบทความเมื่อ component ถูกโหลด
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setArticles(response.data.posts);
        setFilteredArticles(response.data.posts);
      } catch (error) {
        console.error('Error fetching articles:', error);
        showToast('error', 'Error', 'Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
    
    // ล้าง timeout เมื่อ component unmount
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);
  
  // ฟังก์ชันแสดงสถานะด้วยสี
  const renderStatus = (value) => {
    // console.log("Status value:", value, typeof value);
    
    // ถ้าเป็น string เช่น "publish" หรือ "draft"
    if (typeof value === 'string') {
      if (value === 'publish') {
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Published
          </span>
        );
      } else {
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            Draft
          </span>
        );
      }
    }
    
    // ถ้าเป็น number เช่น 1 หรือ 2
    if (typeof value === 'number') {
      if (value === 2) {
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Published
          </span>
        );
      } else {
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            Draft
          </span>
        );
      }
    }
    
    // ถ้าไม่ใช่ทั้ง string และ number
    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
        Draft
      </span>
    );
  };
  
  return (
    <div className="flex-1 p-8 md:p-12 bg-stone-50 relative min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />
      
      {/* Header with Create button */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-semibold text-gray-900">Article management</h1>
        <Button
          onClick={handleCreateArticle}
          className="bg-gray-900 text-white hover:bg-gray-700 flex items-center"
        >
          <PlusCircle size={16} className="mr-2" />
          Create article
        </Button>
      </div>
      
      {/* Search bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search articles..."
            onChange={handleSearchChange}
            className="pl-10 pr-8"
            disabled={isLoading}
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-2">
            Found {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
          </p>
        )}
      </div>
      
      {/* Articles list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 border-b px-6 py-4">
          <div className="col-span-5 text-sm font-medium text-gray-500">Article title</div>
          <div className="col-span-2 text-sm font-medium text-gray-500">Category</div>
          <div className="col-span-2 text-sm font-medium text-gray-500">Status</div>
          <div className="col-span-3 text-sm font-medium text-gray-500 text-right">Actions</div>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block h-6 w-6 border-2 border-t-transparent border-gray-500 rounded-full animate-spin mr-2"></div>
            Loading articles...
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && filteredArticles.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No articles found matching your search' : 'No articles yet'}
          </div>
        )}
        
        {/* Articles */}
        <div className="divide-y">
          {filteredArticles.map(article => (
            <div key={article.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              <div className="col-span-5 text-gray-900 truncate">{article.title}</div>
              <div className="col-span-2 text-gray-600">{article.categories?.name || 'Uncategorized'}</div>
              <div className="col-span-2">{renderStatus(article.statuses?.status || 'draft')}</div>
              <div className="col-span-1 text-gray-600 truncate">{article.author?.name || 'Unknown'}</div> {/* เพิ่มชื่อผู้เขียน */}
              <div className="col-span-2 flex justify-end space-x-2">
                <Button
                  onClick={() => handleViewArticle(article.id)}
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700"
                  title="View article"
                >
                  <ExternalLink size={16} />
                </Button>
                <Button
                  onClick={() => handleEditArticle(article.id)}
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700"
                  title="Edit article"
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  onClick={() => handleDeleteArticle(article.id)}
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700"
                  title="Delete article"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArticleManagement;