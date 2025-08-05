import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Package,
  Truck,
  TrendingUp,
  Users,
  BarChart3,
  AlertTriangle,
  DollarSign,
  Clock,
  CheckCircle,
  Calendar,
  FileText,
  Loader2,
  Sparkles
} from 'lucide-react';
import DistributorNavigation from '@/components/DistributorNavigation';
import DistributorDashboardCharts from '@/components/dashboard/DistributorDashboardCharts';
import { RootState, AppDispatch } from '@/Redux/Store';
import { fetchProducts } from '@/Redux/Store/productsSlice';
import { fetchDistributorOrders } from '@/Redux/Store/ordersSlice';
import { fetchDistributorRequests } from '@/Redux/Store/distributorRequestsSlice';
import { useToast } from '@/hooks/use-toast';
import { getGeminiInsights } from '@/lib/geminiApi';

const DistributorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Get data from Redux slices with safe defaults
  const { products = [], status: productsStatus } = useSelector((state: RootState) => state.products ?? { products: [], status: 'idle' });
  const { distributorOrders = [], distributorOrdersStatus } = useSelector((state: RootState) => state.orders ?? { distributorOrders: [], distributorOrdersStatus: 'idle' });
  const { requests = [], status: requestsStatus } = useSelector((state: RootState) => state.distributorRequests ?? { requests: [], status: 'idle' });

  // Fetch all data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchProducts()).unwrap(),
          dispatch(fetchDistributorOrders()).unwrap(),
          dispatch(fetchDistributorRequests()).unwrap()
        ]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [dispatch, toast]);

  // Get AI insights when data is loaded
  useEffect(() => {
    // Only fetch insights when data is fully loaded and not already loading insights
    const shouldFetchInsights =
      !loadingInsights &&
      productsStatus !== 'loading' &&
      distributorOrdersStatus !== 'loading' &&
      requestsStatus !== 'loading' &&
      products.length > 0 &&
      !aiInsights; // Only fetch if we don't already have insights

    if (shouldFetchInsights) {
      // Force the AI insights section to display immediately with a loading state
      setLoadingInsights(true);

      const getInsights = async () => {
        try {
          console.log("Fetching Gemini insights...");
          const result = await getGeminiInsights('distributor');
          if (result.success) {
            console.log("Successfully received insights");
            setAiInsights(result.insights);
          } else {
            console.error("Failed to get AI insights:", result.error);
            // Set a fallback message if API fails
            setAiInsights("Unable to generate insights. Please check your API key configuration.");
          }
        } catch (error) {
          console.error("Error fetching AI insights:", error);
          setAiInsights("An error occurred while generating insights.");
        } finally {
          setLoadingInsights(false);
        }
      };
      
      getInsights();
    }
  // Use a stable dependency array to prevent flickering
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsStatus, distributorOrdersStatus, requestsStatus]);

  // Loading state check before calculations
  const isLoading = productsStatus === 'loading' || distributorOrdersStatus === 'loading' || requestsStatus === 'loading';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
        <DistributorNavigation />
        <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2 text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics from real data with safe defaults
  const totalProducts = Array.isArray(products) ? products.length : 0;

  // Fixed the potential undefined error by adding additional null checks
  const lowStockProducts = Array.isArray(products) 
    ? products.filter(p => p && typeof p.quantity === 'number' && typeof p.mst === 'number' && p.quantity <= p.mst).length 
    : 0;
    
  const expiringSoonProducts = Array.isArray(products) 
    ? products.filter(p => {
        if (!p || !p.expiry_date) return false;
        try {
          const today = new Date();
          const expiryDate = new Date(p.expiry_date);
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        } catch (e) {
          return false;
        }
      }).length 
    : 0;

  // Order metrics with safe defaults
  const totalOrders = Array.isArray(distributorOrders) ? distributorOrders.length : 0;
  const pendingOrders = Array.isArray(distributorOrders) 
    ? distributorOrders.filter(o => o && o.status && o.status.toLowerCase() === 'pending').length 
    : 0;
  const dispatchedOrders = Array.isArray(distributorOrders) 
    ? distributorOrders.filter(o => o && o.status && o.status.toLowerCase() === 'dispatched').length 
    : 0;
  const deliveredOrders = Array.isArray(distributorOrders) 
    ? distributorOrders.filter(o => o && o.status && o.status.toLowerCase() === 'delivered').length 
    : 0;
  const paidOrders = Array.isArray(distributorOrders) 
    ? distributorOrders.filter(o => o && o.status && o.status.toLowerCase() === 'paid').length 
    : 0;

  // Revenue calculations with safe defaults
  const totalRevenue = Array.isArray(distributorOrders)
    ? distributorOrders.reduce((sum, order) => {
        if (!order) return sum;
        return sum + (typeof order.price === 'number' ? order.price : 
                     (order.request && typeof order.request.price === 'number' ? order.request.price : 0));
      }, 0)
    : 0;

  const monthlyRevenue = Array.isArray(distributorOrders)
    ? distributorOrders
      .filter(order => {
        if (!order || !order.request || !order.request.createdAt) return false;
        try {
          const orderDate = new Date(order.request.createdAt);
          const currentDate = new Date();
          return orderDate.getMonth() === currentDate.getMonth() &&
                orderDate.getFullYear() === currentDate.getFullYear();
        } catch (e) {
          return false;
        }
      })
      .reduce((sum, order) => {
        if (!order) return sum;
        return sum + (typeof order.price === 'number' ? order.price : 
                     (order.request && typeof order.request.price === 'number' ? order.request.price : 0));
      }, 0)
    : 0;

  // Inventory value with null safety
  const totalInventoryValue = Array.isArray(products) 
    ? products.reduce((sum, p) => {
        if (!p) return sum;
        const retailPrice = typeof p.retail_price === 'number' ? p.retail_price : 0;
        const quantity = typeof p.quantity === 'number' ? p.quantity : 0;
        return sum + (retailPrice * quantity);
      }, 0) 
    : 0;

  // Request metrics with null safety
  const totalRequests = Array.isArray(requests) ? requests.length : 0;
  const pendingRequests = Array.isArray(requests) 
    ? requests.filter(r => r && r.status === 'PENDING').length 
    : 0;
  const approvedRequests = Array.isArray(requests) 
    ? requests.filter(r => r && r.status === 'APPROVED').length 
    : 0;

  // Unique retailers count with null safety
  const uniqueRetailers = new Set(
    Array.isArray(distributorOrders) 
      ? distributorOrders
          .filter(order => order && order.retailer && typeof order.retailer.id !== 'undefined')
          .map(order => order.retailer.id)
      : []
  ).size;

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

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">Active in catalog</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Retailers</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueRetailers}</div>
                <p className="text-xs text-muted-foreground">Ordering from you</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Truck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">{pendingOrders} pending</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
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
                ) : aiInsights ? (
                  <div className="prose prose-sm sm:prose-base text-muted-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {aiInsights}
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

          {/* Secondary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{lowStockProducts}</div>
                <p className="text-xs text-muted-foreground">Need restocking</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{expiringSoonProducts}</div>
                <p className="text-xs text-muted-foreground">Within 30 days</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total worth</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Need review</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Manage your distribution operations efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start brand-gradient text-white">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products ({totalProducts})
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Orders ({totalOrders})
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Review Requests ({pendingRequests})
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Revenue Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Business Alerts
                </CardTitle>
                <CardDescription>
                  Important notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                    <span>Loading alerts...</span>
                  </div>
                ) : (
                  <>
                    {lowStockProducts > 0 && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-sm font-medium">Low Stock Alert</p>
                        <p className="text-xs text-muted-foreground">{lowStockProducts} products below minimum threshold</p>
                      </div>
                    )}

                    {expiringSoonProducts > 0 && (
                      <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <p className="text-sm font-medium">Expiry Alert</p>
                        <p className="text-xs text-muted-foreground">{expiringSoonProducts} products expiring within 30 days</p>
                      </div>
                    )}

                    {pendingRequests > 0 && (
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-sm font-medium">Pending Requests</p>
                        <p className="text-xs text-muted-foreground">{pendingRequests} retailer requests awaiting approval</p>
                      </div>
                    )}

                    {pendingOrders > 0 && (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm font-medium">Orders to Process</p>
                        <p className="text-xs text-muted-foreground">{pendingOrders} orders ready for dispatch</p>
                      </div>
                    )}

                    {lowStockProducts === 0 && expiringSoonProducts === 0 && pendingRequests === 0 && pendingOrders === 0 && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-sm font-medium">All Systems Good!</p>
                        <p className="text-xs text-muted-foreground">No urgent alerts at the moment</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Status Overview */}
          <Card className="feature-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Order Status Overview
              </CardTitle>
              <CardDescription>
                Current status of all orders in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-600">{paidOrders}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Paid
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-600">{dispatchedOrders}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Truck className="h-3 w-3" />
                    Dispatched
                  </div>
                </div>

                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600">{deliveredOrders}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Delivered
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Summary */}
          <Card className="feature-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Revenue Summary
              </CardTitle>
              <CardDescription>
                Financial overview of your distribution business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${monthlyRevenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString() : '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Order Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Analytics Dashboard</h2>
            {isLoading ? (
              <Card className="feature-card">
                <CardContent className="p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading analytics data...</p>
                </CardContent>
              </Card>
            ) : (
              <DistributorDashboardCharts 
                products={products || []} 
                orders={distributorOrders || []} 
                requests={requests || []} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;
