import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Package, FileText, User, LogOut, Mail, UserCircle, Menu, BarChart3, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const DistributorNavigation = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/dashboard/distributor" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Smart Stock
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/dashboard/distributor" className="nav-link">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
            
            <Link to="/distributor/products" className="nav-link">
              <Package className="h-4 w-4 mr-2" />
              View Product
            </Link>

            <Link to="/distributor/requests" className="nav-link">
              <FileText className="h-4 w-4 mr-2" />
              View Request
            </Link>

            <Link to="/distributor/orders" className="nav-link">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Orders
            </Link>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    {user?.profilePicture && (
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.initials || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border border-border shadow-lg" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <div className="flex items-center space-x-2">
                    <UserCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{user?.name || 'User'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="capitalize">{user?.role || 'Distributor'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{user?.email || 'user@example.com'}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Profile Dropdown for Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    {user?.profilePicture && (
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.initials || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border border-border shadow-lg" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <div className="flex items-center space-x-2">
                    <UserCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{user?.name || 'User'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="capitalize">{user?.role || 'Distributor'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{user?.email || 'user@example.com'}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-8">
                    <Package className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Smart Stock
                    </span>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <Link 
                      to="/dashboard/distributor" 
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-accent/20 transition-colors text-lg font-medium"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <BarChart3 className="h-4 w-4 mr-3" />
                      Dashboard
                    </Link>

                    <Link 
                      to="/distributor/products" 
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-accent/20 transition-colors text-lg font-medium"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-3" />
                      View Product
                    </Link>

                    <Link 
                      to="/distributor/requests" 
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-accent/20 transition-colors text-lg font-medium"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      View Request
                    </Link>

                    <Link 
                      to="/distributor/orders" 
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-accent/20 transition-colors text-lg font-medium"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      Orders
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DistributorNavigation;