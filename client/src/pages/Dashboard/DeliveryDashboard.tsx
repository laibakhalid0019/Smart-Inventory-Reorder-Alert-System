import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, MapPin, Clock, CheckCircle, BarChart3, Route } from 'lucide-react';
import DeliveryNavigation from '@/components/DeliveryNavigation';

const DeliveryDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <DeliveryNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Delivery Agent Dashboard</h1>
            <p className="text-muted-foreground">Manage your deliveries and track your performance.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">8 completed, 4 pending</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Status</CardTitle>
                <MapPin className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">En Route</div>
                <p className="text-xs text-muted-foreground">To TechMart Store</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Time</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28 min</div>
                <p className="text-xs text-muted-foreground">Per delivery</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-primary" />
                  Delivery Management
                </CardTitle>
                <CardDescription>
                  Manage your delivery routes and status updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start brand-gradient text-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Current Route
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="h-4 w-4 mr-2" />
                  Update Delivery Status
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Delivered
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Performance
                </Button>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>
                  Your delivery schedule and priority orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">TechMart Store</p>
                      <p className="text-xs text-muted-foreground">Order #1234 - In Progress</p>
                    </div>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Priority</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">ElectroStore</p>
                      <p className="text-xs text-muted-foreground">Order #1235 - Pending</p>
                    </div>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Next</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20 border border-secondary/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">MobileHub</p>
                      <p className="text-xs text-muted-foreground">Order #1236 - Scheduled</p>
                    </div>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Later</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="mt-8">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Track your delivery performance and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5 border">
                    <h4 className="font-semibold">Weekly Deliveries</h4>
                    <p className="text-2xl font-bold text-primary">67</p>
                    <p className="text-xs text-muted-foreground">+12% from last week</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border">
                    <h4 className="font-semibold">Customer Rating</h4>
                    <p className="text-2xl font-bold text-primary">4.9/5</p>
                    <p className="text-xs text-muted-foreground">Based on 45 reviews</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/10 border">
                    <h4 className="font-semibold">On-Time Rate</h4>
                    <p className="text-2xl font-bold text-primary">96%</p>
                    <p className="text-xs text-muted-foreground">Above average</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/20 border">
                    <h4 className="font-semibold">Weekly Earnings</h4>
                    <p className="text-2xl font-bold text-primary">$845</p>
                    <p className="text-xs text-muted-foreground">+8% from last week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-8 text-center">
            <Card className="feature-card inline-block">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">🚀 GPS Tracking Coming Soon!</h3>
                <p className="text-muted-foreground">
                  Real-time GPS tracking, route optimization, and customer communication features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;