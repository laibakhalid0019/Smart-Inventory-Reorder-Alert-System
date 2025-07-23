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
import { Package, Calendar, AlertTriangle, DollarSign, FileText } from 'lucide-react';
import DistributorNavigation from '@/components/DistributorNavigation';

// Mock data for distributor products
const distributorProducts = [
  {
    id: 'PROD001',
    name: 'iPhone 15 Pro Max',
    category: 'Electronics',
    quantity: 45,
    minThreshold: 10,
    expiryDate: '2025-12-31',
    price: 1199,
  },
  {
    id: 'PROD002',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    quantity: 32,
    minThreshold: 8,
    expiryDate: '2025-08-15',
    price: 1299,
  },
  {
    id: 'PROD003',
    name: 'MacBook Pro M3',
    category: 'Electronics',
    quantity: 15,
    minThreshold: 5,
    expiryDate: '2025-06-30',
    price: 1999,
  },
  {
    id: 'PROD004',
    name: 'Cotton Premium T-Shirt',
    category: 'Clothes',
    quantity: 120,
    minThreshold: 25,
    expiryDate: '2026-01-31',
    price: 29,
  },
  {
    id: 'PROD005',
    name: 'Denim Jeans Classic',
    category: 'Clothes',
    quantity: 8,
    minThreshold: 15,
    expiryDate: '2026-03-15',
    price: 79,
  },
  {
    id: 'PROD006',
    name: 'Paracetamol 500mg',
    category: 'Medicine',
    quantity: 200,
    minThreshold: 50,
    expiryDate: '2024-09-30',
    price: 12,
  },
  {
    id: 'PROD007',
    name: 'Vitamin D3 Tablets',
    category: 'Medicine',
    quantity: 3,
    minThreshold: 20,
    expiryDate: '2024-11-15',
    price: 18,
  },
  {
    id: 'PROD008',
    name: 'Wireless Earbuds Pro',
    category: 'Electronics',
    quantity: 25,
    minThreshold: 10,
    expiryDate: '2025-10-20',
    price: 199,
  }
];

const ViewProduct = () => {
  const [products] = useState(distributorProducts);

  const isLowStock = (quantity: number, threshold: number) => {
    return quantity <= threshold;
  };

  const isExpired = (date: string) => {
    const today = new Date();
    const expiryDate = new Date(date);
    return expiryDate <= today;
  };

  const isExpiringSoon = (date: string) => {
    const today = new Date();
    const expiryDate = new Date(date);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const handlePrintPDF = () => {
    // Prepare document for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableContent = document.querySelector('.products-table')?.outerHTML || '';
    const currentDate = new Date().toLocaleDateString();
    const lowStockCount = products.filter(p => isLowStock(p.quantity, p.minThreshold)).length;
    const expiringSoonCount = products.filter(p => isExpiringSoon(p.expiryDate)).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Product Inventory Report - Smart Stock</title>
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
            <h1>Smart Stock - Product Inventory Report</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          <div class="summary">
            <p><strong>Total Products:</strong> ${products.length}</p>
            <p><strong>Low Stock Items:</strong> ${lowStockCount}</p>
            <p><strong>Expiring Soon:</strong> ${expiringSoonCount}</p>
            <p><strong>Total Inventory Value:</strong> $${totalValue.toLocaleString()}</p>
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Electronics': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Clothes': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medicine': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { text: 'Out of Stock', variant: 'destructive' as const };
    if (quantity <= threshold) return { text: 'Low Stock', variant: 'destructive' as const };
    return { text: 'In Stock', variant: 'secondary' as const };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <DistributorNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Product Inventory</h1>
            <p className="text-muted-foreground">Manage your product catalog and inventory levels</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">Active in catalog</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {products.filter(p => isLowStock(p.quantity, p.minThreshold)).length}
                </div>
                <p className="text-xs text-muted-foreground">Need restocking</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {products.filter(p => isExpiringSoon(p.expiryDate)).length}
                </div>
                <p className="text-xs text-muted-foreground">Within 30 days</p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Inventory worth</p>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card className="feature-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Product Catalog</CardTitle>
                  <CardDescription>
                    Manage your product inventory and track stock levels
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
                <Table className="products-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Product ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="w-[120px]">Category</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                      <TableHead className="w-[120px]">Min Threshold</TableHead>
                      <TableHead className="w-[120px]">Expiry Date</TableHead>
                      <TableHead className="w-[100px]">Price</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const lowStock = isLowStock(product.quantity, product.minThreshold);
                      const expired = isExpired(product.expiryDate);
                      const expiringSoon = isExpiringSoon(product.expiryDate);
                      const stockStatus = getStockStatus(product.quantity, product.minThreshold);
                      
                      return (
                        <TableRow 
                          key={product.id}
                          className={`${lowStock || expired ? 'bg-destructive/10 border-destructive/30' : 
                                     expiringSoon ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800/30' : ''}`}
                        >
                          <TableCell className="font-medium">{product.id}</TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getCategoryColor(product.category)}>
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${lowStock ? 'text-destructive' : ''}`}>
                                {product.quantity}
                              </span>
                              {lowStock && <AlertTriangle className="h-4 w-4 text-destructive" />}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{product.minThreshold}</TableCell>
                          <TableCell>
                            <span 
                              className={`px-2 py-1 rounded text-sm ${
                                expired
                                  ? 'bg-destructive/20 text-destructive' 
                                  : expiringSoon
                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300'
                                    : 'bg-secondary text-secondary-foreground'
                              }`}
                            >
                              {product.expiryDate}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">${product.price}</TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.text}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

export default ViewProduct;