/**
 * Utility to generate dynamic dashboard data for Gemini API calls
 * This will create fresh data with slight variations each time it's called
 */

// Generate a random date within the last 30 days
const getRandomRecentDate = (daysAgo = 30): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Generate a random number within a range
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Random price with two decimal places
const getRandomPrice = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Random element from array
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Sample product categories
const productCategories = ['Electronics', 'Healthcare', 'Food & Beverages', 'Clothing', 'Home Goods'];

// Sample product names by category
const productNamesByCategory: Record<string, string[]> = {
  'Electronics': ['Smartphone X', 'Laptop Pro', 'Wireless Earbuds', 'Smart Watch', 'Tablet Ultra', 'Bluetooth Speaker'],
  'Healthcare': ['Vitamin Complex', 'Antibacterial Soap', 'Pain Relief Gel', 'First Aid Kit', 'Hand Sanitizer'],
  'Food & Beverages': ['Premium Coffee', 'Organic Tea', 'Energy Drink', 'Protein Bars', 'Sparkling Water'],
  'Clothing': ['Cotton T-Shirt', 'Denim Jeans', 'Casual Hoodie', 'Sports Shorts', 'Running Shoes'],
  'Home Goods': ['Kitchen Towels', 'Bath Essentials', 'Cleaning Supplies', 'Scented Candles', 'Bedding Set']
};

// Sample retailer names
const retailerNames = ['TechWorld Retailer', 'HealthPlus Store', 'GroceryMart', 'Fashion Outlet', 'Home Essentials'];

// Sample distributor names
const distributorNames = ['TechDistributors Inc.', 'HealthSupplies Co.', 'FoodBeverages Wholesale', 'Apparel Distributors', 'HomeGoods Supply'];

// Sample order statuses
const orderStatuses = ['PENDING', 'PAID', 'DISPATCHED', 'DELIVERED'];

// Sample request statuses
const requestStatuses = ['PENDING', 'APPROVED', 'REJECTED'];

// Sample delivery routes
const deliveryRoutes = ['Central Delivery Route', 'Eastern Delivery Route', 'Western Delivery Route', 'Northern Delivery Route'];

// Generate a retailer object
const generateRetailer = (id: number) => {
  const name = retailerNames[id % retailerNames.length];
  return {
    id,
    name,
    address: `${getRandomNumber(100, 999)} ${name.split(' ')[0]} St, ${name.split(' ')[1]} City`,
    contact: `+1 555-${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`
  };
};

// Generate a distributor object
const generateDistributor = (id: number) => {
  const name = distributorNames[id % distributorNames.length];
  const category = productCategories[id % productCategories.length];
  return {
    id,
    name,
    category,
    address: `${getRandomNumber(100, 999)} ${name.split(' ')[0]} Ave, Distribution Hub`,
    contact: `+1 555-${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`
  };
};

// Generate a product object
const generateProduct = (id: number, categoryOverride?: string) => {
  const category = categoryOverride || getRandomElement(productCategories);
  const name = getRandomElement(productNamesByCategory[category]);
  const retail_price = getRandomPrice(10, 1500);
  const cost_price = retail_price * 0.7; // 30% markup
  const quantity = getRandomNumber(5, 100);
  const mst = Math.floor(quantity * 0.3); // Minimum stock threshold at 30% of quantity

  // Only add expiry dates for certain categories
  const expiry_date = ['Healthcare', 'Food & Beverages'].includes(category)
    ? new Date(Date.now() + getRandomNumber(30, 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : null;

  return {
    id,
    name,
    category,
    retail_price,
    cost_price,
    quantity,
    mst,
    expiry_date
  };
};

// Generate order products
const generateOrderProducts = (count: number) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    const product = generateProduct(getRandomNumber(1, 20));
    const quantity = getRandomNumber(1, 5);
    products.push({
      id: product.id,
      name: product.name,
      quantity,
      price: product.retail_price * quantity
    });
  }
  return products;
};

// Generate an order object
const generateOrder = (id: number, retailerId: number, distributorId: number) => {
  const status = getRandomElement(orderStatuses);
  const createdAt = getRandomRecentDate(60);

  // Only set these dates if appropriate for the status
  const dispatchedAt = ['DISPATCHED', 'DELIVERED'].includes(status) ? getRandomRecentDate(30) : null;
  const deliveredAt = status === 'DELIVERED' ? getRandomRecentDate(15) : null;

  const products = generateOrderProducts(getRandomNumber(1, 3));
  const price = products.reduce((sum, product) => sum + product.price, 0);

  return {
    id,
    status,
    price,
    createdAt,
    dispatchedAt,
    deliveredAt,
    retailer: generateRetailer(retailerId),
    distributor: generateDistributor(distributorId),
    products,
    request: {
      id: id + 200,
      price,
      createdAt: getRandomRecentDate(65) // Request created before order
    }
  };
};

// Generate a request object
const generateRequest = (id: number, retailerId: number, distributorId: number) => {
  const status = getRandomElement(requestStatuses);
  const createdAt = getRandomRecentDate(30);
  const products = generateOrderProducts(getRandomNumber(1, 3));

  return {
    id,
    status,
    createdAt,
    products,
    retailer: generateRetailer(retailerId),
    distributor: generateDistributor(distributorId)
  };
};

// Generate a delivery order
const generateDeliveryOrder = (id: number, retailerId: number, distributorId: number) => {
  const status = getRandomElement(['DISPATCHED', 'DELIVERED']);
  const dispatchedAt = getRandomRecentDate(10);
  const deliveredAt = status === 'DELIVERED' ? getRandomRecentDate(5) : null;

  // Estimate delivery 2 days after dispatch
  const dispatchDate = new Date(dispatchedAt);
  dispatchDate.setDate(dispatchDate.getDate() + 2);
  const estimatedDelivery = dispatchDate.toISOString();

  const products = generateOrderProducts(getRandomNumber(1, 3));
  const price = products.reduce((sum, product) => sum + product.price, 0);
  const distance = parseFloat((Math.random() * 15 + 3).toFixed(1));
  const route = getRandomElement(deliveryRoutes);

  const deliveryFeedback = status === 'DELIVERED' ? {
    rating: parseFloat((Math.random() * 1 + 4).toFixed(1)), // 4.0 to 5.0
    onTime: Math.random() > 0.2, // 80% on time
    comments: getRandomElement([
      "Great delivery service, arrived earlier than expected",
      "Delivered on time, good packaging",
      "Professional delivery person, careful with items",
      "Quick and efficient delivery",
      "Handled fragile items with care"
    ])
  } : null;

  return {
    id,
    status,
    price,
    dispatchedAt,
    deliveredAt,
    estimatedDelivery,
    retailer: generateRetailer(retailerId),
    distributor: generateDistributor(distributorId),
    products: products.map(p => ({ id: p.id, name: p.name, quantity: p.quantity })),
    distance,
    route,
    ...(deliveryFeedback && { deliveryFeedback })
  };
};

// Generate delivery route stats
const generateDeliveryRoute = (id: number, name: string) => {
  return {
    id,
    name,
    activeDeliveries: getRandomNumber(0, 3),
    completedDeliveries: getRandomNumber(8, 20),
    averageDistance: parseFloat((Math.random() * 10 + 5).toFixed(1)),
    averageDeliveryTime: getRandomNumber(30, 75) // minutes
  };
};

// Generate monthly stats
const generateMonthlyStats = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  return months.map(month => ({
    month,
    deliveries: getRandomNumber(25, 50),
    onTimeRate: parseFloat((Math.random() * 10 + 85).toFixed(1)) // 85% to 95%
  }));
};

// Generate distributor dashboard data
export const generateDistributorDashboardData = () => {
  // Generate products
  const products = Array.from({ length: getRandomNumber(15, 25) }, (_, i) =>
    generateProduct(i + 1)
  );

  // Generate distributor orders
  const distributorOrders = Array.from({ length: getRandomNumber(10, 20) }, (_, i) =>
    generateOrder(i + 101, getRandomNumber(201, 205), getRandomNumber(401, 405))
  );

  // Generate requests
  const requests = Array.from({ length: getRandomNumber(8, 15) }, (_, i) =>
    generateRequest(i + 301, getRandomNumber(201, 205), getRandomNumber(401, 405))
  );

  return {
    products,
    distributorOrders,
    requests
  };
};

// Generate retailer dashboard data
export const generateRetailerDashboardData = () => {
  // Generate orders
  const orders = Array.from({ length: getRandomNumber(10, 20) }, (_, i) =>
    generateOrder(i + 101, getRandomNumber(201, 205), getRandomNumber(401, 405))
  );

  // Generate requests
  const requests = Array.from({ length: getRandomNumber(5, 12) }, (_, i) =>
    generateRequest(i + 301, getRandomNumber(201, 205), getRandomNumber(401, 405))
  );

  // Generate inventory
  const inventory = Array.from({ length: getRandomNumber(12, 20) }, (_, i) =>
    generateProduct(i + 1)
  );

  // Generate distributors
  const distributors = Array.from({ length: 5 }, (_, i) =>
    generateDistributor(i + 401)
  );

  return {
    orders,
    requests,
    inventory,
    distributors
  };
};

// Generate delivery dashboard data
export const generateDeliveryDashboardData = () => {
  // Generate delivery orders
  const deliveryOrders = Array.from({ length: getRandomNumber(10, 15) }, (_, i) =>
    generateDeliveryOrder(i + 101, getRandomNumber(201, 205), getRandomNumber(401, 405))
  );

  // Generate delivery routes
  const deliveryRoutes = deliveryRoutes.map((name, i) =>
    generateDeliveryRoute(i + 1, name)
  );

  // Calculate delivery performance metrics
  const activeDeliveries = deliveryOrders.filter(o => o.status === 'DISPATCHED').length;
  const completedDeliveries = deliveryOrders.filter(o => o.status === 'DELIVERED').length;

  const deliveryPerformance = {
    onTimeDeliveryRate: parseFloat((Math.random() * 10 + 85).toFixed(1)), // 85% to 95%
    averageRating: parseFloat((Math.random() * 1 + 4).toFixed(1)), // 4.0 to 5.0
    averageDeliveryTime: getRandomNumber(35, 60), // minutes
    totalDistanceCovered: parseFloat((Math.random() * 300 + 200).toFixed(1)), // kilometers
    fuelEfficiency: parseFloat((Math.random() * 4 + 6).toFixed(1)), // km/liter
    totalDeliveriesCompleted: getRandomNumber(40, 60),
    activeDeliveries
  };

  // Generate monthly delivery stats
  const monthlyDeliveryStats = generateMonthlyStats();

  return {
    deliveryOrders,
    deliveryRoutes,
    deliveryPerformance,
    monthlyDeliveryStats
  };
};

// Generate all dashboard data
export const generateAllDashboardData = () => {
  return {
    distributor: generateDistributorDashboardData(),
    retailer: generateRetailerDashboardData(),
    delivery: generateDeliveryDashboardData()
  };
};
