import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, TrendingUp, Bell, BarChart3, Sparkles, Loader2 } from 'lucide-react';
import RetailerNavigation from '@/components/RetailerNavigation';
import RetailerDashboardCharts from '@/components/dashboard/RetailerDashboardCharts';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchRetailerStock } from '@/Redux/Store/stockSlice';
import { fetchOrders } from '@/Redux/Store/ordersSlice';
import { fetchRequests } from '@/Redux/Store/requestsSlice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getGeminiInsights } from '@/lib/geminiApi';
import { useToast } from '@/hooks/use-toast';

const RetailerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: stock, loading: stockLoading } = useSelector((state: RootState) => state.stock);
  const { items: orders, loading: ordersLoading } = useSelector((state: RootState) => state.orders);
  const { items: requests, loading: requestsLoading } = useSelector((state: RootState) => state.requests);
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchRetailerStock());
    dispatch(fetchOrders()); // Fixed: Added missing parentheses
    dispatch(fetchRequests());
  }, [dispatch]);

  // Fetch AI insights
  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      try {
        const response = await getGeminiInsights('retailer');
        if (response.success) {
          setInsights(response.insights);
        } else {
          setInsights('Unable to generate insights. Please check your API key configuration.');
        }
      } catch (error) {
        toast({
          title: 'Error fetching insights',
          description: 'There was an error fetching AI insights.',
          variant: 'destructive',
        });
        setInsights('An error occurred while generating insights.');
      } finally {
        setLoadingInsights(false);
      }
    };

    fetchInsights();
  }, [dispatch, toast]);

  // Calculate summary
  const totalProducts = stock.length;
  const lowStockItems = stock.filter(item => item.quantity <= item.min_threshold).length;
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;

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
                <div className="text-2xl font-bold">{stockLoading ? "..." : totalProducts}</div>
                <p className="text-xs text-muted-foreground">Total inventory items</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <Bell className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stockLoading ? "..." : lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ordersLoading ? "..." : pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Awaiting fulfillment</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ordersLoading ? "..." : orders.length}</div>
                <p className="text-xs text-muted-foreground">All time orders</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Insights
                </CardTitle>
                <CardDescription>
                  Powered by Gemini AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingInsights ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="animate-spin h-5 w-5 text-primary mr-2" />
                      <span className="text-sm text-muted-foreground">Generating insights...</span>
                    </div>
                ) : insights ? (
                    <div className="prose prose-sm sm:prose-base text-muted-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {insights}
                      </ReactMarkdown>
                    </div>
                ) : (
                    <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                      <p className="text-sm font-medium">No insights available</p>
                      <p className="text-xs text-muted-foreground">Try adding more products and processing sales</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-5">
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
                {stockLoading ? (
                  <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                    <p className="text-sm font-medium">Loading alerts...</p>
                  </div>
                ) : lowStockItems > 0 ? (
                  <>
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm font-medium">Low Stock Alert</p>
                      <p className="text-xs text-muted-foreground">You have {lowStockItems} items below minimum threshold</p>
                    </div>
                    {requests.filter(req => req.status === 'PENDING').length > 0 && (
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-sm font-medium">Pending Requests</p>
                        <p className="text-xs text-muted-foreground">{requests.filter(req => req.status === 'PENDING').length} requests awaiting approval</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                    <p className="text-sm font-medium">All Good!</p>
                    <p className="text-xs text-muted-foreground">Your inventory levels are healthy</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Analytics Dashboard</h2>
            {stockLoading || ordersLoading || requestsLoading ? (
              <Card className="feature-card">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Loading dashboard data...</p>
                </CardContent>
              </Card>
            ) : (
              <RetailerDashboardCharts />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;