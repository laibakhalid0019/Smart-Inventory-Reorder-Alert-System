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
  AlertTriangle,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Calendar,
  Truck,
  CheckCircle,
  Clock
} from 'lucide-react';

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#84CC16'];

const DistributorDashboardCharts = () => {
  // Get data from Redux store with safe defaults
  const { products = [] } = useSelector((state: RootState) => state.products ?? { products: [] });
  const { distributorOrders = [] } = useSelector((state: RootState) => state.orders ?? { distributorOrders: [] });
  const { requests = [] } = useSelector((state: RootState) => state.distributorRequests ?? { requests: [] });

  // Product Categories Distribution chart data with null checks
  const productCategoriesData = React.useMemo(() => {
    if (!Array.isArray(products)) return [];

    const categoryMap = new Map();
    products.forEach(product => {
      if (!product?.category) return;
      const category = product.category;
      const currentCount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentCount + 1);
    });

    return Array.from(categoryMap).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Inventory Value by Category chart data with null checks
  const inventoryValueData = React.useMemo(() => {
    if (!Array.isArray(products)) return [];

    const categoryMap = new Map();
    products.forEach(product => {
      if (!product?.category || !product?.retail_price || !product?.quantity) return;
      const category = product.category;
      const value = product.retail_price * product.quantity;
      const currentValue = categoryMap.get(category) || 0;
      categoryMap.set(category, currentValue + value);
    });

    return Array.from(categoryMap).map(([name, value]) => ({
      name,
      value: Math.round(value),
      formattedValue: `$${value.toLocaleString()}`
    }));
  }, [products]);

  // Low Stock Products chart data with null checks
  const lowStockData = React.useMemo(() => {
    return products
      ?.filter(product => product?.quantity <= product?.mst)
      ?.map(product => ({
        name: product?.name?.length > 15
          ? product.name.substring(0, 15) + '...'
          : product?.name || 'Unknown',
        current: product?.quantity || 0,
        threshold: product?.mst || 0,
        category: product?.category || 'Unknown'
      }))
      ?.slice(0, 8) || []; // Show top 8 for better visibility
  }, [products]);

  // Products Expiring Soon chart data with null checks
  const expiringSoonData = React.useMemo(() => {
    const today = new Date();
    return (products
      ?.filter(product => {
        if (!product?.expiry_date) return false;
        const expiryDate = new Date(product.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      })
      ?.map(product => {
        const expiryDate = new Date(product.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return {
          name: product?.name?.length > 12
            ? product.name.substring(0, 12) + '...'
            : product?.name || 'Unknown',
          daysLeft: daysUntilExpiry,
          quantity: product?.quantity || 0,
          category: product?.category || 'Unknown'
        };
      })
      ?.sort((a, b) => a.daysLeft - b.daysLeft)
      ?.slice(0, 6)) || [];
  }, [products]);

  // Order Status Distribution chart data with null checks
  const orderStatusData = React.useMemo(() => {
    const statusCounts = distributorOrders?.reduce((acc, order) => {
      if (!order?.status) return acc;
      const status = order.status.toUpperCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [distributorOrders]);

  // Monthly Revenue Trend chart data with null checks
  const monthlyRevenueData = React.useMemo(() => {
    const monthlyData = new Map();

    distributorOrders?.forEach(order => {
      if (!order?.request?.createdAt) return;
      const orderDate = new Date(order.request.createdAt);
      const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
      const monthName = orderDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthName,
          revenue: 0,
          orders: 0,
          date: orderDate
        });
      }

      const existing = monthlyData.get(monthKey);
      existing.revenue += (order?.price || order?.request?.price || 0);
      existing.orders += 1;
    });

    return Array.from(monthlyData.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-6) // Last 6 months
      .map(({ month, revenue, orders }) => ({
        month,
        revenue: Math.round(revenue),
        orders,
        avgOrderValue: orders > 0 ? Math.round(revenue / orders) : 0
      }));
  }, [distributorOrders]);

  // Retailer Activity chart data
  const retailerActivityData = React.useMemo(() => {
    const retailerMap = new Map();

    distributorOrders.forEach(order => {
      const retailerName = order.retailer.username;
      if (!retailerMap.has(retailerName)) {
        retailerMap.set(retailerName, {
          name: retailerName,
          orders: 0,
          revenue: 0
        });
      }

      const existing = retailerMap.get(retailerName);
      existing.orders += 1;
      existing.revenue += (order.price || order.request.price || 0);
    });

    return Array.from(retailerMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8) // Top 8 retailers
      .map(retailer => ({
        ...retailer,
        revenue: Math.round(retailer.revenue),
        avgOrder: Math.round(retailer.revenue / retailer.orders)
      }));
  }, [distributorOrders]);

  // Request Status Distribution chart data
  const requestStatusData = React.useMemo(() => {
    const statusCounts = requests.reduce((acc, request) => {
      const status = request.status.toUpperCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [requests]);

  // Sales Performance by Category
  const salesByCategoryData = React.useMemo(() => {
    const categoryMap = new Map();

    distributorOrders.forEach(order => {
      const category = order.product.category;
      const revenue = order.price || order.request.price || 0;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category,
          revenue: 0,
          quantity: 0,
          orders: 0
        });
      }

      const existing = categoryMap.get(category);
      existing.revenue += revenue;
      existing.quantity += order.quantity;
      existing.orders += 1;
    });

    return Array.from(categoryMap.values())
      .map(item => ({
        ...item,
        revenue: Math.round(item.revenue),
        avgPrice: Math.round(item.revenue / (item.quantity || 1))
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [distributorOrders]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Categories Distribution */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Product Categories
                </CardTitle>
                <CardDescription>Distribution of products by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productCategoriesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productCategoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Order Status
                </CardTitle>
                <CardDescription>Current status of all orders</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Revenue Trend */}
          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Revenue Trend (Last 6 Months)
              </CardTitle>
              <CardDescription>Monthly revenue and order count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                      if (name === 'orders') return [value, 'Orders'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.6}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Value by Category */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Inventory Value by Category
                </CardTitle>
                <CardDescription>Total value of inventory per category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryValueData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                    <Bar dataKey="value" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>Products below minimum threshold</CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={lowStockData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="current" fill="#EF4444" name="Current Stock" />
                      <Bar dataKey="threshold" fill="#F59E0B" name="Min Threshold" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>All Good!</AlertTitle>
                    <AlertDescription>
                      No products are below minimum stock threshold.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Products Expiring Soon */}
          {expiringSoonData.length > 0 && (
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Products Expiring Soon
                </CardTitle>
                <CardDescription>Products expiring within 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expiringSoonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'daysLeft') return [value, 'Days Left'];
                        if (name === 'quantity') return [value, 'Quantity'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="daysLeft" fill="#F59E0B" name="Days Left" />
                    <Bar dataKey="quantity" fill="#EC4899" name="Quantity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales by Category */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  Sales by Category
                </CardTitle>
                <CardDescription>Revenue performance by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesByCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue" />
                    <Bar dataKey="orders" fill="#06B6D4" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Retailers */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Top Retailers
                </CardTitle>
                <CardDescription>Best performing retail partners</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={retailerActivityData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Status Distribution */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Request Status
                </CardTitle>
                <CardDescription>Status of retailer requests</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={requestStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {requestStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Operational Metrics */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Key Metrics
                </CardTitle>
                <CardDescription>Important operational indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round((distributorOrders.filter(o => o.status.toLowerCase() === 'delivered').length / (distributorOrders.length || 1)) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Delivery Rate</div>
                  </div>

                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {new Set(distributorOrders.map(o => o.retailer.id)).size}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Retailers</div>
                  </div>

                  <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${distributorOrders.length > 0 ? Math.round(distributorOrders.reduce((sum, o) => sum + (o.price || o.request.price || 0), 0) / distributorOrders.length).toLocaleString() : '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Order Value</div>
                  </div>

                  <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {requests.filter(r => r.status === 'PENDING').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending Requests</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistributorDashboardCharts;
