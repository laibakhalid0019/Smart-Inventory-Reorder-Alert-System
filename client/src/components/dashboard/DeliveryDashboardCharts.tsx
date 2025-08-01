import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Truck,
  CheckCircle,
  Clock,
  Package,
  Calendar,
  TrendingUp,
  MapPin,
  AlertTriangle
} from 'lucide-react';

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#84CC16'];

const DeliveryDashboardCharts = () => {
  // Get delivery orders data from Redux store
  const { orders = [] } = useSelector((state: RootState) => state.deliveryOrders ?? { orders: [] });

  // Delivery Status Distribution chart data
  const deliveryStatusData = React.useMemo(() => {
    if (!Array.isArray(orders)) return [];

    const statusMap = new Map();

    // Count orders by status
    orders.forEach(order => {
      if (!order?.status) return;
      const status = order.status;
      const currentCount = statusMap.get(status) || 0;
      statusMap.set(status, currentCount + 1);
    });

    return Array.from(statusMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      value
    }));
  }, [orders]);

  // Delivery Volume by Day (last 7 days)
  const deliveryVolumeData = React.useMemo(() => {
    if (!Array.isArray(orders)) return [];

    // Get last 7 days
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      days.push(date);
    }

    // Count deliveries by day
    return days.map(day => {
      const dayStr = day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const shortDay = day.toLocaleDateString('en-US', { weekday: 'short' });

      const delivered = orders.filter(order => {
        if (!order?.deliveredAt) return false;
        const deliveredDate = new Date(order.deliveredAt);
        return (
          deliveredDate.getDate() === day.getDate() &&
          deliveredDate.getMonth() === day.getMonth() &&
          deliveredDate.getFullYear() === day.getFullYear()
        );
      }).length;

      const dispatched = orders.filter(order => {
        if (!order?.dispatchedAt) return false;
        const dispatchedDate = new Date(order.dispatchedAt);
        return (
          dispatchedDate.getDate() === day.getDate() &&
          dispatchedDate.getMonth() === day.getMonth() &&
          dispatchedDate.getFullYear() === day.getFullYear() &&
          order.status !== 'DELIVERED'
        );
      }).length;

      return {
        name: shortDay,
        fullDate: dayStr,
        delivered,
        dispatched
      };
    });
  }, [orders]);

  // Delivery Performance (time to deliver)
  const deliveryPerformanceData = React.useMemo(() => {
    if (!Array.isArray(orders)) return [];

    // Only include orders that have both dispatched and delivered times
    const completedOrders = orders.filter(
      order => order?.dispatchedAt && order?.deliveredAt && order.status === 'DELIVERED'
    );

    // Calculate delivery times by retailer (average minutes)
    const retailerMap = new Map();
    const retailerCountMap = new Map();

    completedOrders.forEach(order => {
      if (!order.retailer?.username) return;

      const retailer = order.retailer.username;
      const dispatchTime = new Date(order.dispatchedAt).getTime();
      const deliveryTime = new Date(order.deliveredAt).getTime();
      const minutesToDeliver = Math.round((deliveryTime - dispatchTime) / (1000 * 60));

      const currentTotal = retailerMap.get(retailer) || 0;
      const currentCount = retailerCountMap.get(retailer) || 0;

      retailerMap.set(retailer, currentTotal + minutesToDeliver);
      retailerCountMap.set(retailer, currentCount + 1);
    });

    return Array.from(retailerMap).map(([name, totalMinutes]) => {
      const count = retailerCountMap.get(name) || 1;
      const avgMinutes = Math.round(totalMinutes / count);
      return {
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        fullName: name,
        minutes: avgMinutes
      };
    }).sort((a, b) => b.minutes - a.minutes).slice(0, 8); // Show top 8 for better visibility
  }, [orders]);

  // Retailer Delivery Volume
  const retailerVolumeData = React.useMemo(() => {
    if (!Array.isArray(orders)) return [];

    const retailerMap = new Map();

    orders.forEach(order => {
      if (!order?.retailer?.username) return;
      const retailer = order.retailer.username;
      const currentCount = retailerMap.get(retailer) || 0;
      retailerMap.set(retailer, currentCount + 1);
    });

    return Array.from(retailerMap)
      .map(([name, value]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        fullName: name,
        value
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Show top 8 for better visibility
  }, [orders]);

  return (
    <Tabs defaultValue="delivery-overview" className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-2">
        <TabsTrigger value="delivery-overview">Delivery Overview</TabsTrigger>
        <TabsTrigger value="volume-trends">Volume & Trends</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="retailers">Retailers</TabsTrigger>
      </TabsList>

      {/* Delivery Overview Tab */}
      <TabsContent value="delivery-overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="feature-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Delivery Status Distribution
              </CardTitle>
              <CardDescription>Current status of all deliveries</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deliveryStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deliveryStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Delivery Volume Trends
              </CardTitle>
              <CardDescription>Orders delivered and dispatched (last 7 days)</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deliveryVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, name === 'delivered' ? 'Delivered' : 'Dispatched']}
                      labelFormatter={(label, payload) => {
                        if (payload.length > 0) {
                          return payload[0].payload.fullDate;
                        }
                        return label;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="delivered" name="Delivered" fill="#10B981" />
                    <Bar dataKey="dispatched" name="Dispatched" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Volume & Trends Tab */}
      <TabsContent value="volume-trends" className="space-y-6">
        <Card className="feature-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Monthly Delivery Activity
            </CardTitle>
            <CardDescription>Delivery volume over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={deliveryVolumeData}>
                  <defs>
                    <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDispatched" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    formatter={(value, name) => [value, name === 'delivered' ? 'Delivered' : 'Dispatched']}
                    labelFormatter={(label, payload) => {
                      if (payload.length > 0) {
                        return payload[0].payload.fullDate;
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#10B981" fillOpacity={1} fill="url(#colorDelivered)" />
                  <Area type="monotone" dataKey="dispatched" name="Dispatched" stroke="#F59E0B" fillOpacity={1} fill="url(#colorDispatched)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Performance Tab */}
      <TabsContent value="performance" className="space-y-6">
        <Card className="feature-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Delivery Time by Retailer
            </CardTitle>
            <CardDescription>Average minutes from dispatch to delivery</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={deliveryPerformanceData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip
                    formatter={(value) => [`${value} minutes`, 'Delivery Time']}
                    labelFormatter={(label) => {
                      const item = deliveryPerformanceData.find(item => item.name === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="minutes" name="Avg. Minutes" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Retailers Tab */}
      <TabsContent value="retailers" className="space-y-6">
        <Card className="feature-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Delivery Volume by Retailer
            </CardTitle>
            <CardDescription>Number of deliveries by retailer</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={retailerVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} deliveries`, 'Total']}
                    labelFormatter={(label) => {
                      const item = retailerVolumeData.find(item => item.name === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Deliveries" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {orders.length === 0 && (
        <Alert variant="default" className="mt-4 bg-muted">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No delivery data available</AlertTitle>
          <AlertDescription>
            There are no delivery orders to display charts for. Charts will appear when you have delivery data.
          </AlertDescription>
        </Alert>
      )}
    </Tabs>
  );
};

export default DeliveryDashboardCharts;
