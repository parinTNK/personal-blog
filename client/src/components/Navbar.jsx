import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Button } from './ui/button';
import {
  UserCircleIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

function Navbar() {
  const { currentUser, logoutUser, loading } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const renderProfilePic = (sizeClass = "h-8 w-8") => {
    if (currentUser?.profile_pic) {
      return <img src={currentUser.profile_pic} alt="Profile" className={`${sizeClass} rounded-full object-cover`} />;
    }
    return <UserIcon className={`${sizeClass} text-gray-500`} />;
  };

  if (loading) {
    return (
       <nav className="flex items-center justify-between py-5 px-5 md:px-8 bg-background border-b border-muted container mx-auto">
         <Link to="/" className="text-3xl">
           hh.
         </Link>
         <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
         </div>
       </nav>
    );
  }

  return (
    <>
      <nav className="flex items-center justify-between py-4 px-5 md:px-8 bg-background border-b border-muted container mx-auto">
        <Link to="/" className="text-3xl">
          hh.
        </Link>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300">
                  {renderProfilePic("h-8 w-8")}
                  <span className="text-sm font-medium hidden md:inline">{currentUser.name || currentUser.username}</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500 hidden md:inline" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 mt-2 mr-4 md:mr-0 p-1">
                <div className="flex flex-col">
                   <Link
                     to="/member-management"
                     state={{ defaultTab: 'profile' }}
                     className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                   >
                     <UserCircleIcon className="h-5 w-5 text-gray-500" />
                     Profile
                   </Link>
                   <Link
                     to="/member-management"
                     state={{ defaultTab: 'password' }}
                     className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                   >
                     <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                     Reset password
                   </Link>
                   <hr className="my-1 border-gray-200" />
                   <button
                     onClick={handleLogout}
                     className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md w-full text-left"
                   >
                     <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
                     Log out
                   </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                to="/login"
                className="px-8 py-2 rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-8 py-2 bg-foreground text-white rounded-full hover:bg-muted-foreground transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}

          {!currentUser && (
            <div className="sm:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-3xl p-1">
                    ☰
                  </button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col items-center space-y-4 p-4 w-screen mt-3 bg-background border-t border-muted">
                  <Link
                    to="/login"
                    className="px-8 py-2 rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors w-4/5 text-center"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-8 py-2 bg-foreground text-white rounded-full hover:bg-muted-foreground transition-colors w-4/5 text-center"
                  >
                    Sign up
                  </Link>
                </PopoverContent>
              </Popover>
            </div>
          )}

        </div>
      </nav>
    </>
  );
}

export default Navbar;