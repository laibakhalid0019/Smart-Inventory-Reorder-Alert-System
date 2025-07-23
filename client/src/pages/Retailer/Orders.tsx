import { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, CreditCard, Package, Truck, CheckCircle, Clock } from 'lucide-react';

// Mock data for orders
const initialOrders = [
  {
    id: 'ORD001',
    retailerId: 'RET001',
    distributorId: 'DIST001',
    distributorName: 'TechMart Distributors',
    productName: 'iPhone 15 Pro',
    quantity: 5,
    totalAmount: 4995,
    status: 'Pending'
  },
  {
    id: 'ORD002',
    retailerId: 'RET001',
    distributorId: 'DIST003',
    distributorName: 'Fashion Wholesale',
    productName: 'Cotton T-Shirt',
    quantity: 15,
    totalAmount: 375,
    status: 'Paid'
  },
  {
    id: 'ORD003',
    retailerId: 'RET001',
    distributorId: 'DIST005',
    distributorName: 'MedSupply Inc.',
    productName: 'Paracetamol 500mg',
    quantity: 30,
    totalAmount: 240,
    status: 'Dispatched'
  },
  {
    id: 'ORD004',
    retailerId: 'RET001',
    distributorId: 'DIST002',
    distributorName: 'Digital Supply Co.',
    productName: 'Samsung Galaxy S24',
    quantity: 8,
    totalAmount: 7192,
    status: 'Received'
  },
  {
    id: 'ORD005',
    retailerId: 'RET001',
    distributorId: 'DIST004',
    distributorName: 'Style Supply Chain',
    productName: 'Denim Jeans',
    quantity: 12,
    totalAmount: 780,
    status: 'Pending'
  }
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  const handlePayment = (order: any) => {
    setSelectedOrder(order);
    setPaymentModal(true);
    setPaymentData({ cardNumber: '', expiryDate: '', cvv: '', cardHolder: '' });
  };

  const confirmPayment = () => {
    if (selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: 'Paid' }
          : order
      ));
      setPaymentModal(false);
      setSelectedOrder(null);
    }
  };

  const handlePrintPDF = () => {
    console.log('Generating PDF for orders...');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Paid':
        return <CreditCard className="h-4 w-4" />;
      case 'Dispatched':
        return <Truck className="h-4 w-4" />;
      case 'Received':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'default';
      case 'Paid':
        return 'secondary';
      case 'Dispatched':
        return 'default';
      case 'Received':
        return 'secondary';
      default:
        return 'default';
    }
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
                <Button onClick={handlePrintPDF} variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Print as PDF
                </Button>
              </CardTitle>
              <CardDescription>
                All your orders with current status and payment options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order No</TableHead>
                      <TableHead className="w-[120px]">Retailer ID</TableHead>
                      <TableHead className="w-[120px]">Distributor ID</TableHead>
                      <TableHead>Distributor Name</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                      <TableHead className="w-[120px]">Amount</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.retailerId}</TableCell>
                        <TableCell>{order.distributorId}</TableCell>
                        <TableCell>{order.distributorName}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>${order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusVariant(order.status)}
                            className="flex items-center gap-1"
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.status === 'Pending' && (
                            <Button
                              onClick={() => handlePayment(order)}
                              size="sm"
                              className="brand-gradient text-white"
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pay
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {orders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                  <p className="text-muted-foreground">
                    You haven't placed any orders yet. Start by making requests in the Stock Display.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={paymentModal} onOpenChange={setPaymentModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Make Payment
            </DialogTitle>
            <DialogDescription>
              Complete payment for Order {selectedOrder?.id} - ${selectedOrder?.totalAmount.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="cardHolder">Card Holder Name</Label>
                <Input
                  id="cardHolder"
                  value={paymentData.cardHolder}
                  onChange={(e) => setPaymentData({ ...paymentData, cardHolder: e.target.value })}
                  placeholder="Enter card holder name"
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">
                  ${selectedOrder?.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={confirmPayment} 
                className="flex-1 brand-gradient text-white"
                disabled={!paymentData.cardNumber || !paymentData.cardHolder}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Confirm Payment
              </Button>
              <Button variant="outline" onClick={() => setPaymentModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;