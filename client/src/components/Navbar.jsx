import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import { Button } from './ui/button'; 

function Navbar() {
  const { currentUser, logoutUser, loading } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  if (loading) {
    return (
       <nav className="flex items-center justify-between py-5 px-5 md:px-8 bg-background border-b border-muted container mx-auto">
         <Link to="/" className="text-3xl">
           hh.
         </Link>
         <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div> 
       </nav>
    );
  }

  return (
    <>
      <nav className="flex items-center justify-between py-5 px-5 md:px-8 bg-background border-b border-muted container mx-auto">
        <Link to="/" className="text-3xl">
          hh.
        </Link>

        <div className="hidden sm:flex items-center space-x-4">
          {currentUser ? (
            <>
              <span className="text-foreground">Hi, {currentUser.name || currentUser.username}!</span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="px-8 py-2 rounded-full"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="sm:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-3xl">
                ☰
              </button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col items-center space-y-4 p-4 w-screen mt-3 bg-background border-t border-muted">
              {currentUser ? (
                 <>
                   <span className="text-foreground text-center w-4/5 py-2">Hi, {currentUser.name || currentUser.username}!</span>
                   <Button
                     variant="outline"
                     onClick={handleLogout}
                     className="px-8 py-2 rounded-full w-4/5" // Match width
                   >
                     Log out
                   </Button>
                 </>
              ) : (
                <>
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
                </>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </>
  );
}

export default Navbar;