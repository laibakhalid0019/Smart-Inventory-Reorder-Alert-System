import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RetailerNavigation from '@/components/RetailerNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Trash2, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/Redux/Store';
import { fetchRequests, deleteRequest } from '@/Redux/Store/requestsSlice';
import type { AppDispatch } from '@/Redux/Store';

const Requests = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: requests, loading, error } = useSelector((state: RootState) => state.requests);
  const { toast } = useToast();

  // Fetch requests data using Redux
  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    try {
      // Use the Redux action to delete a request
      const resultAction = await dispatch(deleteRequest(id));

      if (deleteRequest.fulfilled.match(resultAction)) {
        toast({
          title: 'Success',
          description: 'Request deleted successfully',
        });
      } else if (deleteRequest.rejected.match(resultAction) && resultAction.payload) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: resultAction.payload as string,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete request.',
      });
      console.error('Error deleting request:', error);
    }
  };

  const handlePrintPDF = () => {
    // Convert requests to CSV content
    const headers = ['Request ID', 'Distributor', 'Product', 'Quantity', 'Price', 'Created At', 'Status'];
    const csvContent = [
      headers.join(','),
      ...requests.map(request => [
        request.requestId,
        request.distributor.username,
        request.product.name,
        request.quantity,
        request.price,
        new Date(request.createdAt).toLocaleDateString(),
        request.status
      ].join(','))
    ].join('\n');

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link and trigger it
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `requests_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export successful',
      description: 'Your requests have been exported as CSV.',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'default';
      case 'ACCEPTED':
        return 'secondary';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <RetailerNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Requests Management</h1>
            <p className="text-muted-foreground">Track and manage your inventory requests to distributors</p>
          </div>

          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Request History
                </span>
                <Button
                  onClick={handlePrintPDF}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={requests.length === 0 || loading}
                >
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </Button>
              </CardTitle>
              <CardDescription>
                All your requests to distributors with current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading requests...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  <p>{error}</p>
                  <Button onClick={() => dispatch(fetchRequests())} className="mt-4">
                    Try Again
                  </Button>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No requests found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Request ID</TableHead>
                        <TableHead>Distributor</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="w-[100px]">Quantity</TableHead>
                        <TableHead className="w-[100px]">Price</TableHead>
                        <TableHead className="w-[120px]">Created At</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.requestId}>
                          <TableCell className="font-medium">{request.requestId}</TableCell>
                          <TableCell>{request.distributor.username}</TableCell>
                          <TableCell>{request.product.name}</TableCell>
                          <TableCell>{request.quantity}</TableCell>
                          <TableCell>${request.price?.toFixed(2)}</TableCell>
                          <TableCell>{formatDate(request.createdAt)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusVariant(request.status) as any}
                              className="flex items-center gap-1"
                            >
                              {getStatusIcon(request.status)}
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(request.requestId)}
                              disabled={request.status.toUpperCase() === 'ACCEPTED'}
                              className={`${
                                request.status.toUpperCase() === 'ACCEPTED' 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'text-destructive hover:text-destructive hover:bg-destructive/10'
                              }`}
                              title={
                                request.status.toUpperCase() === 'ACCEPTED'
                                  ? 'Cannot delete accepted requests'
                                  : 'Delete request'
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
    </div>
  );
};

export default Requests;
