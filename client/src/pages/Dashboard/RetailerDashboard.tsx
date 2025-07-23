import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, TrendingUp, Bell, BarChart3, Users } from 'lucide-react';
import RetailerNavigation from '@/components/RetailerNavigation';

const RetailerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <RetailerNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Retailer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your inventory overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">+20% from last month</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <Bell className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">23</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,345</div>
                <p className="text-xs text-muted-foreground">+15% from yesterday</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67</div>
                <p className="text-xs text-muted-foreground">Pending: 12</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Manage your inventory and sales efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start brand-gradient text-white">
                  <Package className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Process Sale
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  View Low Stock Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>
                  Stay updated with important notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium">Low Stock Alert</p>
                  <p className="text-xs text-muted-foreground">iPhone 15 Pro - Only 3 units left</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium">Reorder Suggestion</p>
                  <p className="text-xs text-muted-foreground">Samsung Galaxy S24 - Consider restocking</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                  <p className="text-sm font-medium">Sales Milestone</p>
                  <p className="text-xs text-muted-foreground">Congratulations! You've reached $10K in sales this month</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-8 text-center">
            <Card className="feature-card inline-block">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">🚀 Full Dashboard Coming Soon!</h3>
                <p className="text-muted-foreground">
                  We're working on advanced inventory management, detailed analytics, and barcode scanning features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;