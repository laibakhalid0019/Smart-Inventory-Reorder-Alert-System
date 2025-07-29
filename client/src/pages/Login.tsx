import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/Store/authSlice.ts'; // <-- update this path as needed
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !selectedRole) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
          'http://localhost:3000/auth/login',
          {
            username: formData.username,
            password: formData.password
          },
          {
            withCredentials: true
          }
      );

      const { role, username } = response.data;

      // ✅ Save user to Redux
      dispatch(setUser({ username, role: role.toLowerCase() }));

      // ✅ Navigate based on role
      switch (role.toUpperCase()) {
        case 'RETAILER':
          navigate('/dashboard/retailer');
          break;
        case 'DELIVERY_AGENT':
          navigate('/dashboard/delivery');
          break;
        case 'DISTRIBUTOR':
          navigate('/dashboard/distributor');
          break;
        case 'ADMIN':
          navigate('/dashboard/admin');
          break;
        default:
          navigate('/');
      }

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${username}! Redirecting to ${role} dashboard...`
      });

    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/10 to-primary/10 p-4">
        <div className="w-full max-w-md space-y-6">
          <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4 hover:bg-accent/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <div className="p-3 rounded-xl brand-gradient group-hover:scale-110 transition-transform duration-300">
                <Package className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Stock
            </span>
            </Link>
          </div>

          <Card className="feature-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your Smart Stock dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={handleRoleChange} required>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/50">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                      <SelectItem value="delivery-agent">Delivery Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                    type="submit"
                    className="w-full brand-gradient text-white hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                >
                  {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                  ) : (
                      'Sign In'
                  )}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link
                      to="/signup"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign up here
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Login;
