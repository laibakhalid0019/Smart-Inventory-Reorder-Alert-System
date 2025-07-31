import { useState, useEffect } from 'react';
import axios from 'axios';
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
import { Package, Calendar, AlertTriangle, DollarSign, FileText, Plus, Image as ImageIcon, Upload, X, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DistributorNavigation from '@/components/DistributorNavigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/Redux/Store';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '@/Redux/Store/productsSlice';

// Define product type based on the API response
interface Product {
  id: number;
  name: string;
  category: string;
  sku: string | null;
  barcode: string;
  retail_price: number;
  cost_price: number;
  mst: number;
  quantity: number;
  expiry_date: string;
  imageUrl: string;
  distributor: {
    id: number;
    username: string;
    email: string;
    address: string;
    phone: string;
    role: string;
  };
  createdAt: string;
}

const ViewProduct = () => {
  // Use Redux instead of local state for products
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector((state: RootState) => state.products);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    costPrice: '',
    quantity: '',
    expiryDate: '',
    minThreshold: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch products when component mounts using Redux thunk
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Show toast when there's an error in the Redux state
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

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

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.costPrice || !newProduct.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Format expiry date to LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
    let formattedExpiryDate = null;
    if (newProduct.expiryDate) {
      formattedExpiryDate = `${newProduct.expiryDate}T00:00:00`;
    }

    // Prepare product data for API
    const productData = {
      name: newProduct.name,
      category: newProduct.category,
      retail_price: parseFloat(newProduct.price),
      cost_price: parseFloat(newProduct.costPrice),
      quantity: parseInt(newProduct.quantity),
      expiry_date: formattedExpiryDate,
      mst: parseInt(newProduct.minThreshold) || 5,
      imageUrl: newProduct.imageUrl,
      sku: null,
      barcode: `${Date.now()}` // Generate a simple barcode for now
    };

    try {
      const resultAction = await dispatch(addProduct({
        ...productData,
        imageFile: selectedFile || undefined
      }));

      if (addProduct.fulfilled.match(resultAction)) {
        // Reset form after successful addition
        setNewProduct({
          name: '',
          category: '',
          price: '',
          costPrice: '',
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
      } else {
        throw new Error("Add failed");
      }
    } catch (error) {
      toast({
        title: "Add Failed",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setIsEditMode(true);
    setEditProductId(product.id);
    setIsAddProductOpen(true);

    // Extract date part from expiry_date (remove time component)
    let expiryDateValue = '';
    if (product.expiry_date) {
      // If it contains 'T', extract just the date part
      expiryDateValue = product.expiry_date.includes('T')
        ? product.expiry_date.split('T')[0]
        : product.expiry_date;
    }

    // Set form fields with product data
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.retail_price.toString(),
      costPrice: product.cost_price.toString(),
      quantity: product.quantity.toString(),
      expiryDate: expiryDateValue,
      minThreshold: product.mst.toString(),
      imageUrl: product.imageUrl || ''
    });

    // Reset file and preview
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Format expiry date to LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
    let formattedExpiryDate = null;
    if (newProduct.expiryDate) {
      // Check if the date already contains time (T00:00:00)
      if (newProduct.expiryDate.includes('T')) {
        // Already formatted, use as is
        formattedExpiryDate = newProduct.expiryDate;
      } else {
        // Date only format (YYYY-MM-DD), append time
        formattedExpiryDate = `${newProduct.expiryDate}T00:00:00`;
      }
    }

    // Prepare product data for API
    const productData = {
      name: newProduct.name,
      category: newProduct.category,
      retail_price: parseFloat(newProduct.price),
      cost_price: parseFloat(newProduct.costPrice), // Set default or get from form if available
      quantity: parseInt(newProduct.quantity),
      expiry_date: formattedExpiryDate,
      mst: parseInt(newProduct.minThreshold) || 5,
      imageUrl: newProduct.imageUrl // Include existing image URL
    };

    try {
      // Dispatch updateProduct with correct parameters
      const resultAction = await dispatch(updateProduct({
        id: editProductId!,
        productData,
        imageFile: selectedFile || undefined
      }));

      if (updateProduct.fulfilled.match(resultAction)) {
        // Reset form after successful update
        setNewProduct({
          costPrice: "",
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
        setIsEditMode(false);
        setEditProductId(null);

        toast({
          title: "Product Updated",
          description: "Product details have been updated successfully.",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenDeleteDialog = (productId: number) => {
    setIsDeleteDialogOpen(true);
    setProductToDelete(productId);
  };

  const handleDeleteProduct = async () => {
    if (productToDelete === null) {
      toast({
        title: "Error",
        description: "No product selected for deletion.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resultAction = await dispatch(deleteProduct(productToDelete));

      if (deleteProduct.fulfilled.match(resultAction)) {
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);

        toast({
          title: "Product Deleted",
          description: "Product has been removed from your inventory.",
        });
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete product. It may be referenced by other records.",
        variant: "destructive",
      });
    }
  };
  const handlePrintPDF = () => {
    // Prepare document for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableContent = document.querySelector('.products-table')?.outerHTML || '';
    const currentDate = new Date().toLocaleDateString();
    const lowStockCount = products.filter(p => isLowStock(p.quantity, p.mst)).length;
    const expiringSoonCount = products.filter(p => isExpiringSoon(p.expiry_date)).length;
    const totalValue = products.reduce((sum, p) => sum + (p.retail_price * p.quantity), 0);

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
            <Dialog open={isAddProductOpen} onOpenChange={(open) => {
              setIsAddProductOpen(open);
              if (!open) {
                // Reset form and states when dialog closes
                setIsEditMode(false);
                setEditProductId(null);
                setNewProduct({
                  name: '',
                  category: '',
                  price: '',
                  quantity: '',
                  costPrice: "",
                  expiryDate: '',
                  minThreshold: '',
                  imageUrl: ''
                });
                setSelectedFile(null);
                setImagePreview(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                  onClick={() => {
                    // Ensure we're in add mode when clicking the add button
                    setIsEditMode(false);
                    setEditProductId(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  <DialogDescription>
                    {isEditMode ? 'Update the product information below.' : 'Add a new product to your inventory catalog.'}
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
                      <Label htmlFor="price">Retail Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="costPrice">Cost Price *</Label>
                      <Input
                        id="costPrice"
                        type="number"
                        value={newProduct.costPrice}
                        onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={newProduct.expiryDate}
                      onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
                    />
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
                  {isEditMode ? (
                    <Button onClick={handleUpdateProduct}>
                      Update Product
                    </Button>
                  ) : (
                    <Button onClick={handleAddProduct}>
                      Add Product
                    </Button>
                  )}
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
                  {products.filter(p => isLowStock(p.quantity, p.mst)).length}
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
                  {products.filter(p => isExpiringSoon(p.expiry_date)).length}
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
                  ${products.reduce((sum, p) => sum + (p.retail_price * p.quantity), 0).toLocaleString()}
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
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {status === 'loading' ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                            <span>Loading products...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => {
                        const lowStock = isLowStock(product.quantity, product.mst);
                        const expired = isExpired(product.expiry_date);
                        const expiringSoon = isExpiringSoon(product.expiry_date);
                        const stockStatus = getStockStatus(product.quantity, product.mst);

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
                            <TableCell className="font-medium">#{product.id}</TableCell>
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
                            <TableCell className="text-muted-foreground">{product.mst}</TableCell>
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
                                {formatDate(product.expiry_date)}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">${product.retail_price.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={stockStatus.variant}>
                                {stockStatus.text}
                              </Badge>
                            </TableCell>
                            <TableCell className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                className="text-muted-foreground hover:bg-accent/50 transition-colors"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleOpenDeleteDialog(product.id)}
                                className="bg-destructive/10 hover:bg-destructive/20"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ViewProduct;

