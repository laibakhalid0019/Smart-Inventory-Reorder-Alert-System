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
import { FileText, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import DeliveryNavigation from '@/components/DeliveryNavigation';
import { useToast } from '@/hooks/use-toast';

// Mock data for delivery orders
const initialOrders = [
  {
    id: 'ORD001',
    orderNo: 'SMRT-2024-001',
    retailerName: 'TechStore Downtown',
    retailerAddress: '123 Main St, Downtown',
    distributorName: 'TechMart Distributors',
    productName: 'iPhone 15 Pro Max',
    quantity: 5,
    orderDate: '2024-01-15',
    status: 'ready_for_pickup',
    estimatedDelivery: '2024-01-17',
    dispatchedAt: null,
    deliveredAt: null
  },
  {
    id: 'ORD002',
    orderNo: 'SMRT-2024-002',
    retailerName: 'Fashion Hub',
    retailerAddress: '456 Style Ave, Central',
    distributorName: 'Fashion Wholesale',
    productName: 'Cotton Premium T-Shirt',
    quantity: 50,
    orderDate: '2024-01-14',
    status: 'picked',
    estimatedDelivery: '2024-01-16',
    dispatchedAt: null,
    deliveredAt: null
  },
  {
    id: 'ORD003',
    orderNo: 'SMRT-2024-003',
    retailerName: 'MediCare Pharmacy',
    retailerAddress: '789 Health Blvd, Eastside',
    distributorName: 'MedSupply Inc.',
    productName: 'Paracetamol 500mg',
    quantity: 100,
    orderDate: '2024-01-13',
    status: 'dispatched',
    estimatedDelivery: '2024-01-15',
    dispatchedAt: '2024-01-14T10:30:00',
    deliveredAt: null
  },
  {
    id: 'ORD004',
    orderNo: 'SMRT-2024-004',
    retailerName: 'HealthPlus Pharmacy',
    retailerAddress: '321 Wellness St, Northside',
    distributorName: 'PharmaCare Distributors',
    productName: 'Vitamin D3 Tablets',
    quantity: 25,
    orderDate: '2024-01-12',
    status: 'delivered',
    estimatedDelivery: '2024-01-14',
    dispatchedAt: '2024-01-13T09:15:00',
    deliveredAt: '2024-01-14T14:22:00'
  },
  {
    id: 'ORD005',
    orderNo: 'SMRT-2024-005',
    retailerName: 'TechStore Downtown',
    retailerAddress: '123 Main St, Downtown',
    distributorName: 'Digital Supply Co.',
    productName: 'Wireless Earbuds Pro',
    quantity: 10,
    orderDate: '2024-01-11',
    status: 'ready_for_pickup',
    estimatedDelivery: '2024-01-16',
    dispatchedAt: null,
    deliveredAt: null
  },
  {
    id: 'ORD006',
    orderNo: 'SMRT-2024-006',
    retailerName: 'Style Central',
    retailerAddress: '654 Fashion Row, Westside',
    distributorName: 'Fashion Wholesale',
    productName: 'Denim Jeans Classic',
    quantity: 20,
    orderDate: '2024-01-10',
    status: 'picked',
    estimatedDelivery: '2024-01-15',
    dispatchedAt: null,
    deliveredAt: null
  }
];

const ViewOrder = () => {
  const [orders, setOrders] = useState(initialOrders);
  const { toast } = useToast();

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    const currentTime = new Date().toISOString();
    
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus,
            dispatchedAt: newStatus === 'dispatched' ? currentTime : order.dispatchedAt,
            deliveredAt: newStatus === 'delivered' ? currentTime : order.deliveredAt
          }
        : order
    ));
    
    const statusMessages = {
      'picked': 'Order marked as picked up from distributor',
      'dispatched': 'Order dispatched for delivery',
      'delivered': 'Order successfully delivered to retailer'
    };
    
    toast({
      title: "Status Updated",
      description: statusMessages[newStatus as keyof typeof statusMessages],
    });
  };

  const handlePrintPDF = () => {
    // Prepare document for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableContent = document.querySelector('.delivery-orders-table')?.outerHTML || '';
    const currentDate = new Date().toLocaleDateString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Delivery Orders Report - Smart Stock</title>
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
            <h1>Smart Stock - Delivery Orders Report</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          <div class="summary">
            <p><strong>Ready for Pickup:</strong> ${readyForPickup}</p>
            <p><strong>In Transit:</strong> ${inTransit}</p>
            <p><strong>Delivered:</strong> ${delivered}</p>
            <p><strong>Total Orders:</strong> ${orders.length}</p>
          </div>
          ${tableContent.replace(/class="[^"]*"/g, '').replace(/<button[^>]*>.*?<\/button>/g, '').replace(/<div class="flex[^"]*">.*?<\/div>/g, '').replace(/<span class="text[^"]*">.*?<\/span>/g, 'Complete')}
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
      case 'ready_for_pickup': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'picked': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'dispatched': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const readyForPickup = orders.filter(order => order.status === 'ready_for_pickup').length;
  const inTransit = orders.filter(order => ['picked', 'dispatched'].includes(order.status)).length;
  const delivered = orders.filter(order => order.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <DeliveryNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Delivery Orders</h1>
            <p className="text-muted-foreground">Manage product deliveries from distributors to retailers</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
                <Package className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{readyForPickup}</div>
                <p className="text-xs text-muted-foreground">Awaiting collection</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                <Truck className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{inTransit}</div>
                <p className="text-xs text-muted-foreground">On the way</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{delivered}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">This period</p>
              </CardContent>
            </Card>
          </div>

          {/* Orders Table */}
          <Card className="feature-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>
                    Track and update delivery status of orders
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
                <Table className="delivery-orders-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Order No</TableHead>
                      <TableHead>Retailer</TableHead>
                      <TableHead>Distributor</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[60px]">Qty</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[140px]">Dispatch At</TableHead>
                      <TableHead className="w-[140px]">Delivered At</TableHead>
                      <TableHead className="w-[200px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNo}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.retailerName}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {order.retailerAddress}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{order.distributorName}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {formatStatus(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDateTime(order.dispatchedAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDateTime(order.deliveredAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {order.status === 'ready_for_pickup' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, 'picked')}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                              >
                                <Package className="h-3 w-3 mr-1" />
                                Pick Up
                              </Button>
                            )}
                            {order.status === 'picked' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, 'dispatched')}
                                className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                              >
                                <Truck className="h-3 w-3 mr-1" />
                                Dispatch
                              </Button>
                            )}
                            {order.status === 'dispatched' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Deliver
                              </Button>
                            )}
                            {order.status === 'delivered' && (
                              <span className="text-green-600 text-sm font-medium flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Complete
                              </span>
                            )}
                          </div>
                        </TableCell>
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

export default ViewOrder;