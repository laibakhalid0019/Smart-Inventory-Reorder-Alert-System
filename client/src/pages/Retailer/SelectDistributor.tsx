import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Truck, Clock, Shield, Send } from 'lucide-react';
import RetailerNavigation from '@/components/RetailerNavigation';
import { useToast } from '@/hooks/use-toast';

// Distributors data with detailed information
const distributors = {
  'Electronics': [
    { 
      id: 'DIST001', 
      name: 'TechMart Distributors', 
      company: 'TechMart Inc.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', 
      products: 'Smartphones, Laptops, Accessories',
      rating: 4.8,
      location: 'New York, NY',
      detailedDescription: 'Premium electronics distributor specializing in high-end consumer electronics. We offer competitive wholesale prices and fast delivery. Our iPhone 15 Pro models come with full warranty and authentic accessories.',
      productDetails: {
        'iPhone 15 Pro': { 
          price: 850, 
          availableStock: 150, 
          minOrder: 1, 
          leadTime: '2-3 days', 
          warranty: '1 year Apple warranty',
          description: 'Latest iPhone 15 Pro with A17 Pro chip, titanium design, and advanced camera system. Includes original Apple accessories and warranty.'
        },
        'Samsung Galaxy S24': { 
          price: 750, 
          availableStock: 200, 
          minOrder: 1, 
          leadTime: '1-2 days', 
          warranty: '1 year Samsung warranty',
          description: 'Samsung Galaxy S24 with advanced AI features, exceptional camera quality, and long-lasting battery. Authentic Samsung product with full warranty.'
        },
        'MacBook Air M3': { 
          price: 1100, 
          availableStock: 80, 
          minOrder: 1, 
          leadTime: '3-5 days', 
          warranty: '1 year Apple warranty',
          description: 'MacBook Air with M3 chip delivering incredible performance and all-day battery life. Perfect for professionals and students.'
        }
      }
    },
    { 
      id: 'DIST002', 
      name: 'Digital Supply Co.', 
      company: 'Digital Supply Corp.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', 
      products: 'Gaming, Audio, Computing',
      rating: 4.6,
      location: 'Los Angeles, CA',
      detailedDescription: 'Your trusted partner for digital products and computing solutions. We provide authentic electronics with certified quality standards. All products undergo thorough testing before shipping.',
      productDetails: {
        'iPhone 15 Pro': { 
          price: 870, 
          availableStock: 120, 
          minOrder: 2, 
          leadTime: '3-4 days', 
          warranty: '1 year warranty',
          description: 'iPhone 15 Pro with premium titanium finish and pro camera system. Bulk pricing available for orders over 5 units.'
        },
        'Samsung Galaxy S24': { 
          price: 770, 
          availableStock: 180, 
          minOrder: 2, 
          leadTime: '2-3 days', 
          warranty: '1 year warranty',
          description: 'Samsung Galaxy S24 with cutting-edge technology and exceptional build quality. Competitive pricing for retailers.'
        },
        'MacBook Air M3': { 
          price: 1150, 
          availableStock: 60, 
          minOrder: 1, 
          leadTime: '4-6 days', 
          warranty: '1 year warranty',
          description: 'Latest MacBook Air M3 with enhanced performance and efficiency. Perfect for resale with excellent margins.'
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
      products: 'Casual Wear, Formal Attire',
      rating: 4.7,
      location: 'Chicago, IL',
      detailedDescription: 'Leading fashion distributor with over 15 years of experience. We offer premium quality clothing at wholesale prices. All garments are made from high-quality materials and follow international sizing standards.',
      productDetails: {
        'Cotton T-Shirt': { 
          price: 18, 
          availableStock: 500, 
          minOrder: 5, 
          leadTime: '1-2 days', 
          warranty: 'Quality guarantee',
          description: 'Premium cotton t-shirts in various colors and sizes. Soft, comfortable, and durable. Perfect for retail with excellent profit margins.'
        },
        'Denim Jeans': { 
          price: 45, 
          availableStock: 300, 
          minOrder: 3, 
          leadTime: '2-3 days', 
          warranty: 'Quality guarantee',
          description: 'Classic denim jeans with superior fit and finish. Available in multiple sizes and washes. High-quality denim that lasts.'
        }
      }
    },
    { 
      id: 'DIST004', 
      name: 'Style Supply Chain', 
      company: 'Style Supply Co.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', 
      products: 'Trendy Clothing, Accessories',
      rating: 4.5,
      location: 'Miami, FL',
      detailedDescription: 'Modern fashion distributor focusing on trendy and contemporary clothing. We source directly from manufacturers to offer competitive prices. All items are quality-checked and come with size exchange guarantee.',
      productDetails: {
        'Cotton T-Shirt': { 
          price: 20, 
          availableStock: 400, 
          minOrder: 10, 
          leadTime: '2-3 days', 
          warranty: 'Size exchange within 7 days',
          description: 'Trendy cotton t-shirts with modern cuts and premium fabric. Latest fashion trends at wholesale prices.'
        },
        'Denim Jeans': { 
          price: 50, 
          availableStock: 250, 
          minOrder: 5, 
          leadTime: '3-4 days', 
          warranty: 'Size exchange within 7 days',
          description: 'Fashionable denim jeans with contemporary styling. Premium quality with modern fits and finishes.'
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
      products: 'Prescription Drugs, OTC Medicine',
      rating: 4.9,
      location: 'Atlanta, GA',
      detailedDescription: 'Licensed pharmaceutical distributor with FDA certification. All medications are stored in temperature-controlled environments and undergo strict quality control. We provide proper documentation and certificates for all pharmaceutical products.',
      productDetails: {
        'Paracetamol 500mg': { 
          price: 6, 
          availableStock: 1000, 
          minOrder: 50, 
          leadTime: '1-2 days', 
          warranty: 'Quality certified, proper storage guaranteed',
          description: 'High-quality Paracetamol 500mg tablets. FDA approved with proper batch tracking and quality certification. 24 tablets per pack.'
        }
      }
    },
    { 
      id: 'DIST006', 
      name: 'PharmaCare Distributors', 
      company: 'PharmaCare Corp.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 
      products: 'Health Supplements, Medical Supplies',
      rating: 4.6,
      location: 'Boston, MA',
      detailedDescription: 'Specialized distributor for health supplements and medical supplies. We maintain proper cold chain storage and provide complete batch tracking. All products come with authenticity certificates and proper expiry date management.',
      productDetails: {
        'Paracetamol 500mg': { 
          price: 7, 
          availableStock: 800, 
          minOrder: 25, 
          leadTime: '2-3 days', 
          warranty: 'Authenticity certificate included',
          description: 'Premium Paracetamol 500mg with extended shelf life. Comes with authenticity certificate and proper storage documentation.'
        }
      }
    },
  ]
};

const SelectDistributor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const productName = searchParams.get('product');
  const productCategory = searchParams.get('category');
  
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const [requestQuantity, setRequestQuantity] = useState('');
  const [showProductDetail, setShowProductDetail] = useState(false);

  const categoryDistributors = productCategory ? distributors[productCategory as keyof typeof distributors] || [] : [];

  const handleDistributorSelect = (distributor: any) => {
    setSelectedDistributor(distributor);
    setShowProductDetail(true);
  };

  const handleSendRequest = () => {
    if (!requestQuantity || !selectedDistributor) return;
    
    const productDetail = selectedDistributor.productDetails[productName];
    const totalAmount = parseFloat(requestQuantity) * productDetail.price;
    
    toast({
      title: "Request Sent Successfully",
      description: `Request for ${requestQuantity} units of ${productName} sent to ${selectedDistributor.name}. Total: $${totalAmount.toLocaleString()}`,
    });
    
    // Reset and navigate back
    setRequestQuantity('');
    setSelectedDistributor(null);
    setShowProductDetail(false);
    navigate('/retailer/stock/display');
  };

  const handleBack = () => {
    if (showProductDetail) {
      setShowProductDetail(false);
      setSelectedDistributor(null);
    } else {
      navigate('/retailer/stock/display');
    }
  };

  if (showProductDetail && selectedDistributor) {
    const productDetail = selectedDistributor.productDetails[productName];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
        <RetailerNavigation />
        
        <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="mb-4 hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Distributors
              </Button>
              <h1 className="text-3xl font-bold text-foreground mb-2">Product Details</h1>
              <p className="text-muted-foreground">Request {productName} from {selectedDistributor.name}</p>
            </div>

            {/* Product Detail Card */}
            <Card className="feature-card mb-8">
              <CardHeader>
                <div className="flex flex-col lg:flex-row gap-6">
                  <img 
                    src={selectedDistributor.image} 
                    alt={selectedDistributor.name}
                    className="w-full lg:w-32 h-48 lg:h-32 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{productName}</CardTitle>
                    <CardDescription className="text-base mb-4">
                      {productDetail?.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{selectedDistributor.company}</Badge>
                      <Badge variant="outline">⭐ {selectedDistributor.rating}</Badge>
                      <Badge variant="outline">{selectedDistributor.location}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">${productDetail?.price}</div>
                    <div className="text-sm text-muted-foreground">Unit Price</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{productDetail?.availableStock}</div>
                    <div className="text-sm text-muted-foreground">Available Stock</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{productDetail?.leadTime}</div>
                    <div className="text-sm text-muted-foreground">Lead Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-bold text-purple-600">{productDetail?.warranty}</div>
                    <div className="text-sm text-muted-foreground">Warranty</div>
                  </div>
                </div>

                {/* Request Form */}
                <div className="max-w-md mx-auto">
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
                        placeholder={`Min. order: ${productDetail?.minOrder} units`}
                        className="text-lg h-12"
                      />
                      {requestQuantity && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Total Amount: ${(parseFloat(requestQuantity) * productDetail?.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button 
                      onClick={handleSendRequest}
                      disabled={!requestQuantity || parseFloat(requestQuantity) < productDetail?.minOrder}
                      className="w-full brand-gradient text-white h-12 text-lg"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Send Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10">
      <RetailerNavigation />
      
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="mb-4 hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stock Display
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Select Distributor</h1>
            <p className="text-muted-foreground">
              Choose a distributor for <strong>{productName}</strong> in the <strong>{productCategory}</strong> category
            </p>
          </div>

          {/* Distributors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryDistributors.map((distributor) => (
              <Card 
                key={distributor.id} 
                className="feature-card cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => handleDistributorSelect(distributor)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={distributor.image} 
                      alt={distributor.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{distributor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-2">{distributor.company}</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">⭐ {distributor.rating}</Badge>
                        <Badge variant="outline" className="text-xs">{distributor.location}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{distributor.products}</p>
                  {distributor.productDetails[productName as string] && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Price:</span>
                        <p className="text-primary font-bold">
                          ${distributor.productDetails[productName as string].price}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Stock:</span>
                        <p className="text-green-600 font-medium">
                          {distributor.productDetails[productName as string].availableStock} units
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Lead Time:</span>
                        <p>{distributor.productDetails[productName as string].leadTime}</p>
                      </div>
                      <div>
                        <span className="font-medium">Min Order:</span>
                        <p>{distributor.productDetails[productName as string].minOrder} units</p>
                      </div>
                    </div>
                  )}
                  <Button className="w-full mt-4 brand-gradient text-white">
                    View Details & Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {categoryDistributors.length === 0 && (
            <Card className="feature-card text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Distributors Found</h3>
                <p className="text-muted-foreground">
                  No distributors available for {productCategory} category at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectDistributor;