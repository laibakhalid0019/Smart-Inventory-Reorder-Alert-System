import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, AlertTriangle, DollarSign, FileText, Plus, Image as ImageIcon, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100',
  },
  {
    id: 'PROD002',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    quantity: 32,
    minThreshold: 8,
    expiryDate: '2025-08-15',
    price: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100',
  },
  {
    id: 'PROD003',
    name: 'MacBook Pro M3',
    category: 'Electronics',
    quantity: 15,
    minThreshold: 5,
    expiryDate: '2025-06-30',
    price: 1999,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100',
  },
  {
    id: 'PROD004',
    name: 'Cotton Premium T-Shirt',
    category: 'Clothes',
    quantity: 120,
    minThreshold: 25,
    expiryDate: '2026-01-31',
    price: 29,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100',
  },
  {
    id: 'PROD005',
    name: 'Denim Jeans Classic',
    category: 'Clothes',
    quantity: 8,
    minThreshold: 15,
    expiryDate: '2026-03-15',
    price: 79,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100',
  },
  {
    id: 'PROD006',
    name: 'Paracetamol 500mg',
    category: 'Medicine',
    quantity: 200,
    minThreshold: 50,
    expiryDate: '2024-09-30',
    price: 12,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100',
  },
  {
    id: 'PROD007',
    name: 'Vitamin D3 Tablets',
    category: 'Medicine',
    quantity: 3,
    minThreshold: 20,
    expiryDate: '2024-11-15',
    price: 18,
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100',
  },
  {
    id: 'PROD008',
    name: 'Wireless Earbuds Pro',
    category: 'Electronics',
    quantity: 25,
    minThreshold: 10,
    expiryDate: '2025-10-20',
    price: 199,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100',
  }
];

const ViewProduct = () => {
  const [products, setProducts] = useState(distributorProducts);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    expiryDate: '',
    minThreshold: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file (JPG, PNG, JPEG).",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setNewProduct({...newProduct, imageUrl: ''});
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    let finalImageUrl = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100';
    
    // If file is selected, use it as the image URL (in a real app, you'd upload to server/cloud)
    if (imagePreview) {
      finalImageUrl = imagePreview;
    } else if (newProduct.imageUrl) {
      finalImageUrl = newProduct.imageUrl;
    }

    const product = {
      id: `PROD${String(products.length + 1).padStart(3, '0')}`,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
      expiryDate: newProduct.expiryDate,
      minThreshold: parseInt(newProduct.minThreshold) || 5,
      imageUrl: finalImageUrl
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      category: '',
      price: '',
      quantity: '',
      expiryDate: '',
      minThreshold: '',
      imageUrl: ''
    });
    setSelectedFile(null);
    setImagePreview(null);
    setIsAddProductOpen(false);
    
    toast({
      title: "Product Added",
      description: "New product has been added to your inventory.",
    });
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
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Product Inventory</h1>
              <p className="text-muted-foreground">Manage your product catalog and inventory levels</p>
            </div>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 transition-all hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your inventory catalog.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Clothes">Clothes</SelectItem>
                          <SelectItem value="Medicine">Medicine</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={newProduct.expiryDate}
                        onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="minThreshold">Min Threshold</Label>
                      <Input
                        id="minThreshold"
                        type="number"
                        value={newProduct.minThreshold}
                        onChange={(e) => setNewProduct({...newProduct, minThreshold: e.target.value})}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Product Image</Label>
                    <div className="space-y-4">
                      {/* File Upload Input */}
                      <div className="flex items-center gap-4">
                        <label htmlFor="image-upload" className="flex-1">
                          <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                {selectedFile ? selectedFile.name : 'Click to upload image or drag and drop'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                JPG, PNG, JPEG up to 10MB
                              </p>
                            </div>
                          </div>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-24 h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      
                      {/* Alternative URL Input */}
                      {!selectedFile && (
                        <div className="space-y-2">
                          <Label htmlFor="imageUrl" className="text-sm text-muted-foreground">Or enter image URL</Label>
                          <Input
                            id="imageUrl"
                            value={newProduct.imageUrl}
                            onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct}>
                    Add Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                        <TableHead className="w-[80px]">Image</TableHead>
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
                          className={`bg-background text-foreground border-b border-border hover:bg-accent/50 transition-colors ${
                            lowStock || expired ? 'bg-destructive/10 border-destructive/30' : 
                            expiringSoon ? 'bg-orange-500/10 border-orange-500/30' : ''
                          }`}
                        >
                          <TableCell>
                            <div className="flex items-center justify-center">
                              {product.imageUrl ? (
                                 <img 
                                   src={product.imageUrl} 
                                   alt={product.name}
                                   className="w-16 h-16 object-cover rounded"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    target.style.display = 'none';
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                              ) : (
                                 <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                                   <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                 </div>
                              )}
                               <div className="w-16 h-16 bg-muted rounded flex items-center justify-center" style={{display: 'none'}}>
                                 <ImageIcon className="h-8 w-8 text-muted-foreground" />
                               </div>
                            </div>
                          </TableCell>
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
                                    ? 'bg-orange-500/20 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
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