import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Package, Truck, CheckCircle, Clock, CreditCard } from 'lucide-react';
import DistributorNavigation from '@/components/DistributorNavigation';

// Mock data for orders
const initialOrders = [
  {
    id: 'ORD001',
    orderNo: 'ORD-2024-001',
    retailerName: 'TechStore Downtown',
    requestId: 'REQ001',
    productName: 'iPhone 15 Pro Max',
    quantity: 5,
    assignedAgent: 'John Smith',
    agentId: 'DA001',
    status: 'dispatched',
    createdAt: '2024-01-15',
    totalAmount: 5995
  },
  {
    id: 'ORD002',
    orderNo: 'ORD-2024-002',
    retailerName: 'Fashion Hub',
    requestId: 'REQ002',
    productName: 'Cotton Premium T-Shirt',
    quantity: 50,
    assignedAgent: 'Sarah Johnson',
    agentId: 'DA002',
    status: 'delivered',
    createdAt: '2024-01-14',
    totalAmount: 1450
  },
  {
    id: 'ORD003',
    orderNo: 'ORD-2024-003',
    retailerName: 'HealthPlus Pharmacy',
    requestId: 'REQ006',
    productName: 'Vitamin D3 Tablets',
    quantity: 25,
    assignedAgent: 'Mike Wilson',
    agentId: 'DA003',
    status: 'paid',
    createdAt: '2024-01-10',
    totalAmount: 450
  },
  {
    id: 'ORD004',
    orderNo: 'ORD-2024-004',
    retailerName: 'TechStore Downtown',
    requestId: 'REQ005',
    productName: 'Wireless Earbuds Pro',
    quantity: 10,
    assignedAgent: 'Lisa Brown',
    agentId: 'DA004',
    status: 'pending',
    createdAt: '2024-01-11',
    totalAmount: 1990
  },
  {
    id: 'ORD005',
    orderNo: 'ORD-2024-005',
    retailerName: 'MediCare Pharmacy',
    requestId: 'REQ003',
    productName: 'Paracetamol 500mg',
    quantity: 100,
    assignedAgent: 'John Smith',
    agentId: 'DA001',
    status: 'dispatched',
    createdAt: '2024-01-13',
    totalAmount: 1200
  }
];

const DistributorViewOrder = () => {
  const [orders] = useState(initialOrders);

  const handlePrintPDF = () => {
    // Prepare document for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableContent = document.querySelector('.orders-table')?.outerHTML || '';
    const currentDate = new Date().toLocaleDateString();
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const dispatchedOrders = orders.filter(o => o.status === 'dispatched').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Orders Report - Smart Stock</title>
          <style>
            @page { size: A4 landscape; margin: 0.5in; }
            body { font-family: Arial, sans-serif; font-size: 12px; color: black; }
            .print-header { text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #dee2e6; }
            .print-header h1 { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .print-header p { font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: left; }
            th { background: #e9ecef; font-weight: bold; }
            .summary { margin-bottom: 20px; padding: 15px; border: 1px solid #dee2e6; background: #f8f9fa; }
            .badge { display: inline-block; padding: 2px 6px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px; background: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Smart Stock - Orders Report</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          <div class="summary">
            <p><strong>Pending Orders:</strong> ${pendingOrders}</p>
            <p><strong>Dispatched Orders:</strong> ${dispatchedOrders}</p>
            <p><strong>Delivered Orders:</strong> ${deliveredOrders}</p>
            <p><strong>Total Orders:</strong> ${orders.length}</p>
            <p><strong>Total Revenue:</strong> $${totalRevenue.toLocaleString()}</p>
          </div>
          ${tableContent.replace(/class="[^"]*"/g, '')}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'paid': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'dispatched': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'paid': return <CreditCard className="h-3 w-3" />;
      case 'dispatched': return <Truck className="h-3 w-3" />;
      case 'delivered': return <CheckCircle className="h-3 w-3" />;
      default: return <Package className="h-3 w-3" />;
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const dispatchedOrders = orders.filter(o => o.status === 'dispatched').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <DistributorNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
            <p className="text-muted-foreground">Track and manage all your dispatched orders</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Awaiting payment</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dispatched</CardTitle>
                <Truck className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{dispatchedOrders}</div>
                <p className="text-xs text-muted-foreground">In transit</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{deliveredOrders}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All orders</p>
              </CardContent>
            </Card>
          </div>

          {/* Orders Table */}
          <Card className="feature-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Order Tracking</CardTitle>
                  <CardDescription>
                    Monitor the status of all your orders and deliveries
                  </CardDescription>
                </div>
                <Button onClick={handlePrintPDF} variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Print as PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="orders-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Order No</TableHead>
                      <TableHead>Retailer Name</TableHead>
                      <TableHead className="w-[100px]">Request ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="w-[80px]">Quantity</TableHead>
                      <TableHead>Assigned Delivery Agent</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead className="w-[100px]">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow 
                        key={order.id}
                        className="transition-colors hover:bg-accent/50"
                      >
                        <TableCell className="font-medium">{order.orderNo}</TableCell>
                        <TableCell className="font-medium">{order.retailerName}</TableCell>
                        <TableCell className="text-muted-foreground">{order.requestId}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.assignedAgent}</div>
                            <div className="text-xs text-muted-foreground">ID: {order.agentId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.createdAt}</TableCell>
                        <TableCell className="font-medium">${order.totalAmount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DistributorViewOrder;