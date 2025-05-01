import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticleBar from "./ui/ArticleBar";
import CardPost from "./ui/CardPost";
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function Articles() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]); // State สำหรับเก็บหมวดหมู่
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 6
  });

  // ฟังก์ชันดึงข้อมูลหมวดหมู่
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      const fetchedCategories = response.data.categories || [];
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ฟังก์ชันดึงข้อมูลบทความ
  const fetchPosts = async (page = 1, loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      console.log('Fetching posts with params:', {
        page, 
        category: selectedCategory, 
        search: searchQuery
      });
      
      // สร้าง query parameters
      const params = {
        page,
        limit: pagination.itemsPerPage,
      };

      // เพิ่ม category_id ถ้าไม่ใช่ Highlight
      if (selectedCategory && selectedCategory !== "Highlight") {
        // ดึง category_id จากชื่อ category
        const categoryId = getCategoryIdByName(selectedCategory);
        if (categoryId) {
          params.category_id = categoryId;
        }
      }

      // เพิ่ม search parameter ถ้ามีการค้นหา
      if (searchQuery) {
        params.search = searchQuery;
      }

      // เรียก API
      const response = await axios.get(`${API_BASE_URL}/api/posts/public`, { params });
      
      console.log('API response:', response.data);
      
      const { posts, pagination: paginationData } = response.data;
      
      if (posts && Array.isArray(posts)) {
        // ถ้าเป็นการโหลดเพิ่ม ให้เพิ่มข้อมูลใหม่ต่อท้ายข้อมูลเดิม
        if (loadMore) {
          setBlogPosts(prevPosts => [...prevPosts, ...posts]);
        } else {
          setBlogPosts(posts);
        }
        
        setPagination(paginationData);
      } else {
        console.error('Invalid posts data format:', posts);
        setBlogPosts([]);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  // Helper function เพื่อหา category_id จากชื่อ category
  const getCategoryIdByName = (categoryName) => {
    if (categoryName === "Highlight") return null; // Highlight ไม่มี category_id
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.id : null;
  };

  // โหลดข้อมูลหมวดหมู่เมื่อ component ถูก mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // โหลดข้อมูลเมื่อเปลี่ยนหมวดหมู่หรือคำค้นหา
  useEffect(() => {
    // รีเซ็ต pagination เมื่อเปลี่ยนหมวดหมู่หรือคำค้นหา
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    fetchPosts(1);
  }, [selectedCategory, searchQuery]);

  // ฟังก์ชันโหลดข้อมูลเพิ่ม
  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchPosts(pagination.currentPage + 1, true);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h3 className="px-4 font-semibold text-2xl">Latest articles</h3>
      
      <ArticleBar 
        setSelectedCategory={setSelectedCategory} 
        setSearchQuery={setSearchQuery}
        categories={["Highlight", ...categories.map(cat => cat.name)]} // ส่งหมวดหมู่ไปยัง ArticleBar
      />

      {/* แสดงสถานะการโหลด */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div>
          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 px-4">
              {/* แสดงบทความทั้งหมด */}
              {blogPosts.map((post) => (
                <CardPost
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  description={post.description || ""}
                  category={post.category}
                  image={post.image || "https://placehold.co/600x400?text=No+Image"}
                  author={post.author}
                  date={new Date(post.date).toLocaleDateString()}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found.</p>
            </div>
          )}
          
          {/* ปุ่มโหลดเพิ่ม */}
          {pagination.currentPage < pagination.totalPages && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}

          {/* แสดงข้อมูล pagination */}
          <div className="text-center mt-4 text-sm text-gray-500">
            Showing {blogPosts.length} of {pagination.totalItems} articles
          </div>
        </div>
      )}
    </div>
  );
}

export default Articles;