import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, TrendingUp, Users, BarChart3, MapPin } from 'lucide-react';
import DistributorNavigation from '@/components/DistributorNavigation';

const DistributorDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <DistributorNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Distributor Dashboard</h1>
            <p className="text-muted-foreground">Manage your distribution network and wholesale operations.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,420</div>
                <p className="text-xs text-muted-foreground">Across all warehouses</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Retailers</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">+5 new this month</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Truck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground">12 ready to ship</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,230</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Distribution Management
                </CardTitle>
                <CardDescription>
                  Manage your wholesale operations and retailer network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start brand-gradient text-white">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Inventory
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View Retailer Network
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Shipments
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Sales Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  Track your distribution activities and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium">New Order Received</p>
                  <p className="text-xs text-muted-foreground">TechMart - 50 units of iPhone 15</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                  <p className="text-sm font-medium">Shipment Delivered</p>
                  <p className="text-xs text-muted-foreground">ElectroStore - Order #1234 completed</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20 border border-secondary/30">
                  <p className="text-sm font-medium">New Retailer Onboarded</p>
                  <p className="text-xs text-muted-foreground">MobileHub joined your network</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warehouse Overview */}
          <div className="mt-8">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Warehouse Overview
                </CardTitle>
                <CardDescription>
                  Monitor your distribution centers and stock levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5 border">
                    <h4 className="font-semibold">Main Warehouse</h4>
                    <p className="text-sm text-muted-foreground">New York</p>
                    <p className="text-lg font-bold text-primary">8,450 units</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border">
                    <h4 className="font-semibold">West Coast Hub</h4>
                    <p className="text-sm text-muted-foreground">Los Angeles</p>
                    <p className="text-lg font-bold text-primary">4,320 units</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/10 border">
                    <h4 className="font-semibold">Regional Center</h4>
                    <p className="text-sm text-muted-foreground">Chicago</p>
                    <p className="text-lg font-bold text-primary">2,650 units</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-8 text-center">
            <Card className="feature-card inline-block">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">🚀 Advanced Features Coming Soon!</h3>
                <p className="text-muted-foreground">
                  Multi-warehouse management, bulk order processing, and advanced retailer analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;