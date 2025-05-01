import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  FolderIcon,
  UserCircleIcon,
  BellIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useUser } from '@/context/UserContext';

const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center w-full gap-3 px-4 py-2.5 text-sm rounded-md transition-colors duration-150 ${
      isActive
        ? 'bg-gray-200 text-gray-900 font-medium'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
    <span>{label}</span>
  </button>
);

function AdminSidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();
  const { logoutUser } = useUser();
  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <aside className="w-70 bg-stone-50 border-r border-stone-200 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="px-4 py-6">
        <Link to="/" className="text-3xl font-bold text-gray-800">
          hh.
        </Link>
        <p className="text-sm text-orange-500 mt-1">Admin panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-1">
        <SidebarItem
          icon={DocumentTextIcon}
          label="Article management"
          isActive={activeSection === 'articles'}
          onClick={() => handleMenuClick('articles')}
        />
        <SidebarItem
          icon={FolderIcon}
          label="Category management"
          isActive={activeSection === 'categories'}
          onClick={() => handleMenuClick('categories')}
        />
        <SidebarItem
          icon={UserCircleIcon}
          label="Profile"
          isActive={activeSection === 'profile'}
          onClick={() => handleMenuClick('profile')}
        />
        <SidebarItem
          icon={BellIcon}
          label="Notification"
          isActive={activeSection === 'notifications'}
          onClick={() => handleMenuClick('notifications')}
        />
        <SidebarItem
          icon={ArrowPathIcon}
          label="Reset password"
          isActive={activeSection === 'password'}
          onClick={() => handleMenuClick('password')}
        />
      </nav>

      {/* Footer Links */}
      <div className="px-4 py-4 border-t border-stone-200 space-y-1">
        <a
          href="/" // Link to the main website
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center w-full gap-3 px-4 py-2.5 text-sm rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <ArrowTopRightOnSquareIcon className="h-5 w-5 flex-shrink-0" />
          <span>hh. website</span>
        </a>
        <SidebarItem
          icon={ArrowLeftOnRectangleIcon}
          label="Log out"
          isActive={false} // Logout is never 'active'
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
}

export default AdminSidebar;