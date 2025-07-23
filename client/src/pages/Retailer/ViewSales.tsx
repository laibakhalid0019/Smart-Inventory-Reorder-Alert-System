import RetailerNavigation from '@/components/RetailerNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, DollarSign, Package, FileText } from 'lucide-react';

// Sample sales data - 6 entries as requested
const salesData = [
  { id: 'SAL001', productName: 'iPhone 15 Pro', quantity: 2, date: '2024-01-15', price: 1998, distributorName: 'TechMart Distributors' },
  { id: 'SAL002', productName: 'Cotton T-Shirt', quantity: 5, date: '2024-01-14', price: 125, distributorName: 'Fashion Wholesale' },
  { id: 'SAL003', productName: 'Samsung Galaxy S24', quantity: 1, date: '2024-01-13', price: 899, distributorName: 'Digital Supply Co.' },
  { id: 'SAL004', productName: 'Paracetamol 500mg', quantity: 10, date: '2024-01-12', price: 80, distributorName: 'MedSupply Inc.' },
  { id: 'SAL005', productName: 'Denim Jeans', quantity: 3, date: '2024-01-11', price: 195, distributorName: 'Style Supply Chain' },
  { id: 'SAL006', productName: 'MacBook Air M3', quantity: 1, date: '2024-01-10', price: 1299, distributorName: 'TechMart Distributors' }
];

const ViewSales = () => {
  const handlePrintPDF = () => {
    // Prepare document for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableContent = document.querySelector('.sales-table')?.outerHTML || '';
    const currentDate = new Date().toLocaleDateString();
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.price, 0);
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Report - Smart Stock</title>
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
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Smart Stock - Sales Report</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          <div class="summary">
            <p><strong>Total Sales:</strong> ${salesData.length}</p>
            <p><strong>Total Revenue:</strong> $${totalRevenue.toLocaleString()}</p>
            <p><strong>Average Sale Value:</strong> $${(totalRevenue / salesData.length).toFixed(2)}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <RetailerNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Sales Analytics</h1>
            <p className="text-muted-foreground">Track your sales performance and analytics</p>
          </div>

          <Card className="feature-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Sales History
                  </CardTitle>
                  <CardDescription>
                    Track your sales performance and revenue
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
                <Table className="sales-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Sale ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="w-[100px]">Quantity Sold</TableHead>
                      <TableHead className="w-[120px]">Date</TableHead>
                      <TableHead className="w-[120px]">Total Price</TableHead>
                      <TableHead>Distributor Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {salesData.map((sale) => (
                       <TableRow key={sale.id}>
                         <TableCell className="font-medium">{sale.id}</TableCell>
                         <TableCell className="font-medium">{sale.productName}</TableCell>
                         <TableCell>{sale.quantity}</TableCell>
                         <TableCell>{sale.date}</TableCell>
                         <TableCell className="font-medium">${sale.price}</TableCell>
                         <TableCell>{sale.distributorName}</TableCell>
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

export default ViewSales;