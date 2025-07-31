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
  ResponsiveContainer
} from 'recharts';
import { AlertTriangle, TrendingUp, Package, DollarSign } from 'lucide-react';

const COLORS = ['#00FFFF', '#FF00FF', '#00FF00', '#FFFF00', '#FE01B1', '#0AFF0A'];

const RetailerDashboardCharts = () => {
  // Get data from Redux store
  const { items: stock } = useSelector((state: RootState) => state.stock);
  const { items: orders } = useSelector((state: RootState) => state.orders);
  const { items: requests } = useSelector((state: RootState) => state.requests);

  // Stock Level by Category chart data
  const stockByCategoryData = React.useMemo(() => {
    const categoryMap = new Map();

    stock.forEach(item => {
      const category = item.product.category;
      const currentValue = categoryMap.get(category) || 0;
      categoryMap.set(category, currentValue + item.quantity);
    });

    return Array.from(categoryMap).map(([name, value]) => ({ name, value }));
  }, [stock]);

  // Low Stock Items chart data
  const lowStockData = React.useMemo(() => {
    return stock
      .filter(item => item.quantity <= item.min_threshold)
      .map(item => ({
        name: item.product.name.length > 15
          ? item.product.name.substring(0, 15) + '...'
          : item.product.name,
        quantity: item.quantity,
        threshold: item.min_threshold
      }))
      .slice(0, 5); // Just show top 5 for clarity
  }, [stock]);

  // Order Status Distribution chart data
  const orderStatusData = React.useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status.toUpperCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Monthly Order Trend chart data
  const monthlyOrderData = React.useMemo(() => {
    const monthlyCounts = orders.reduce((acc, order) => {
      // Use created date or delivered date depending on what's available
      const date = order.deliveredAt || order.dispatchedAt || new Date().toISOString();
      const month = new Date(date).toLocaleString('default', { month: 'short' });

      if (!acc[month]) {
        acc[month] = { month, count: 0, value: 0 };
      }

      acc[month].count += 1;
      acc[month].value += order.price;

      return acc;
    }, {} as Record<string, { month: string; count: number; value: number }>);

    return Object.values(monthlyCounts);
  }, [orders]);

  // Request Status Distribution chart data
  const requestStatusData = React.useMemo(() => {
    const statusCounts = requests.reduce((acc, request) => {
      const status = request.status.toUpperCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [requests]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Low Stock Alert */}
          {lowStockData.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Low Stock Alert</AlertTitle>
              <AlertDescription>
                You have {lowStockData.length} items below minimum stock threshold.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stock by Category Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Stock by Category
                </CardTitle>
                <CardDescription>Distribution of inventory across categories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockByCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stockByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Low Stock Items Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Low Stock Items
                </CardTitle>
                <CardDescription>Items below minimum threshold</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={lowStockData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="#FF8042" name="Current Stock" />
                    <Bar dataKey="threshold" fill="#0088FE" name="Min Threshold" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Status Distribution */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order Status
                </CardTitle>
                <CardDescription>Distribution of orders by status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Order Trend */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Monthly Order Trend
                </CardTitle>
                <CardDescription>Order volume by month</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyOrderData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="count" stroke="#8884d8" name="Order Count" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="value" stroke="#82ca9d" name="Order Value ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Request Status Distribution */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Request Status
                </CardTitle>
                <CardDescription>Distribution of requests by status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={requestStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {requestStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} requests`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Request by Product Category */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Requests by Category
                </CardTitle>
                <CardDescription>Distribution of requests by product category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={requests.reduce((acc, request) => {
                      const category = request.product.category;
                      const existingCategory = acc.find(item => item.name === category);

                      if (existingCategory) {
                        existingCategory.value += 1;
                      } else {
                        acc.push({ name: category, value: 1 });
                      }

                      return acc;
                    }, [] as { name: string; value: number }[])}
                    margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} requests`, 'Count']} />
                    <Legend />
                    <Bar dataKey="value" name="Request Count">
                      {requests.reduce((acc, request) => {
                        const category = request.product.category;
                        const existingCategory = acc.find(item => item.name === category);

                        if (existingCategory) {
                          existingCategory.value += 1;
                        } else {
                          acc.push({ name: category, value: 1 });
                        }

                        return acc;
                      }, [] as { name: string; value: number }[]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RetailerDashboardCharts;
