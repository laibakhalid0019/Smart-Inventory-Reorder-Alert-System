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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, CreditCard, Package, Truck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '@/components/StripePaymentForm';
import { RootState } from '@/Redux/Store';
import { fetchOrders, processPayment, updateOrderStatus } from '@/Redux/Store/ordersSlice';
import type { AppDispatch } from '@/Redux/Store';

// Initialize Stripe with your public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || 'your-public-key-here');

// Define payment DTO interface to match the API
interface PaymentDTO {
  amount: number;
  currency: string;
}

// Define the interface for Order data structure from API
interface OrderItem {
  orderId: number;
  orderNumber: string;
  request: {
    requestId: number;
    retailer: {
      id: number;
      username: string;
    };
    distributor: {
      id: number;
      username: string;
    };
    product: {
      id: number;
      name: string;
      category: string;
      retail_price: number;
    };
    quantity: number;
    price: number;
    status: string;
  };
  retailer: {
    id: number;
    username: string;
  };
  distributor: {
    id: number;
    username: string;
  };
  product: {
    id: number;
    name: string;
    category: string;
  };
  quantity: number;
  status: string;
  price: number;
  deliveryAgent?: {
    id: number;
    username: string;
  };
  dispatchedAt?: string;
  deliveredAt?: string;
  paymentTimestamp?: string;
}

const Orders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: orders, loading, error } = useSelector((state: RootState) => state.orders);

  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const { toast } = useToast();

  // Fetch orders from API
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handlePayment = async (order: OrderItem) => {
    try {
      setSelectedOrder(order);
      setProcessing(true);
      
      // Process payment through Redux thunk
      const resultAction = await dispatch(
        processPayment({ orderId: order.orderId, amount: order.price })
      );
      
      console.log('Payment result action:', resultAction); // Debug log

      if (processPayment.fulfilled.match(resultAction)) {
        console.log('Payment response payload:', resultAction.payload); // Debug log
        console.log('Client secret:', resultAction.payload.client_secret); // Debug log

        setClientSecret(resultAction.payload.client_secret); // Fixed: Use client_secret instead of clientSecret
        setPaymentModal(true);
      } else if (processPayment.rejected.match(resultAction) && resultAction.payload) {
        toast({
          variant: 'destructive',
          title: 'Payment initialization failed',
          description: resultAction.payload as string,
        });
      }

    } catch (error: any) {
      console.error('Payment error:', error); // Debug log
      toast({
        variant: 'destructive',
        title: 'Payment initialization failed',
        description: 'Failed to initiate payment process. Please try again.',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedOrder) {
      // Update order status through Redux
      dispatch(updateOrderStatus({
        orderId: selectedOrder.orderId,
        status: 'PAID'
      }));

      toast({
        title: 'Payment successful',
        description: `Payment for order ${selectedOrder.orderNumber} was processed successfully.`,
      });
      
      setPaymentModal(false);
      setSelectedOrder(null);

      // Refresh orders to get updated data from server
      dispatch(fetchOrders());
    }
  };

  const handlePaymentError = (message: string) => {
    toast({
      variant: 'destructive',
      title: 'Payment failed',
      description: message || 'Your payment was not successful, please try again.',
    });
  };

  const handlePrintPDF = () => {
    // Convert orders to CSV content
    const headers = ['Order ID', 'Order Number', 'Distributor', 'Product', 'Quantity', 'Price', 'Status', 'Dispatched At', 'Delivered At'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.orderId,
        order.orderNumber,
        order.distributor.username,
        order.product.name,
        order.quantity,
        order.price,
        order.status,
        order.dispatchedAt ? new Date(order.dispatchedAt).toLocaleDateString() : 'N/A',
        order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'
      ].join(','))
    ].join('\n');

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link and trigger it
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export successful',
      description: 'Your orders have been exported as CSV.',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'PAID':
        return <CreditCard className="h-4 w-4" />;
      case 'DISPATCHED':
        return <Truck className="h-4 w-4" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'default';
      case 'PAID':
        return 'secondary';
      case 'DISPATCHED':
        return 'default';
      case 'DELIVERED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Format date from ISO string
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
            <p className="text-muted-foreground">Track and manage all your orders from distributors</p>
          </div>

          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order History
                </span>
                <Button 
                  onClick={handlePrintPDF} 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={orders.length === 0 || loading}
                >
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </Button>
              </CardTitle>
              <CardDescription>
                All your orders with current status and payment options
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading orders...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  <p>{error}</p>
                  <Button onClick={() => window.location.reload()} className="mt-4">
                    Try Again
                  </Button>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                  <p className="text-muted-foreground">
                    You haven't placed any orders yet. Start by making requests in the Stock Display.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order No</TableHead>
                        <TableHead>Distributor</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="w-[100px]">Quantity</TableHead>
                        <TableHead className="w-[120px]">Price</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[120px]">Dispatch Date</TableHead>
                        <TableHead className="w-[120px]">Delivery Date</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>{order.distributor.username}</TableCell>
                          <TableCell>{order.product.name}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>${order.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={getStatusVariant(order.status) as any}
                              className="flex items-center gap-1"
                            >
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(order.dispatchedAt)}</TableCell>
                          <TableCell>{formatDate(order.deliveredAt)}</TableCell>
                          <TableCell>
                            {order.status.toUpperCase() === 'PENDING' && (
                              <Button
                                onClick={() => handlePayment(order)}
                                size="sm"
                                className="brand-gradient text-white"
                                disabled={processing}
                              >
                                {processing && selectedOrder?.orderId === order.orderId ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    Pay
                                  </>
                                )}
                              </Button>
                            )}
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

      {/* Payment Modal */}
      <Dialog open={paymentModal} onOpenChange={(open) => {
        if (!open) setPaymentModal(false);
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Make Payment
            </DialogTitle>
            <DialogDescription>
              Complete payment for Order {selectedOrder?.orderNumber} - ${selectedOrder?.price.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm 
                  clientSecret={clientSecret}
                  amount={selectedOrder?.price || 0}
                  orderNumber={selectedOrder?.orderNumber || ''}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
