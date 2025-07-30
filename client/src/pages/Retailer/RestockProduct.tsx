import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, ShoppingCart, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Distributor {
  id: number;
  username: string;
  email: string;
  address: string;
  phone: string;
  role: string;
}

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
  distributor: Distributor;
  createdAt: string;
}

interface ProductDisplay {
  distributor: {
    id: number;
    name: string;
    company: string;
    image: string;
    rating: number;
    location: string;
  };
  productDetails: {
    price: number;
    availableStock: number;
    minOrder: number;
    leadTime: string;
    warranty: string;
    description: string;
    image: string;
  };
  productName: string;
  raw: Product; // raw data if needed
}

const RestockProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const product = location.state?.product;

  const [selectedProduct, setSelectedProduct] = useState<ProductDisplay | null>(null);
  const [requestQuantity, setRequestQuantity] = useState('');
  const [view, setView] = useState<'products' | 'details'>('products');
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product?.category) {
      fetchProductsByCategory(product.category);
    }
  }, [product]);

  const fetchProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post(`http://localhost:3000/retailer/product/view-products`,
          {
            category: category,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials:true
          });
      setApiProducts(res.data);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to fetch products');
      toast({
        title: 'Error',
        description: 'Failed to fetch products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    navigate('/retailer/stock/display');
    return null;
  }

  const availableProducts: ProductDisplay[] = apiProducts.map((p) => ({
    distributor: {
      id: p.distributor.id,
      name: p.distributor.username,
      company: p.distributor.username,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
      rating: 4.8,
      location: p.distributor.address || 'Not specified',
    },
    productDetails: {
      price: p.retail_price,
      availableStock: p.quantity,
      minOrder: 1,
      leadTime: '2-3 days',
      warranty: '30 days',
      description: `${p.name} in ${p.category} category`,
      image: p.imageUrl || 'https://via.placeholder.com/150',
    },
    productName: p.name,
    raw: p,
  }));

  const handleProductSelect = (item: ProductDisplay) => {
    setSelectedProduct(item);
    setView('details');
  };

  const handleSendRequest = async () => {
    if (!requestQuantity || !selectedProduct) return;
    const totalAmount = parseFloat(requestQuantity) * selectedProduct.productDetails.price;
    
    const res = await axios.post("http://localhost:3000/retailer/request/generate-request", {
        productId: selectedProduct.raw.id,
        distributorId: selectedProduct.distributor.id,
        quantity: parseInt(requestQuantity, 10),
        price: totalAmount,
        }, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials:true
    })
        .then(()=>{
          toast({
            title: 'Request Sent Successfully',
            description: `Request for ${requestQuantity} units of ${selectedProduct.productName} sent to ${selectedProduct.distributor.name}. Total: $${totalAmount.toLocaleString()}`,
          });
        })
        .catch((err) => {
          toast({
            title: 'Error Sending Request',
            description: err.response?.data || 'Failed to send request. Please try again.',
            variant: 'destructive',
          })
        })



    navigate('/retailer/stock/display');
  };

  const handleBack = () => {
    if (view === 'details') {
      setView('products');
      setSelectedProduct(null);
      setRequestQuantity('');
    } else {
      navigate('/retailer/stock/display');
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
        <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Restock {product.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {view === 'products'
                      ? 'Select from available distributors'
                      : `Request from ${selectedProduct?.distributor.name}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {view === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {availableProducts.map((item, idx) => (
                    <Card
                        key={item.distributor.id + '-' + idx}
                        className="cursor-pointer hover-scale transition-all duration-300 hover:shadow-lg"
                        onClick={() => handleProductSelect(item)}
                    >
                      <CardHeader>
                        <img src={item.productDetails.image} className="rounded-lg mb-2 object-cover w-full h-40" />
                        <CardTitle>{item.productName}</CardTitle>
                        <CardDescription>{item.productDetails.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Distributor:</strong> {item.distributor.name}
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Price: ${item.productDetails.price}</span>
                          <span>Stock: {item.productDetails.availableStock}</span>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
          )}

          {view === 'details' && selectedProduct && (
              <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>
                      From {selectedProduct.distributor.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <img
                        src={selectedProduct.productDetails.image}
                        className="rounded-lg object-cover w-full h-48"
                    />
                    <p>{selectedProduct.productDetails.description}</p>
                    <div className="text-sm">Warranty: {selectedProduct.productDetails.warranty}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Request Product</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label>Quantity</Label>
                    <Input
                        type="number"
                        value={requestQuantity}
                        onChange={(e) => setRequestQuantity(e.target.value)}
                        placeholder={`Min: ${selectedProduct.productDetails.minOrder}`}
                    />
                    {requestQuantity && (
                        <div className="text-sm text-muted-foreground">
                          Total: ${(parseFloat(requestQuantity) * selectedProduct.productDetails.price).toFixed(2)}
                        </div>
                    )}
                    <Button
                        className="w-full"
                        onClick={handleSendRequest}
                        disabled={
                            !requestQuantity || parseFloat(requestQuantity) < selectedProduct.productDetails.minOrder
                        }
                    >
                      Send Request
                    </Button>
                  </CardContent>
                </Card>
              </div>
          )}
        </div>
      </div>
  );
};

export default RestockProduct;
