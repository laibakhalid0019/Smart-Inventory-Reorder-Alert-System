import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Send, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock distributor data
const mockDistributors = [
  {
    id: 'DIST001',
    name: 'TechMart Distributors',
    productName: 'iPhone 15 Pro',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',
    price: 920,
    description: 'Latest iPhone 15 Pro with 128GB storage, Titanium finish, and advanced camera system. Bulk pricing available.',
    rating: 4.8,
    availability: 50
  },
  {
    id: 'DIST002',
    name: 'Global Electronics Hub',
    productName: 'iPhone 15 Pro',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',
    price: 935,
    description: 'Premium iPhone 15 Pro with warranty and fast shipping. Special rates for retailers.',
    rating: 4.6,
    availability: 25
  },
  {
    id: 'DIST003',
    name: 'Mobile World Suppliers',
    productName: 'iPhone 15 Pro',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',
    price: 910,
    description: 'Authentic iPhone 15 Pro with full manufacturer warranty. Competitive wholesale pricing.',
    rating: 4.9,
    availability: 75
  }
];

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

const ProductDetailModal = ({ isOpen, onClose, product }: ProductDetailModalProps) => {
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const [requestQuantity, setRequestQuantity] = useState('');
  const { toast } = useToast();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleDistributorSelect = (distributor: any) => {
    setSelectedDistributor(distributor);
  };

  const handleSendRequest = () => {
    if (!selectedDistributor || !requestQuantity) {
      toast({
        title: "Error",
        description: "Please select a distributor and enter quantity",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request Sent Successfully",
      description: `Request for ${requestQuantity} units sent to ${selectedDistributor.name}`,
    });

    // Reset form
    setSelectedDistributor(null);
    setRequestQuantity('');
    onClose();
  };

  const handleBack = () => {
    setSelectedDistributor(null);
    setRequestQuantity('');
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {selectedDistributor ? 'Request Product' : `Find Distributors for ${product.name}`}
          </DialogTitle>
          <DialogDescription>
            {selectedDistributor 
              ? 'Enter the quantity you want to request from this distributor'
              : 'Browse available distributors for this product category'}
          </DialogDescription>
        </DialogHeader>

        {!selectedDistributor ? (
          // Distributor List View
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockDistributors.map((distributor) => (
                <Card 
                  key={distributor.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleDistributorSelect(distributor)}
                >
                  <CardHeader className="pb-3">
                    <div className="aspect-square w-full mb-3 overflow-hidden rounded-lg">
                      <img 
                        src={distributor.image} 
                        alt={distributor.productName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardTitle className="text-lg">{distributor.productName}</CardTitle>
                    <CardDescription className="text-sm font-medium text-primary">
                      {distributor.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${distributor.price}</span>
                        <Badge variant="secondary">{distributor.availability} available</Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(distributor.rating)}
                        <span className="text-sm text-muted-foreground">({distributor.rating})</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {distributor.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Request Form View
          <div className="space-y-6">
            <Button variant="outline" onClick={handleBack} className="mb-4">
              ← Back to Distributors
            </Button>
            
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <img 
                    src={selectedDistributor.image} 
                    alt={selectedDistributor.productName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <CardTitle>{selectedDistributor.productName}</CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {selectedDistributor.name}
                    </CardDescription>
                    <div className="flex items-center space-x-1 mt-2">
                      {renderStars(selectedDistributor.rating)}
                      <span className="text-sm text-muted-foreground">({selectedDistributor.rating})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${selectedDistributor.price}</div>
                    <Badge variant="secondary">{selectedDistributor.availability} available</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{selectedDistributor.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>
                  Specify the quantity you want to request from this distributor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedDistributor.availability}
                    value={requestQuantity}
                    onChange={(e) => setRequestQuantity(e.target.value)}
                    placeholder="Enter quantity to request"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum available: {selectedDistributor.availability} units
                  </p>
                </div>
                
                {requestQuantity && (
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h4 className="font-semibold mb-2">Request Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span>{requestQuantity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Price:</span>
                        <span>${selectedDistributor.price}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-primary">
                        <span>Total Estimated Cost:</span>
                        <span>${(parseFloat(requestQuantity) * selectedDistributor.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleSendRequest} 
                  className="w-full brand-gradient text-white"
                  disabled={!requestQuantity}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;