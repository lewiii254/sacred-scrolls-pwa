import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { 
  Home, 
  Book, 
  Search, 
  BookMarked, 
  FileText, 
  Heart, 
  User, 
  Sun, 
  Moon, 
  LogOut,
  Calendar,
  Users,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";

export function Navigation() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:top-0 md:bottom-auto md:w-64 md:h-full md:border-r md:border-t-0">
      <div className="flex justify-around items-center p-4 md:flex-col md:justify-start md:space-y-4 md:h-full">
        {/* Logo - only visible on desktop */}
        <div className="hidden md:flex items-center space-x-2 mb-8">
          <Book className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">Sacred Scrolls</span>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-around w-full md:flex-col md:space-y-2 md:w-full">
          <Link to="/">
            <Button 
              variant={isActive('/') ? "default" : "ghost"} 
              size="sm"
              className="flex flex-col md:flex-row md:w-full md:justify-start items-center space-y-1 md:space-y-0 md:space-x-2"
            >
              <Home className="h-4 w-4" />
              <span className="text-xs md:text-sm">Home</span>
            </Button>
          </Link>

          <Link to="/bible">
            <Button 
              variant={isActive('/bible') ? "default" : "ghost"} 
              size="sm"
              className="flex flex-col md:flex-row md:w-full md:justify-start items-center space-y-1 md:space-y-0 md:space-x-2"
            >
              <Book className="h-4 w-4" />
              <span className="text-xs md:text-sm">Bible</span>
            </Button>
          </Link>

          <Link to="/search">
            <Button 
              variant={isActive('/search') ? "default" : "ghost"} 
              size="sm"
              className="flex flex-col md:flex-row md:w-full md:justify-start items-center space-y-1 md:space-y-0 md:space-x-2"
            >
              <Search className="h-4 w-4" />
              <span className="text-xs md:text-sm">Search</span>
            </Button>
          </Link>

          <Link to="/notes">
            <Button 
              variant={isActive('/notes') ? "default" : "ghost"} 
              size="sm"
              className="flex flex-col md:flex-row md:w-full md:justify-start items-center space-y-1 md:space-y-0 md:space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs md:text-sm">Notes</span>
            </Button>
          </Link>

          {/* Mobile: More menu button; Desktop: Bookmarks */}
          <div className="md:hidden">
            <Drawer open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <DrawerTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col items-center space-y-1"
                >
                  <Menu className="h-4 w-4" />
                  <span className="text-xs">More</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="text-left">
                  <DrawerTitle className="flex items-center justify-between">
                    <span>More Options</span>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </DrawerClose>
                  </DrawerTitle>
                  <DrawerDescription>
                    Access additional features and settings
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-3">
                  {/* Bookmarks */}
                  <Link to="/bookmarks" onClick={() => setIsMoreMenuOpen(false)}>
                    <Button 
                      variant={isActive('/bookmarks') ? "default" : "ghost"} 
                      size="sm"
                      className="flex items-center space-x-3 w-full justify-start h-12"
                    >
                      <BookMarked className="h-5 w-5" />
                      <span>Bookmarks</span>
                    </Button>
                  </Link>

                  {/* Devotionals */}
                  <Link to="/devotionals" onClick={() => setIsMoreMenuOpen(false)}>
                    <Button 
                      variant={isActive('/devotionals') ? "default" : "ghost"} 
                      size="sm"
                      className="flex items-center space-x-3 w-full justify-start h-12"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Devotionals</span>
                    </Button>
                  </Link>

                  {/* Reading Plans */}
                  <Link to="/reading-plans" onClick={() => setIsMoreMenuOpen(false)}>
                    <Button 
                      variant={isActive('/reading-plans') ? "default" : "ghost"} 
                      size="sm"
                      className="flex items-center space-x-3 w-full justify-start h-12"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Reading Plans</span>
                    </Button>
                  </Link>

                  {/* Community */}
                  <Link to="/community" onClick={() => setIsMoreMenuOpen(false)}>
                    <Button 
                      variant={isActive('/community') ? "default" : "ghost"} 
                      size="sm"
                      className="flex items-center space-x-3 w-full justify-start h-12"
                    >
                      <Users className="h-5 w-5" />
                      <span>Community</span>
                    </Button>
                  </Link>

                  {/* Profile */}
                  <Link to="/profile" onClick={() => setIsMoreMenuOpen(false)}>
                    <Button 
                      variant={isActive('/profile') ? "default" : "ghost"} 
                      size="sm"
                      className="flex items-center space-x-3 w-full justify-start h-12"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Button>
                  </Link>

                  {/* Theme Toggle */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark');
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full justify-start h-12"
                  >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme</span>
                  </Button>

                  {/* Sign Out */}
                  {user && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        signOut();
                        setIsMoreMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full justify-start text-destructive h-12"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </Button>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Desktop: Show bookmarks normally */}
          <div className="hidden md:block">
            <Link to="/bookmarks">
              <Button 
                variant={isActive('/bookmarks') ? "default" : "ghost"} 
                size="sm"
                className="flex flex-col md:flex-row md:w-full md:justify-start items-center space-y-1 md:space-y-0 md:space-x-2"
              >
                <BookMarked className="h-4 w-4" />
                <span className="text-xs md:text-sm">Saved</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom section - only visible on desktop */}
        <div className="hidden md:flex flex-col space-y-2 w-full mt-auto">
          <Link to="/devotionals">
            <Button 
              variant={isActive('/devotionals') ? "default" : "ghost"} 
              size="sm"
              className="flex items-center space-x-2 w-full justify-start"
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm">Devotionals</span>
            </Button>
          </Link>

          <Link to="/reading-plans">
            <Button 
              variant={isActive('/reading-plans') ? "default" : "ghost"} 
              size="sm"
              className="flex items-center space-x-2 w-full justify-start"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Reading Plans</span>
            </Button>
          </Link>

          <Link to="/community">
            <Button 
              variant={isActive('/community') ? "default" : "ghost"} 
              size="sm"
              className="flex items-center space-x-2 w-full justify-start"
            >
              <Users className="h-4 w-4" />
              <span className="text-sm">Community</span>
            </Button>
          </Link>

          <Link to="/profile">
            <Button 
              variant={isActive('/profile') ? "default" : "ghost"} 
              size="sm"
              className="flex items-center space-x-2 w-full justify-start"
            >
              <User className="h-4 w-4" />
              <span className="text-sm">Profile</span>
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center space-x-2 w-full justify-start"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="text-sm">Theme</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={signOut}
            className="flex items-center space-x-2 w-full justify-start text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Sign Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}