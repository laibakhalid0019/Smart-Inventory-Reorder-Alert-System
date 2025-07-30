import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import {
  Plus, FileText, Filter, Package, Smartphone, Heart, ShirtIcon, Edit2, Trash2, Loader2
} from 'lucide-react';
import RetailerNavigation from '@/components/RetailerNavigation';
import { useToast } from '@/hooks/use-toast';
import { RootState, AppDispatch } from '@/Redux/Store';
import {
  fetchRetailerStock,
  fetchStockByCategory,
  updateStockItem,
  setSelectedCategory,
  updateCategories,
  filterStock
} from '@/Redux/Store/stockSlice';

interface Product {
  id: number;
  name: string;
  category: string;
  retail_price: number;
  imageUrl: string;
  description?: string;
}

interface StockItem {
  id: number;
  quantity: number;
  expiry_date: string;
  min_threshold: number;
  product: Product;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  quantity: string;
  imageUrl: string;
  category: string;
  minThreshold: number;
  expiryDate: string;
}

const StockDisplay = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get stock data from Redux store
  const { items: stock, loading, error, categories, selectedCategory } = useSelector(
    (state: RootState) => state.stock
  );

  const [editingProduct, setEditingProduct] = useState<StockItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [originalQuantity, setOriginalQuantity] = useState<number>(0);
  const { toast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expiredFilter, setExpiredFilter] = useState(false);
  const [lowStockFilter, setLowStockFilter] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    quantity: '',
    imageUrl: '',
    category: 'Electronics',
    minThreshold: 5,
    expiryDate: '',
  });

  // Fetch retailer's stock data when component mounts
  useEffect(() => {
    dispatch(fetchRetailerStock())
      .unwrap()
      .then((stockData) => {
        // Extract unique categories from stock data
        const uniqueCategories = [...new Set(stockData.map((item: any) => item.product.category))];
        dispatch(updateCategories(uniqueCategories));
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch stock data: ' + error
        });
      });
  }, [dispatch, toast]);

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    dispatch(filterStock({
      category,
      showExpired: expiredFilter,
      showLowStock: lowStockFilter
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      imageUrl: '',
      category: 'Electronics',
      minThreshold: 5,
      expiryDate: '',
    });
    setEditingProduct(null);
  };

  const handleEdit = (item: StockItem) => {
    const product = item.product;
    setEditingProduct(item);
    setOriginalQuantity(item.quantity);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.retail_price.toString(),
      quantity: item.quantity.toString(),
      imageUrl: product.imageUrl || '',
      category: product.category,
      minThreshold: item.min_threshold,
      expiryDate: item.expiry_date?.slice(0, 10) || '',
    });
    setQuantityError(null); // Reset any previous error
  };

  const validateQuantity = (newValue: string): boolean => {
    const newQuantity = parseInt(newValue);
    if (isNaN(newQuantity)) {
      setQuantityError("Quantity must be a valid number");
      return false;
    }

    if (newQuantity > originalQuantity) {
      setQuantityError(`Quantity cannot be increased. Original: ${originalQuantity}`);
      return false;
    }

    if (newQuantity < 0) {
      setQuantityError("Quantity cannot be negative");
      return false;
    }

    setQuantityError(null);
    return true;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    validateQuantity(newValue);
    setFormData({ ...formData, quantity: newValue });
  };

  const handleSave = async () => {
    if (editingProduct) {
      // Validate quantity before saving
      if (!validateQuantity(formData.quantity)) {
        return;
      }

      try {
        setIsUpdating(true); // Start loading state
        const updatedStock = {
          quantity: parseInt(formData.quantity),
          min_threshold: formData.minThreshold,
          name: formData.name,
          category: formData.category,
        };

        // Dispatch the update action to Redux store
        const resultAction = await dispatch(updateStockItem({
          id: editingProduct.id,
          updatedData: updatedStock
        }));

        if (updateStockItem.fulfilled.match(resultAction)) {
          toast({
            title: "Stock Updated",
            description: "Stock item has been updated successfully.",
          });
          resetForm();
        } else if (updateStockItem.rejected.match(resultAction)) {
          toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: resultAction.payload as string || 'Failed to update stock item'
          });
        }
      } catch (error) {
        console.error("Error updating stock:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An error occurred while updating the stock.'
        });
      } finally {
        setIsUpdating(false); // End loading state
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("Deleting stock with ID:", id);
      await axios.delete(`http://localhost:3000/retailer/stocks/delete-stock/${id}`, {
        withCredentials: true
      });

      // After successful deletion, refresh the stock data
      dispatch(fetchRetailerStock());

      toast({
        title: "Stock Deleted",
        description: "Stock item has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while deleting the stock item.'
      });
    }
  };

  const isExpired = (date: string) => new Date(date) <= new Date();
  const isLowStock = (qty: number, threshold: number) => qty <= threshold;

  const handleRequestRestock = (product: StockItem) => {
    console.log("Requesting restock for:", product.product.name);
    navigate('/retailer/stock/restock', {
      state: {
        product: {
          name: product.product.name || '',
          category: product.product.category || 'Books'
        }
      }
    });
  };

  // New function for navigating to restock page from empty state
  const handleAddNewStock = () => {
    console.log("Adding new stock - navigating to restock page with default values");
    navigate('/retailer/stock/restock', {
      state: {
        product: {
          name: 'New Product',
          category: 'Books'
        }
      }
    });
  };

  const handlePrintPDF = () => {
    console.log('Generating CSV file...');

    // Create CSV header row
    let csvContent = 'ID,Category,Name,Quantity,Min Threshold,Price,Expiry Date\n';

    // Add each stock item as a row
    filteredStock.forEach(item => {
      const product = item.product;
      const expiryDate = item.expiry_date?.slice(0, 10) || 'N/A';
      const row = [
        item.id,
        product.category,
        `"${product.name.replace(/"/g, '""')}"`, // Handle names with commas by wrapping in quotes and escaping quotes
        item.quantity,
        item.min_threshold,
        product.retail_price,
        expiryDate
      ].join(',');

      csvContent += row + '\n';
    });

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a download link and trigger the download
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    link.href = url;
    link.setAttribute('download', `stock-inventory-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Generated",
      description: "The stock inventory CSV file has been generated successfully.",
      variant: "default",
    });

  };

  const filteredStock = stock.filter(item => {
    const categoryMatch = categoryFilter === 'All' || item.product.category === categoryFilter;
    const expiredMatch = !expiredFilter || isExpired(item.expiry_date);
    const lowStockMatch = !lowStockFilter || isLowStock(item.quantity, item.min_threshold);
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

        <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Stock Display</h1>
            <p className="text-muted-foreground">Manage your inventory and request products</p>
          </div>

          <Card className="feature-card mb-8 no-scale">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filters & Actions</span>
                <Button onClick={handlePrintPDF} variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Print CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Filter by Category</Label>
                <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant={expiredFilter ? "default" : "outline"} onClick={() => setExpiredFilter(!expiredFilter)}>Expired</Button>
              <Button variant={lowStockFilter ? "default" : "outline"} onClick={() => setLowStockFilter(!lowStockFilter)}>Low Stock</Button>
            </CardContent>
          </Card>

          {/* Edit Form */}
          {editingProduct && (
              <Card className="feature-card mb-8">
                <CardHeader>
                  <CardTitle>Edit Product</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        type="number"
                        id="quantity"
                        value={formData.quantity}
                        onChange={handleQuantityChange}
                      />
                      {quantityError && <p className="text-red-500 text-sm">{quantityError}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minThreshold">Minimum Threshold</Label>
                      <Input
                        type="number"
                        id="minThreshold"
                        value={formData.minThreshold}
                        onChange={e => setFormData({ ...formData, minThreshold: parseInt(e.target.value) || 0 })}
                        placeholder="Stock level warning threshold"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        'Save'
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetForm} disabled={isUpdating}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
          )}

          <Card className="feature-card text-white">
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>MST</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStock.length > 0 ? (
                      filteredStock.map(item => {
                        const product = item.product;
                        const isLow = isLowStock(item.quantity, item.min_threshold);
                        const expired = isExpired(item.expiry_date);
                        return (
                          <TableRow key={item.id} className={`${isLow || expired ? 'bg-transparent' : ''} hover:bg-transparent`}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell className="flex items-center gap-2">{getCategoryIcon(product.category)} {product.category}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell><Badge variant={isLow ? "destructive" : "secondary"}>{item.quantity}</Badge></TableCell>
                            <TableCell>{item.min_threshold}</TableCell>
                            <TableCell>${product.retail_price}</TableCell>
                            <TableCell>{item.expiry_date?.slice(0, 10)}</TableCell>
                            <TableCell className="flex gap-1">
                              <Button onClick={() => handleEdit(item)} size="sm"><Edit2 className="h-4 w-4" /></Button>
                              <Button onClick={() => handleRequestRestock(item)} size="sm"><Plus className="h-4 w-4" /></Button>
                              <Button onClick={() => handleDelete(item.id)} size="sm" variant="outline" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <Package className="h-8 w-8 text-muted-foreground" />
                            <div className="text-lg font-medium">No stock items available</div>
                            <p className="text-sm text-muted-foreground">
                              Get started by adding new stock to your inventory.
                            </p>
                            <Button 
                              onClick={() => handleAddNewStock()}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Stock
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default StockDisplay;
