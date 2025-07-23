import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Truck, Shield, Send, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Distributors data with products they carry (same as RestockingModal)
const distributorsData = {
  'Electronics': [
    { 
      id: 'DIST001', 
      name: 'TechMart Distributors', 
      company: 'TechMart Inc.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', 
      rating: 4.8,
      location: 'New York, NY',
      productDetails: {
        'iPhone 15 Pro': { 
          price: 850, 
          availableStock: 150, 
          minOrder: 1, 
          leadTime: '2-3 days', 
          warranty: '1 year Apple warranty',
          description: 'Latest iPhone 15 Pro with A17 Pro chip, titanium design, and advanced camera system.',
          image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400'
        },
        'Samsung Galaxy S24': { 
          price: 750, 
          availableStock: 200, 
          minOrder: 1, 
          leadTime: '1-2 days', 
          warranty: '1 year Samsung warranty',
          description: 'Samsung Galaxy S24 with advanced AI features and exceptional camera quality.',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
        },
        'MacBook Air M3': { 
          price: 1100, 
          availableStock: 80, 
          minOrder: 1, 
          leadTime: '3-5 days', 
          warranty: '1 year Apple warranty',
          description: 'MacBook Air with M3 chip delivering incredible performance and all-day battery life.',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
        }
      }
    },
    { 
      id: 'DIST002', 
      name: 'Digital Supply Co.', 
      company: 'Digital Supply Corp.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', 
      rating: 4.6,
      location: 'Los Angeles, CA',
      productDetails: {
        'iPhone 15 Pro': { 
          price: 870, 
          availableStock: 120, 
          minOrder: 2, 
          leadTime: '3-4 days', 
          warranty: '1 year warranty',
          description: 'iPhone 15 Pro with premium titanium finish and pro camera system.',
          image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400'
        },
        'Samsung Galaxy S24': { 
          price: 770, 
          availableStock: 180, 
          minOrder: 2, 
          leadTime: '2-3 days', 
          warranty: '1 year warranty',
          description: 'Samsung Galaxy S24 with cutting-edge technology and exceptional build quality.',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
        },
        'MacBook Air M3': { 
          price: 1150, 
          availableStock: 60, 
          minOrder: 1, 
          leadTime: '4-6 days', 
          warranty: '1 year warranty',
          description: 'Latest MacBook Air M3 with enhanced performance and efficiency.',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
        }
      }
    },
  ],
  'Clothes': [
    { 
      id: 'DIST003', 
      name: 'Fashion Wholesale', 
      company: 'Fashion Wholesale Ltd.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', 
      rating: 4.7,
      location: 'Chicago, IL',
      productDetails: {
        'Cotton T-Shirt': { 
          price: 18, 
          availableStock: 500, 
          minOrder: 5, 
          leadTime: '1-2 days', 
          warranty: 'Quality guarantee',
          description: 'Premium cotton t-shirts in various colors and sizes. Soft and comfortable.',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
        },
        'Denim Jeans': { 
          price: 45, 
          availableStock: 300, 
          minOrder: 3, 
          leadTime: '2-3 days', 
          warranty: 'Quality guarantee',
          description: 'Classic denim jeans with superior fit and finish.',
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
        }
      }
    },
    { 
      id: 'DIST004', 
      name: 'Style Supply Chain', 
      company: 'Style Supply Co.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', 
      rating: 4.5,
      location: 'Miami, FL',
      productDetails: {
        'Cotton T-Shirt': { 
          price: 20, 
          availableStock: 400, 
          minOrder: 10, 
          leadTime: '2-3 days', 
          warranty: 'Size exchange within 7 days',
          description: 'Trendy cotton t-shirts with modern cuts and premium fabric.',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
        },
        'Denim Jeans': { 
          price: 50, 
          availableStock: 250, 
          minOrder: 5, 
          leadTime: '3-4 days', 
          warranty: 'Size exchange within 7 days',
          description: 'Fashionable denim jeans with contemporary styling.',
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
        }
      }
    },
  ],
  'Medicine': [
    { 
      id: 'DIST005', 
      name: 'MedSupply Inc.', 
      company: 'MedSupply Corporation',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400', 
      rating: 4.9,
      location: 'Atlanta, GA',
      productDetails: {
        'Paracetamol 500mg': { 
          price: 6, 
          availableStock: 1000, 
          minOrder: 50, 
          leadTime: '1-2 days', 
          warranty: 'Quality certified',
          description: 'High-quality Paracetamol 500mg tablets. FDA approved with proper batch tracking.',
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'
        }
      }
    },
    { 
      id: 'DIST006', 
      name: 'PharmaCare Distributors', 
      company: 'PharmaCare Corp.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 
      rating: 4.6,
      location: 'Boston, MA',
      productDetails: {
        'Paracetamol 500mg': { 
          price: 7, 
          availableStock: 800, 
          minOrder: 25, 
          leadTime: '2-3 days', 
          warranty: 'Authenticity certificate included',
          description: 'Premium Paracetamol 500mg with extended shelf life and authenticity certificate.',
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'
        }
      }
    },
  ]
};

const RestockProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get product info from navigation state
  const product = location.state?.product;
  
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<any>(null);
  const [requestQuantity, setRequestQuantity] = useState('');
  const [view, setView] = useState<'products' | 'details'>('products');

  if (!product) {
    navigate('/retailer/stock/display');
    return null;
  }

  // Get distributors that have the requested product
  const categoryDistributors = distributorsData[product.category as keyof typeof distributorsData] || [];
  const availableProducts = categoryDistributors.reduce((acc: any[], distributor) => {
    if (distributor.productDetails[product.name]) {
      acc.push({
        distributor,
        productDetails: distributor.productDetails[product.name],
        productName: product.name
      });
    }
    return acc;
  }, []);

  const handleProductSelect = (item: any) => {
    setSelectedDistributor(item.distributor);
    setSelectedProductDetails(item.productDetails);
    setView('details');
  };

  const handleSendRequest = () => {
    if (!requestQuantity || !selectedDistributor || !selectedProductDetails) return;
    
    const totalAmount = parseFloat(requestQuantity) * selectedProductDetails.price;
    
    toast({
      title: "Request Sent Successfully",
      description: `Request for ${requestQuantity} units of ${product.name} sent to ${selectedDistributor.name}. Total: $${totalAmount.toLocaleString()}`,
    });
    
    navigate('/retailer/stock/display');
  };

  const handleBack = () => {
    if (view === 'details') {
      setView('products');
      setSelectedDistributor(null);
      setSelectedProductDetails(null);
      setRequestQuantity('');
    } else {
      navigate('/retailer/stock/display');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="hover-scale"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Restock {product.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {view === 'products' ? 'Select from available distributors' : `Request from ${selectedDistributor?.name}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Products Grid View */}
          {view === 'products' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Available Product Variants</h2>
                <p className="text-muted-foreground">
                  Found {availableProducts.length} distributor(s) selling {product.name}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableProducts.map((item, index) => (
                  <Card 
                    key={`${item.distributor.id}-${index}`}
                    className="cursor-pointer hover-scale transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20"
                    onClick={() => handleProductSelect(item)}
                  >
                    <CardHeader className="pb-4">
                      <div className="aspect-square rounded-lg overflow-hidden mb-4">
                        <img 
                          src={item.productDetails.image} 
                          alt={item.productName}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardTitle className="text-lg">{item.productName}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.productDetails.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Distributor:</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.distributor.name}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="text-center p-2 bg-primary/5 rounded-lg">
                            <div className="text-lg font-bold text-primary">
                              ${item.productDetails.price}
                            </div>
                            <div className="text-xs text-muted-foreground">Price</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                              {item.productDetails.availableStock}
                            </div>
                            <div className="text-xs text-muted-foreground">Stock</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>⭐ {item.distributor.rating}</span>
                          <span>{item.productDetails.leadTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Product Details View */}
          {view === 'details' && selectedDistributor && selectedProductDetails && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Product Details</h2>
                <p className="text-muted-foreground">
                  Review details and request quantity for {product.name}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Info */}
                <Card className="feature-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      {product.name}
                    </CardTitle>
                    <CardDescription>
                      From {selectedDistributor.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={selectedProductDetails.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {selectedProductDetails.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <Package className="h-6 w-6 text-primary mx-auto mb-1" />
                        <div className="text-xl font-bold text-primary">
                          ${selectedProductDetails.price}
                        </div>
                        <div className="text-xs text-muted-foreground">Unit Price</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <ShoppingCart className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <div className="text-xl font-bold text-green-600">
                          {selectedProductDetails.availableStock}
                        </div>
                        <div className="text-xs text-muted-foreground">Available</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Lead Time:</span>
                        <Badge variant="outline">{selectedProductDetails.leadTime}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Warranty:</span>
                        <span className="text-sm text-muted-foreground">{selectedProductDetails.warranty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Min Order:</span>
                        <span className="text-sm text-muted-foreground">{selectedProductDetails.minOrder} units</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Request Form */}
                <Card className="feature-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-primary" />
                      Send Request
                    </CardTitle>
                    <CardDescription>
                      Specify the quantity you want to request
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="quantity" className="text-base font-medium">
                          Quantity to Request
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={requestQuantity}
                          onChange={(e) => setRequestQuantity(e.target.value)}
                          placeholder={`Min. order: ${selectedProductDetails.minOrder} units`}
                          className="text-lg h-12 mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Minimum order quantity: {selectedProductDetails.minOrder} units
                        </p>
                      </div>
                      
                      {requestQuantity && (
                        <div className="p-4 bg-accent/20 rounded-lg animate-fade-in">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              ${(parseFloat(requestQuantity) * selectedProductDetails.price).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total Amount ({requestQuantity} × ${selectedProductDetails.price})
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleSendRequest}
                      disabled={!requestQuantity || parseFloat(requestQuantity) < selectedProductDetails.minOrder}
                      className="w-full brand-gradient text-white h-12 text-lg hover-scale"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Send Request to {selectedDistributor.name}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestockProduct;