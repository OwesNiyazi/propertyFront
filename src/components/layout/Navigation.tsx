import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Home, List, Plus, LogOut, Camera, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/home');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Nav links for authenticated users
  const authenticatedNavLinks = (
    <>
      <Link
        to="/home"
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
          isActive('/home')
            ? 'bg-primary/20 text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <Home size={18} />
        <span>Home</span>
      </Link>
      <Link
        to="/my-list"
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
          isActive('/my-list')
            ? 'bg-primary/20 text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <List size={18} />
        <span>My Properties</span>
      </Link>
      <Link
        to="/add-card"
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
          isActive('/add-card')
            ? 'bg-primary/20 text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <Plus size={18} />
        <span>Add Property</span>
      </Link>
    </>
  );

  // Nav links for non-authenticated users
  const publicNavLinks = (
    <>
      <Link
        to="/home"
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
          isActive('/home')
            ? 'bg-primary/20 text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <Home size={18} />
        <span>Home</span>
      </Link>
    </>
  );

  // Auth buttons for non-authenticated users
  const authButtons = (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/login')}
        className="flex items-center space-x-2"
      >
        <LogIn size={16} />
        <span className="hidden sm:inline">Login</span>
      </Button>
      <Button
        variant="gradient"
        size="sm"
        onClick={() => navigate('/register')}
        className="flex items-center space-x-2"
      >
        <UserPlus size={16} />
        <span className="hidden sm:inline">Sign Up</span>
      </Button>
    </div>
  );

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Nav links or burger */}
          <div className="flex items-center">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? authenticatedNavLinks : publicNavLinks}
            </div>
            {/* Mobile burger icon */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            )}
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <Link
              to="/home"
              className="flex items-center space-x-2 text-xl font-bold bg-gradient-primary bg-clip-text text-transparent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Camera size={24} className="text-primary" />
              <span>Property Hub</span>
            </Link>
          </div>

          {/* Right section: User info or auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="text-foreground font-medium">{user?.username}</span>
                </span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              authButtons
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile dropdown menu */}
      {isMobile && mobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-sm border-b border-border px-4 pb-4 pt-2 shadow-lg animate-fade-in-down">
          <div className="flex flex-col space-y-2 mb-2">
            {isAuthenticated ? authenticatedNavLinks : publicNavLinks}
          </div>
          <div className="flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="text-foreground font-medium">{user?.username}</span>
                </span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-fit"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2"
                >
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};