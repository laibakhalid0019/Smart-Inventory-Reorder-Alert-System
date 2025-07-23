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
import { FileText, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

// Mock data for requests
const initialRequests = [
  {
    id: 'REQ001',
    distributorId: 'DIST001',
    distributorName: 'TechMart Distributors',
    product: 'iPhone 15 Pro',
    quantity: 10,
    createdAt: '2024-01-15',
    status: 'Pending'
  },
  {
    id: 'REQ002',
    distributorId: 'DIST003',
    distributorName: 'Fashion Wholesale',
    product: 'Cotton T-Shirt',
    quantity: 25,
    createdAt: '2024-01-14',
    status: 'Accepted'
  },
  {
    id: 'REQ003',
    distributorId: 'DIST005',
    distributorName: 'MedSupply Inc.',
    product: 'Paracetamol 500mg',
    quantity: 50,
    createdAt: '2024-01-13',
    status: 'Rejected'
  },
  {
    id: 'REQ004',
    distributorId: 'DIST002',
    distributorName: 'Digital Supply Co.',
    product: 'Samsung Galaxy S24',
    quantity: 15,
    createdAt: '2024-01-12',
    status: 'Pending'
  },
  {
    id: 'REQ005',
    distributorId: 'DIST004',
    distributorName: 'Style Supply Chain',
    product: 'Denim Jeans',
    quantity: 20,
    createdAt: '2024-01-11',
    status: 'Accepted'
  }
];

const Requests = () => {
  const [requests, setRequests] = useState(initialRequests);

  const handleDelete = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const handlePrintPDF = () => {
    // Prepare document for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableContent = document.querySelector('.requests-table')?.outerHTML || '';
    const currentDate = new Date().toLocaleDateString();
    const pendingCount = requests.filter(req => req.status === 'Pending').length;
    const acceptedCount = requests.filter(req => req.status === 'Accepted').length;
    const rejectedCount = requests.filter(req => req.status === 'Rejected').length;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Requests Report - Smart Stock</title>
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
            <h1>Smart Stock - Requests Report</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          <div class="summary">
            <p><strong>Total Requests:</strong> ${requests.length}</p>
            <p><strong>Pending:</strong> ${pendingCount} | <strong>Accepted:</strong> ${acceptedCount} | <strong>Rejected:</strong> ${rejectedCount}</p>
          </div>
          ${tableContent.replace(/class="[^"]*"/g, '').replace(/<button[^>]*>.*?<\/button>/g, '')}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'default';
      case 'Accepted':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
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
                <Button onClick={handlePrintPDF} variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Print as PDF
                </Button>
              </CardTitle>
              <CardDescription>
                All your requests to distributors with current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="requests-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Request ID</TableHead>
                      <TableHead className="w-[120px]">Distributor ID</TableHead>
                      <TableHead>Distributor Name</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                      <TableHead className="w-[120px]">Created At</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell className="font-medium">{request.distributorId}</TableCell>
                        <TableCell>{request.distributorName}</TableCell>
                        <TableCell>{request.product}</TableCell>
                        <TableCell>{request.quantity}</TableCell>
                        <TableCell>{request.createdAt}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusVariant(request.status)}
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
                            onClick={() => handleDelete(request.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {requests.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Requests Found</h3>
                  <p className="text-muted-foreground">
                    You haven't made any requests yet. Start by browsing products in the Stock Display.
                  </p>
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