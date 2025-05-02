import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminProfile from '@/components/admin/AdminProfile';
import AdminResetPassword from '@/components/admin/AdminResetPassword';
import CategoryManagement from '@/components/admin/CategoryManagement';
import ArticleManagement from '@/components/admin/ArticleManagement';
import CreateArticle from '@/components/admin/CreateArticle';
import EditArticle from '@/components/admin/EditArticle';

function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Default to 'profile', but check URL params first
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'profile';
  });
  
  // State สำหรับเก็บ ID ของบทความที่กำลังแก้ไข
  const [editArticleId, setEditArticleId] = useState(null);
  
  // State สำหรับติดตามว่ากำลังสร้างบทความใหม่หรือไม่
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);

  // Update activeSection when URL params change
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
    
    // ตรวจสอบพารามิเตอร์ action และ id
    const action = searchParams.get('action');
    const articleId = searchParams.get('articleId');
    
    if (section === 'articles') {
      if (action === 'create') {
        setIsCreatingArticle(true);
        setEditArticleId(null);
      } else if (action === 'edit' && articleId) {
        setEditArticleId(articleId);
        setIsCreatingArticle(false);
      } else {
        setIsCreatingArticle(false);
        setEditArticleId(null);
      }
    } else {
      // ถ้าเปลี่ยนไปยังส่วนอื่นที่ไม่ใช่ articles ให้รีเซ็ตสถานะการแก้ไข/สร้างบทความ
      setIsCreatingArticle(false);
      setEditArticleId(null);
    }
  }, [searchParams]);

  // ฟังก์ชันที่เรียกเมื่อเสร็จสิ้นการสร้าง/แก้ไขบทความ
  const handleArticleActionDone = () => {
    // เปลี่ยน URL กลับไปที่รายการบทความโดยไม่มี action และ articleId
    setSearchParams({ section: 'articles' });
    // รีเซ็ตสถานะ
    setIsCreatingArticle(false);
    setEditArticleId(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <AdminProfile />;
      case 'articles':
        if (isCreatingArticle) {
          return <CreateArticle onDone={handleArticleActionDone} />;
        } else if (editArticleId) {
          return <EditArticle id={editArticleId} onDone={handleArticleActionDone} />;
        } else {
          return <ArticleManagement />;
        }
      case 'categories':
        return <CategoryManagement />;
      case 'notifications':
        return <div>Notification Settings Content</div>;
      case 'password':
        return <AdminResetPassword />;
      default:
        return <AdminProfile />;
    }
  };

  // ฟังก์ชันสำหรับอัปเดท active section เมื่อคลิกที่ sidebar
  const handleSectionChange = (section) => {
    setSearchParams({ section });
  };

  return (
    <div className="flex min-h-screen bg-stone-100">
      <AdminSidebar activeSection={activeSection} setActiveSection={handleSectionChange} />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
}

export default Admin;