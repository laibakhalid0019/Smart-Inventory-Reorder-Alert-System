import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, MapPin, Clock, CheckCircle, BarChart3, Route, Loader2, Sparkles } from 'lucide-react';
import DeliveryNavigation from '@/components/DeliveryNavigation';
import DeliveryDashboardCharts from '@/components/dashboard/DeliveryDashboardCharts';
import { RootState, AppDispatch } from '@/Redux/Store';
import { fetchDeliveryOrders } from '@/Redux/Store/deliveryOrdersSlice';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getGeminiInsights } from '@/lib/geminiApi';

const DeliveryDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Get delivery orders data from Redux
  const { orders = [], loading = false, error = null } = useSelector((state: RootState) => state.deliveryOrders ?? { orders: [], loading: false, error: null });

  // Fetch delivery orders when component mounts
  useEffect(() => {
    dispatch(fetchDeliveryOrders())
      .unwrap()
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to load delivery data. Please try again.",
          variant: "destructive",
        });
      });
  }, [dispatch, toast]);

  // Fetch AI insights when data is loaded
  useEffect(() => {
    const shouldFetchInsights = !loadingInsights && !loading && orders.length > 0 && !aiInsights;

    if (shouldFetchInsights) {
      setLoadingInsights(true);

      const fetchInsights = async () => {
        try {
          console.log("Fetching Gemini insights for delivery dashboard...");
          const result = await getGeminiInsights('delivery');
          if (result.success) {
            console.log("Successfully received delivery insights");
            setAiInsights(result.insights);
          } else {
            console.error("Failed to get delivery AI insights:", result.error);
            setAiInsights("Unable to generate delivery insights at this time.");
          }
        } catch (error) {
          console.error("Error fetching delivery AI insights:", error);
          setAiInsights("An error occurred while generating delivery insights.");
        } finally {
          setLoadingInsights(false);
        }
      };

      fetchInsights();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, orders.length]);

  // Calculate metrics from the orders data
  const totalOrders = Array.isArray(orders) ? orders.length : 0;
  const acceptedOrders = Array.isArray(orders) ? orders.filter(o => o?.status === 'ACCEPTED').length : 0;
  const dispatchedOrders = Array.isArray(orders) ? orders.filter(o => o?.status === 'DISPATCHED').length : 0;
  const deliveredOrders = Array.isArray(orders) ? orders.filter(o => o?.status === 'DELIVERED').length : 0;

  // Calculate today's orders
  const todayOrders = Array.isArray(orders) ? orders.filter(order => {
    if (!order?.dispatchedAt && !order?.deliveredAt) return false;
    const today = new Date();
    const dispatchDate = order.dispatchedAt ? new Date(order.dispatchedAt) : null;
    const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : null;

    const isToday = (date: Date) => {
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    };

    return (dispatchDate && isToday(dispatchDate)) || (deliveryDate && isToday(deliveryDate));
  }).length : 0;

  // Calculate completion rate (percentage of delivered out of total non-pending orders)
  const nonPendingOrders = Array.isArray(orders) ? orders.filter(o => o?.status !== 'PENDING').length : 0;
  const completionRate = nonPendingOrders > 0
    ? Math.round((deliveredOrders / nonPendingOrders) * 100)
    : 0;

  // Calculate average delivery time (in minutes)
  const deliveryTimes = Array.isArray(orders)
    ? orders
        .filter(order => order?.dispatchedAt && order?.deliveredAt)
        .map(order => {
          const dispatchTime = new Date(order.dispatchedAt).getTime();
          const deliveryTime = new Date(order.deliveredAt).getTime();
          return Math.round((deliveryTime - dispatchTime) / (1000 * 60)); // convert to minutes
        })
    : [];

  const averageDeliveryTime = deliveryTimes.length > 0
    ? Math.round(deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
        <DeliveryNavigation />
        <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2 text-muted-foreground">Loading delivery data...</p>
          </div>
        </div>
      </div>
    );
  }

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
                      <p className="text-xs text-muted-foreground">Try completing more deliveries</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {deliveredOrders} completed, {acceptedOrders + dispatchedOrders} in progress
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
                <MapPin className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{dispatchedOrders}</div>
                <p className="text-xs text-muted-foreground">En route to retailers</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <p className="text-xs text-muted-foreground">Overall success rate</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Time</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageDeliveryTime} min</div>
                <p className="text-xs text-muted-foreground">Per delivery</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="mb-8">
            <DeliveryDashboardCharts />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                <Button
                  className="w-full justify-start brand-gradient text-white"
                  onClick={() => window.location.href = '/delivery/view-order'}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Manage Deliveries
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Current Route
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
                  Delivery Overview
                </CardTitle>
                <CardDescription>
                  Summary of your delivery activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Orders</span>
                    <span className="font-bold">{totalOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Ready for Pickup</span>
                    <span className="font-bold">{acceptedOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">In Transit</span>
                    <span className="font-bold">{dispatchedOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Delivered</span>
                    <span className="font-bold">{deliveredOrders}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="font-bold text-green-600">{completionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;

