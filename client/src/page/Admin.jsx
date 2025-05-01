import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar'; // Adjust path if needed
import AdminProfile from '@/components/admin/AdminProfile';
import AdminResetPassword from '@/components/admin/AdminResetPassword';
import CategoryManagement from '@/components/admin/CategoryManagement'; // Import the new component
// Import other admin section components here as needed
// import ArticleManagement from '@/components/admin/ArticleManagement';
// import NotificationSettings from '@/components/admin/NotificationSettings';

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
        return <CategoryManagement />; // Use the actual CategoryManagement component
      case 'notifications':
        return <div>Notification Settings Content</div>; // Replace with actual component
      case 'password':
        return <AdminResetPassword />;
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