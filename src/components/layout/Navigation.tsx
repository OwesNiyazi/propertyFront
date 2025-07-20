import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Home, List, Plus, LogOut, Camera, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
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
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Nav links for reuse
  const navLinks = (
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
        <span>My List</span>
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
        <span>Add New Card</span>
      </Link>
    </>
  );

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Nav links or burger */}
          <div className="flex items-center">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks}
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

          {/* Right section: Welcome and logout (desktop only) */}
          <div className="hidden md:flex items-center space-x-4">
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
          </div>
        </div>
      </div>
      {/* Mobile dropdown menu */}
      {isMobile && mobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-sm border-b border-border px-4 pb-4 pt-2 shadow-lg animate-fade-in-down">
          <div className="flex flex-col space-y-2 mb-2">{navLinks}</div>
          <div className="flex flex-col space-y-2">
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
          </div>
        </div>
      )}
    </nav>
  );
};