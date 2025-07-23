import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Package, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show navigation on homepage
  if (location.pathname !== '/') {
    return null;
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'Browse Store', href: '#browse-store' },
    { name: 'About', href: '#about-us' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl brand-gradient group-hover:scale-110 transition-transform duration-300">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Smart Stock
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="nav-link text-white hover:text-[#3B82F6]"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="hover:bg-white/10 text-white"
            >
              Login
            </Button>
            <Button
              variant="light-blue"
              onClick={() => navigate('/signup')}
            >
              Signup
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <div className="p-2 rounded-xl brand-gradient">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      Smart Stock
                    </span>
                  </Link>
                </div>

                <div className="flex flex-col space-y-4 mb-8">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.href)}
                      className="text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-colors text-lg text-white"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                <div className="mt-auto space-y-4">
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-white/10"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/login');
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="light-blue"
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/signup');
                    }}
                  >
                    Signup
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;