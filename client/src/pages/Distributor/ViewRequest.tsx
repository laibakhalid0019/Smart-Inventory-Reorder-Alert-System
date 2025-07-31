import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, XCircle, Clock, CreditCard, Truck, Users, Loader2, Eye } from 'lucide-react';
import DistributorNavigation from '@/components/DistributorNavigation';
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/Redux/Store';
import {
  fetchDistributorRequests,
  updateRequestStatus,
  generateOrder,
  fetchDeliveryAgents,
  DistributorRequest,
  DeliveryAgent
} from '@/Redux/Store/distributorRequestsSlice';

const ViewRequest = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: requests, deliveryAgents, loading, error } = useSelector((state: RootState) => state.distributorRequests);

  const [selectedRequest, setSelectedRequest] = useState<DistributorRequest | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [generatedOrders, setGeneratedOrders] = useState<number[]>([]); // Track requests with generated orders
  const { toast } = useToast();

  // Fetch requests and delivery agents when component mounts
  useEffect(() => {
    dispatch(fetchDistributorRequests());
    fetchAgents();
  }, [dispatch]);

  const fetchAgents = async () => {
    setLoadingAgents(true);
    try {
      await dispatch(fetchDeliveryAgents()).unwrap();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load delivery agents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingAgents(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    try {
      await dispatch(updateRequestStatus({ requestId, status: 'ACCEPTED' })).unwrap();
      toast({
        title: "Request Approved",
        description: "The request has been approved and payment is now pending.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve the request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await dispatch(updateRequestStatus({ requestId, status: 'REJECTED' })).unwrap();
      toast({
        title: "Request Rejected",
        description: "The request has been rejected.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateOrder = (request: DistributorRequest) => {
    setSelectedRequest(request);
    setShowDeliveryModal(true);

    // Refresh delivery agents when modal opens
    if (deliveryAgents.length === 0) {
      fetchAgents();
    }
  };

  const handleViewOrders = () => {
    navigate('/distributor/orders');
  };

  const handleSelectDeliveryAgent = async (agent: DeliveryAgent) => {
    if (!selectedRequest) return;

    setProcessingOrder(true);
    try {
      await dispatch(generateOrder({
        requestId: selectedRequest.requestId,
        deliveryAgent: agent.username
      })).unwrap();

      // Add to generated orders list
      setGeneratedOrders(prev => [...prev, selectedRequest.requestId]);

      toast({
        title: "Order Generated",
        description: `Order successfully generated and assigned to ${agent.username}`,
      });

      // Refresh the requests list to get the updated statuses
      dispatch(fetchDistributorRequests());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingOrder(false);
      setShowDeliveryModal(false);
      setSelectedRequest(null);
    }
  };

  // Helper function to format date from ISO string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Helper function for payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Helper function to export CSV
  const handleExportCSV = () => {
    // Define CSV headers
    const headers = ['Request ID', 'Retailer', 'Email', 'Product', 'Quantity', 'Price', 'Date', 'Status'];

    // Map requests to CSV rows
    const rows = requests.map(request => [
      `#${request.requestId}`,
      request.retailer.username,
      request.retailer.email,
      request.product.name,
      request.quantity.toString(),
      request.price.toFixed(2),
      formatDate(request.createdAt),
      request.status
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `requests_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    // Append to document, trigger download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Exported",
      description: "Requests data has been exported as CSV file",
    });
  };

  const pendingRequests = requests.filter(req => req.status === 'PENDING').length;
  const approvedRequests = requests.filter(req => req.status === 'ACCEPTED').length;
  const totalRevenue = requests
    .filter(req => req.status === 'ACCEPTED')
    .reduce((sum, req) => sum + req.price * req.quantity, 0);

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
                <CardTitle className="text-sm font-medium">Revenue (Approved)</CardTitle>
                <CreditCard className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total value</p>
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
                <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading requests...</span>
                </div>
              ) : error ? (
                <div className="bg-destructive/20 border border-destructive/30 p-4 rounded-md text-destructive text-center">
                  {error}
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No requests found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="distributor-requests-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Request ID</TableHead>
                        <TableHead>Retailer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="w-[80px]">Qty</TableHead>
                        <TableHead className="w-[100px]">Price</TableHead>
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[200px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.requestId}>
                          <TableCell className="font-medium">#{request.requestId}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.retailer.username}</div>
                              <div className="text-xs text-muted-foreground">{request.retailer.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{request.product.name}</TableCell>
                          <TableCell>{request.quantity}</TableCell>
                          <TableCell className="font-medium">${request.price.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(request.createdAt)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(request.status)}>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {request.status === 'PENDING' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprove(request.requestId)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(request.requestId)}
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {request.status === 'ACCEPTED' && !generatedOrders.includes(request.requestId) && (
                                <Button
                                  size="sm"
                                  onClick={() => handleGenerateOrder(request)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white transition-all hover:scale-105"
                                >
                                  <Truck className="h-3 w-3 mr-1" />
                                  Generate Order
                                </Button>
                              )}
                              {request.status === 'ACCEPTED' && generatedOrders.includes(request.requestId) && (
                                <Button
                                  size="sm"
                                  onClick={handleViewOrders}
                                  className="bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Order
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delivery Agent Selection Modal */}
      <Dialog open={showDeliveryModal} onOpenChange={(open) => !processingOrder && setShowDeliveryModal(open)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select Delivery Agent</DialogTitle>
            <DialogDescription>
              Choose a delivery agent to dispatch the order to.
            </DialogDescription>
          </DialogHeader>
          {processingOrder ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Generating order, please wait...</p>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              {deliveryAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
                  onClick={() => handleSelectDeliveryAgent(agent)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">{agent.email}</p>
                        <p className="text-xs text-muted-foreground">ID: {agent.id}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewRequest;
