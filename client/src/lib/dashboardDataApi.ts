import { store } from '@/Redux/Store';

/**
 * Helper functions to get dashboard data from Redux store for Gemini API calls
 * These functions extract the real data currently in your application's state
 */

// Get all dashboard data from Redux store
export const getAllDashboardData = () => {
  const state = store.getState();

  return {
    distributor: {
      products: state.products?.products || [],
      distributorOrders: state.orders?.distributorOrders || [],
      requests: state.distributorRequests?.requests || [],
    },
    retailer: {
      orders: state.orders?.orders || [],
      requests: state.requests?.requests || [],
      inventory: state.inventory?.products || [],
      distributors: state.distributors?.distributors || [],
    },
    delivery: {
      deliveryOrders: state.deliveryOrders?.orders || [],
      // Include any other delivery-related data from your state
      deliveryPerformance: calculateDeliveryPerformance(state.deliveryOrders?.orders || []),
    }
  };
};

// Get distributor dashboard data
export const getDistributorDashboardData = () => {
  const state = store.getState();

  return {
    products: state.products?.products || [],
    distributorOrders: state.orders?.distributorOrders || [],
    requests: state.distributorRequests?.requests || [],
  };
};

// Get retailer dashboard data
export const getRetailerDashboardData = () => {
  const state = store.getState();

  return {
    orders: state.orders?.orders || [],
    requests: state.requests?.requests || [],
    inventory: state.inventory?.products || [],
    distributors: state.distributors?.distributors || [],
  };
};

// Get delivery dashboard data
export const getDeliveryDashboardData = () => {
  const state = store.getState();
  const deliveryOrders = state.deliveryOrders?.orders || [];

  return {
    deliveryOrders,
    deliveryPerformance: calculateDeliveryPerformance(deliveryOrders),
    // Add other delivery-related data from your state as needed
  };
};

// Calculate delivery performance metrics from orders
const calculateDeliveryPerformance = (deliveryOrders) => {
  if (!deliveryOrders || deliveryOrders.length === 0) {
    return {
      onTimeDeliveryRate: 0,
      averageRating: 0,
      averageDeliveryTime: 0,
      totalDeliveriesCompleted: 0,
      activeDeliveries: 0
    };
  }

  const completedDeliveries = deliveryOrders.filter(order => order?.status === 'DELIVERED');
  const activeDeliveries = deliveryOrders.filter(order => order?.status === 'DISPATCHED');

  // Calculate on-time delivery rate
  const onTimeDeliveries = completedDeliveries.filter(order => {
    if (!order.deliveredAt || !order.estimatedDelivery) return false;
    return new Date(order.deliveredAt) <= new Date(order.estimatedDelivery);
  });

  const onTimeDeliveryRate = completedDeliveries.length
    ? (onTimeDeliveries.length / completedDeliveries.length) * 100
    : 0;

  // Calculate average rating if available
  const ordersWithRating = completedDeliveries.filter(order =>
    order.deliveryFeedback && typeof order.deliveryFeedback.rating === 'number'
  );

  const averageRating = ordersWithRating.length
    ? ordersWithRating.reduce((sum, order) => sum + order.deliveryFeedback.rating, 0) / ordersWithRating.length
    : 0;

  return {
    onTimeDeliveryRate: parseFloat(onTimeDeliveryRate.toFixed(1)),
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalDeliveriesCompleted: completedDeliveries.length,
    activeDeliveries: activeDeliveries.length,
  };
};

// Example of how to use with a specific dashboard type
export const getDashboardDataByType = (dashboardType: 'distributor' | 'retailer' | 'delivery' | 'all') => {
  switch (dashboardType) {
    case 'distributor':
      return getDistributorDashboardData();
    case 'retailer':
      return getRetailerDashboardData();
    case 'delivery':
      return getDeliveryDashboardData();
    case 'all':
    default:
      return getAllDashboardData();
  }
};
