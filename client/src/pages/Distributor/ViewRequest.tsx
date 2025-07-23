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
import { FileText, CheckCircle, XCircle, Clock, CreditCard, Truck } from 'lucide-react';
import DistributorNavigation from '@/components/DistributorNavigation';
import { useToast } from '@/hooks/use-toast';

// Mock data for retailer requests
const initialRequests = [
  {
    id: 'REQ001',
    retailerName: 'TechStore Downtown',
    retailerEmail: 'orders@techstore.com',
    productName: 'iPhone 15 Pro Max',
    quantity: 5,
    requestDate: '2024-01-15',
    status: 'pending',
    paymentStatus: null,
    unitPrice: 1199,
    totalAmount: 5995
  },
  {
    id: 'REQ002',
    retailerName: 'Fashion Hub',
    retailerEmail: 'supply@fashionhub.com',
    productName: 'Cotton Premium T-Shirt',
    quantity: 50,
    requestDate: '2024-01-14',
    status: 'approved',
    paymentStatus: 'paid',
    unitPrice: 29,
    totalAmount: 1450
  },
  {
    id: 'REQ003',
    retailerName: 'MediCare Pharmacy',
    retailerEmail: 'procurement@medicare.com',
    productName: 'Paracetamol 500mg',
    quantity: 100,
    requestDate: '2024-01-13',
    status: 'approved',
    paymentStatus: 'pending',
    unitPrice: 12,
    totalAmount: 1200
  },
  {
    id: 'REQ004',
    retailerName: 'Style Central',
    retailerEmail: 'buying@stylecentral.com',
    productName: 'Denim Jeans Classic',
    quantity: 20,
    requestDate: '2024-01-12',
    status: 'rejected',
    paymentStatus: null,
    unitPrice: 79,
    totalAmount: 1580
  },
  {
    id: 'REQ005',
    retailerName: 'TechStore Downtown',
    retailerEmail: 'orders@techstore.com',
    productName: 'Wireless Earbuds Pro',
    quantity: 10,
    requestDate: '2024-01-11',
    status: 'pending',
    paymentStatus: null,
    unitPrice: 199,
    totalAmount: 1990
  },
  {
    id: 'REQ006',
    retailerName: 'HealthPlus Pharmacy',
    retailerEmail: 'orders@healthplus.com',
    productName: 'Vitamin D3 Tablets',
    quantity: 25,
    requestDate: '2024-01-10',
    status: 'approved',
    paymentStatus: 'paid',
    unitPrice: 18,
    totalAmount: 450
  }
];

const ViewRequest = () => {
  const [requests, setRequests] = useState(initialRequests);
  const { toast } = useToast();

  const handleApprove = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved', paymentStatus: 'pending' }
        : req
    ));
    toast({
      title: "Request Approved",
      description: "The request has been approved and payment is now pending.",
    });
  };

  const handleReject = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected', paymentStatus: null }
        : req
    ));
    toast({
      title: "Request Rejected",
      description: "The request has been rejected.",
      variant: "destructive",
    });
  };

  const handleMarkPaid = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, paymentStatus: 'paid' }
        : req
    ));
    toast({
      title: "Payment Confirmed",
      description: "Payment has been marked as received. Product ready for dispatch.",
    });
  };

  const handleSendToDelivery = (requestId: string) => {
    // In a real app, this would create an order for the delivery agent
    toast({
      title: "Sent to Delivery",
      description: "Order has been sent to delivery agent for dispatch.",
    });
  };

  const handlePrintPDF = () => {
    // Prepare document for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableContent = document.querySelector('.distributor-requests-table')?.outerHTML || '';
    const currentDate = new Date().toLocaleDateString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Retailer Requests Report - Smart Stock</title>
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
            <h1>Smart Stock - Retailer Requests Report</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          <div class="summary">
            <p><strong>Pending Requests:</strong> ${pendingRequests}</p>
            <p><strong>Approved Requests:</strong> ${approvedRequests}</p>
            <p><strong>Total Revenue (Paid):</strong> $${totalRevenue.toLocaleString()}</p>
            <p><strong>Total Requests:</strong> ${requests.length}</p>
          </div>
          ${tableContent.replace(/class="[^"]*"/g, '').replace(/<button[^>]*>.*?<\/button>/g, '').replace(/<div class="flex[^"]*">.*?<\/div>/g, '')}
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
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending').length;
  const approvedRequests = requests.filter(req => req.status === 'approved').length;
  const totalRevenue = requests
    .filter(req => req.paymentStatus === 'paid')
    .reduce((sum, req) => sum + req.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <DistributorNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Retailer Requests</h1>
            <p className="text-muted-foreground">Manage product requests from retailers</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedRequests}</div>
                <p className="text-xs text-muted-foreground">Ready for payment</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue (Paid)</CardTitle>
                <CreditCard className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requests.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
          </div>

          {/* Requests Table */}
          <Card className="feature-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Request Management</CardTitle>
                  <CardDescription>
                    Review and process retailer product requests
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
                <Table className="distributor-requests-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Request ID</TableHead>
                      <TableHead>Retailer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[80px]">Qty</TableHead>
                      <TableHead className="w-[100px]">Amount</TableHead>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[120px]">Payment</TableHead>
                      <TableHead className="w-[200px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.retailerName}</div>
                            <div className="text-xs text-muted-foreground">{request.retailerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{request.productName}</TableCell>
                        <TableCell>{request.quantity}</TableCell>
                        <TableCell className="font-medium">${request.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.paymentStatus ? (
                            <Badge variant="outline" className={getPaymentStatusColor(request.paymentStatus)}>
                              {request.paymentStatus}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(request.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(request.id)}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {request.status === 'approved' && request.paymentStatus === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleMarkPaid(request.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <CreditCard className="h-3 w-3 mr-1" />
                                Mark Paid
                              </Button>
                            )}
                            {request.status === 'approved' && request.paymentStatus === 'paid' && (
                              <Button
                                size="sm"
                                onClick={() => handleSendToDelivery(request.id)}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <Truck className="h-3 w-3 mr-1" />
                                Send to Delivery
                              </Button>
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

export default ViewRequest;