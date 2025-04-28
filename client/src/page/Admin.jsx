import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar'; // Adjust path if needed
import AdminProfile from '@/components/admin/AdminProfile'; // Adjust path if needed
// Import other admin section components here as needed
// import ArticleManagement from '@/components/admin/ArticleManagement';
// import CategoryManagement from '@/components/admin/CategoryManagement';
// import NotificationSettings from '@/components/admin/NotificationSettings';
// import AdminResetPassword from '@/components/admin/AdminResetPassword';

function Admin() {
  // Default to 'profile' or load from URL/state if needed
  const [activeSection, setActiveSection] = useState('profile');

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <AdminProfile />;
      case 'articles':
        return <div>Article Management Content</div>; // Replace with actual component
      case 'categories':
        return <div>Category Management Content</div>; // Replace with actual component
      case 'notifications':
        return <div>Notification Settings Content</div>; // Replace with actual component
      case 'password':
        return <div>Admin Reset Password Content</div>; // Replace with actual component
      default:
        return <AdminProfile />; // Fallback to profile
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-100">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
}

export default Admin;