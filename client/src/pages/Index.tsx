import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, BarChart3, Bell, Scan, Users, TrendingUp, Shield, Smartphone, Heart } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Package,
      title: "Smart Inventory Management",
      description: "Easily add, update, and delete inventory items with our intuitive interface.",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: BarChart3,
      title: "Automatic Stock Calculation",
      description: "Automatically calculates remaining stock after each sale transaction.",
      color: "bg-accent/20 text-accent-foreground"
    },
    {
      icon: Bell,
      title: "Low Stock Alerts",
      description: "Receive timely alerts when inventory levels fall below your set thresholds.",
      color: "bg-destructive/10 text-destructive"
    },
    {
      icon: TrendingUp,
      title: "Detailed Reports",
      description: "Generate comprehensive daily and weekly inventory movement reports.",
      color: "bg-secondary/20 text-secondary-foreground"
    },
    {
      icon: Scan,
      title: "Barcode Scanning",
      description: "Optional barcode scanning and verification for streamlined operations.",
      color: "bg-primary/20 text-primary"
    },
    {
      icon: Users,
      title: "Multi-Role Support",
      description: "Built for retailers, distributors, and delivery agents with role-based access.",
      color: "bg-accent/10 text-accent-foreground"
    }
  ];

  const roles = [
    {
      title: "Retailer",
      description: "Perfect for store owners managing day-to-day inventory and sales",
      icon: ShoppingCart,
      features: ["Product management", "Sales tracking", "Low stock alerts", "Daily reports"]
    },
    {
      title: "Distributor", 
      description: "Ideal for wholesale operations managing multiple retailer accounts",
      icon: Package,
      features: ["Bulk inventory", "Retailer network", "Wholesale pricing", "Distribution tracking"]
    },
    {
      title: "Delivery Agent",
      description: "Designed for delivery personnel tracking shipments and routes",
      icon: Users,
      features: ["Delivery tracking", "Route optimization", "Status updates", "Performance metrics"]
    }
  ];

  return (
    <div className="min-h-screen bg-black scroll-smooth">
      <Navigation />
      
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute w-full h-full object-cover z-0 top-0 left-0"
          >
            <source src="/hero-background.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        {/* Overlay */}
        <div className="bg-black/50 z-10 absolute inset-0"></div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center h-screen">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="w-20 h-20 rounded-full bg-blue-600 p-2 shadow-md mb-8 flex items-center justify-center"
          >
            <Package className="h-12 w-12 text-white" />
          </motion.div>

          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Smart Stock
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="text-2xl md:text-3xl mb-8 font-medium text-blue-400"
          >
            A Smart Inventory & Reorder Alert System
          </motion.p>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="light-blue"
                size="lg" 
                className="px-8 py-4 text-lg font-semibold rounded-full"
                onClick={() => {
                  const browseSection = document.getElementById('browse-store');
                  browseSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Browse Store
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="dark-blue"
                size="lg" 
                className="px-8 py-4 text-lg font-semibold rounded-full"
                onClick={() => {
                  const aboutSection = document.getElementById('about-us');
                  aboutSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                About Us
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-primary">Smart Stock?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive inventory management features designed for modern retailers and distributors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="feature-card group cursor-pointer">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Inventory Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Real-time inventory monitoring with automatic stock level updates and comprehensive product management.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card group cursor-pointer">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-destructive/10 text-destructive mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Bell className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Intelligent alerts when inventory falls below minimum thresholds with customizable notification settings.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card group cursor-pointer">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/20 text-accent-foreground mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Distributor Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Seamless communication with distributors for product requests with automated order processing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card group cursor-pointer">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/20 text-secondary-foreground mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Comprehensive analytics and reporting with PDF export capabilities for business insights.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card group cursor-pointer">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Scan className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Barcode Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Advanced barcode scanning and verification for streamlined inventory operations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card group cursor-pointer">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent-foreground mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Smart Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Detailed analytics with sales trends, inventory movement reports, and performance metrics.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for <span className="text-primary">Every Role</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're a retailer, distributor, or delivery agent, Smart Stock adapts to your specific needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <Card key={index} className="feature-card text-center group">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full brand-gradient-soft mb-4 group-hover:scale-110 transition-transform duration-300">
                    <role.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Store Section */}
      <section id="browse-store" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse Store</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover a wide range of products available through our distributor network. 
              Retailers can easily browse and request products from verified distributors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="feature-card text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-4">Grocery</CardTitle>
                <CardDescription className="text-base">
                  Fresh produce, packaged foods, beverages, and daily essentials from trusted suppliers.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="feature-card text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-4">Medicine</CardTitle>
                <CardDescription className="text-base">
                  Pharmaceutical products, health supplements, and medical supplies with proper certification.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="feature-card text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-4">Electronics</CardTitle>
                <CardDescription className="text-base">
                  Latest gadgets, mobile devices, accessories, and electronic components from authorized dealers.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Card className="feature-card inline-block bg-primary/5">
              <CardContent className="p-6">
                <p className="text-muted-foreground font-medium">
                  🛒 Retailers can view product catalogs and request items directly from distributors through our platform
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">About Us</h2>
          <Card className="feature-card bg-gray-900/80 border-gray-700">
            <CardContent className="p-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Smart Stock is an internship-based inventory management platform developed by <span className="font-semibold text-[#3B82F6]">Laiba Khalid</span> and <span className="font-semibold text-[#3B82F6]">Rayyan Asghar</span>. It simplifies stock tracking, reorder alerts, and distributor-retailer coordination through intelligent UI and automation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="feature-card brand-gradient-soft">
            <CardContent className="p-12">
              <div className="mb-6">
                <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join thousands of businesses already using Smart Stock to streamline their inventory management.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="brand-gradient text-white hover:opacity-90 transition-opacity px-8 py-3 text-lg"
                  onClick={() => navigate('/signup')}
                >
                  Start Your Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-3 text-lg hover:bg-accent/20"
                  onClick={() => navigate('/login')}
                >
                  <Smartphone className="h-5 w-5 mr-2" />
                  Already Have Account?
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-2 rounded-xl brand-gradient">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Stock
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Smart Stock. All rights reserved. Built with ❤️ for better business management.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
