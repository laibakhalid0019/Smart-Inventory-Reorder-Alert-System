import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, FileText, Filter, Package, Smartphone, Heart, ShirtIcon, Edit2 } from 'lucide-react';
import RetailerNavigation from '@/components/RetailerNavigation';

// Mock data for demonstration
const initialStock = [
  {
    id: 'STK001',
    name: 'iPhone 15 Pro',
    category: 'Electronics',
    quantity: 3,
    minThreshold: 5,
    expiryDate: '2024-12-31',
    price: 999,
    description: 'Latest iPhone with advanced camera system',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400'
  },
  {
    id: 'STK002',
    name: 'Samsung Galaxy S24',
    category: 'Electronics',
    quantity: 8,
    minThreshold: 6,
    expiryDate: '2025-06-15',
    price: 899,
    description: 'Premium Android smartphone with excellent display',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
  },
  {
    id: 'STK003',
    name: 'MacBook Air M3',
    category: 'Electronics',
    quantity: 2,
    minThreshold: 3,
    expiryDate: '2024-07-21',
    price: 1299,
    description: 'Lightweight laptop with powerful M3 chip',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
  },
  {
    id: 'STK004',
    name: 'Cotton T-Shirt',
    category: 'Clothes',
    quantity: 1,
    minThreshold: 3,
    expiryDate: '2025-01-15',
    price: 25,
    description: 'Comfortable cotton t-shirt available in multiple colors',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
  },
  {
    id: 'STK005',
    name: 'Paracetamol 500mg',
    category: 'Medicine',
    quantity: 0,
    minThreshold: 10,
    expiryDate: '2024-06-30',
    price: 8,
    description: 'Pain relief medication, 24 tablets per pack',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'
  },
  {
    id: 'STK006',
    name: 'Denim Jeans',
    category: 'Clothes',
    quantity: 15,
    minThreshold: 5,
    expiryDate: '2025-12-31',
    price: 65,
    description: 'Classic blue denim jeans in various sizes',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
  }
];


const StockDisplay = () => {
  const navigate = useNavigate();
  const [stock, setStock] = useState(initialStock);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expiredFilter, setExpiredFilter] = useState(false);
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    imageUrl: '',
    category: 'Electronics',
    minThreshold: 5
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      imageUrl: '',
      category: 'Electronics',
      minThreshold: 5
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
      minThreshold: product.minThreshold
    });
  };

  const handleSave = () => {
    if (editingProduct) {
      setStock(stock.map(item => 
        item.id === editingProduct.id 
          ? { ...item, ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity) }
          : item
      ));
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setStock(stock.filter(item => item.id !== id));
  };

  const isExpired = (date: string) => {
    const today = new Date();
    const expiryDate = new Date(date);
    return expiryDate <= today;
  };

  const isLowStock = (quantity: number, threshold: number) => {
    return quantity <= threshold;
  };

  const handleRequestModal = (product: any) => {
    // Navigate to product request page
    navigate(`/retailer/stock/product-request?product=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}`);
  };


  const handlePrintPDF = () => {
    // Prepare document for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableContent = document.querySelector('.stock-table')?.outerHTML || '';
    const currentDate = new Date().toLocaleDateString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stock Display Report - Smart Stock</title>
          <style>
            @page { size: A4 landscape; margin: 0.5in; }
            body { font-family: Arial, sans-serif; font-size: 12px; color: black; }
            .print-header { text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #dee2e6; }
            .print-header h1 { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .print-header p { font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: left; }
            th { background: #e9ecef; font-weight: bold; }
            .badge { display: inline-block; padding: 2px 6px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px; background: #f8f9fa; }
            .low-stock { background: #ffe6e6; }
            .expired { background: #ffcccc; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Smart Stock - Inventory Report</h1>
            <p>Generated on ${currentDate}</p>
            <p>Total Products: ${filteredStock.length}</p>
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

  // Filter products based on current filters
  const filteredStock = stock.filter(product => {
    const categoryMatch = categoryFilter === 'All' || product.category === categoryFilter;
    const expiredMatch = !expiredFilter || isExpired(product.expiryDate);
    const lowStockMatch = !lowStockFilter || isLowStock(product.quantity, product.minThreshold);
    
    return categoryMatch && expiredMatch && lowStockMatch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Electronics': return <Smartphone className="h-4 w-4" />;
      case 'Clothes': return <ShirtIcon className="h-4 w-4" />;
      case 'Medicine': return <Heart className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <RetailerNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Stock Display</h1>
            <p className="text-muted-foreground">Manage your inventory and request products from distributors</p>
          </div>

          {/* Filters and Actions */}
          <Card className="feature-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  Filters & Actions
                </span>
                <Button onClick={handlePrintPDF} variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Print as PDF
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Filter by Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothes">Clothes</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant={expiredFilter ? "default" : "outline"} 
                    onClick={() => setExpiredFilter(!expiredFilter)}
                    className="w-full"
                  >
                    Expired Items
                  </Button>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant={lowStockFilter ? "default" : "outline"} 
                    onClick={() => setLowStockFilter(!lowStockFilter)}
                    className="w-full"
                  >
                    Low Stock
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Product Section */}
          {editingProduct && (
            <Card className="feature-card mb-8">
              <CardHeader>
                <CardTitle>Edit Product</CardTitle>
                <CardDescription>Update the product information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Title</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Stock</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSave} className="brand-gradient text-white">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stock Table */}
          <Card className="feature-card">
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>
                Current stock levels with distributor request options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="stock-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Stock ID</TableHead>
                      <TableHead className="w-[120px]">Category</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                      <TableHead className="w-[120px]">Price</TableHead>
                      <TableHead className="w-[120px]">Expiry Date</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStock.map((item) => {
                      const isLow = isLowStock(item.quantity, item.minThreshold);
                      const expired = isExpired(item.expiryDate);
                      const needsHighlight = isLow || expired;
                      
                      return (
                        <TableRow 
                          key={item.id} 
                          className={needsHighlight ? "bg-destructive/10 border-destructive/30" : ""}
                        >
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(item.category)}
                              <span className="text-sm">{item.category}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={isLow ? "destructive" : "secondary"}
                            >
                              {item.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>
                            <span 
                              className={`px-2 py-1 rounded text-sm ${
                                expired
                                  ? 'bg-destructive/20 text-destructive' 
                                  : 'bg-secondary text-secondary-foreground'
                              }`}
                            >
                              {item.expiryDate}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                                className="text-primary hover:text-primary"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRequestModal(item)}
                                className="brand-gradient text-white border-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
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

export default StockDisplay;