import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RetailerDashboard from "./pages/Dashboard/RetailerDashboard";
import DistributorDashboard from "./pages/Dashboard/DistributorDashboard";
import DeliveryDashboard from "./pages/Dashboard/DeliveryDashboard";
import StockDisplay from "./pages/Retailer/StockDisplay";
import RestockProduct from "./pages/Retailer/RestockProduct";
import SelectDistributor from "./pages/Retailer/SelectDistributor";
import ViewSales from "./pages/Retailer/ViewSales";
import Requests from "./pages/Retailer/Requests";
import Orders from "./pages/Retailer/Orders";
import ViewProduct from "./pages/Distributor/ViewProduct";
import ViewRequest from "./pages/Distributor/ViewRequest";
import DistributorViewOrder from "./pages/Distributor/ViewOrder";
import ViewOrder from "./pages/Delivery/ViewOrder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const BrowsePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10 flex items-center justify-center">
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Browse Store - Coming Soon!</h1>
      <p className="text-xl text-muted-foreground">This feature will be available soon.</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/dashboard/retailer" element={<RetailerDashboard />} />
          <Route path="/dashboard/distributor" element={<DistributorDashboard />} />
          <Route path="/dashboard/delivery" element={<DeliveryDashboard />} />
           <Route path="/retailer/stock/display" element={<StockDisplay />} />
           <Route path="/retailer/stock/restock" element={<RestockProduct />} />
           <Route path="/retailer/stock/select-distributor" element={<SelectDistributor />} />
          <Route path="/retailer/stock/sales" element={<ViewSales />} />
          <Route path="/retailer/requests" element={<Requests />} />
          <Route path="/retailer/orders" element={<Orders />} />
          <Route path="/distributor/products" element={<ViewProduct />} />
          <Route path="/distributor/requests" element={<ViewRequest />} />
          <Route path="/distributor/orders" element={<DistributorViewOrder />} />
          <Route path="/delivery/orders" element={<ViewOrder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
