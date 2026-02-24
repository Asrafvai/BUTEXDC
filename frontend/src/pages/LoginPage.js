import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData);
      loginUser(response.data.access_token, response.data.user);
      toast.success('Login successful!');
      
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-[#000000] border-[#333333]" data-testid="login-card">
        <CardHeader>
          <CardTitle className="text-2xl text-[#F0F0F0]">Login</CardTitle>
          <CardDescription className="text-gray-400">Sign in to your BUTEX Debating Club account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[#F0F0F0]">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="login-email-input"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-[#F0F0F0]">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="login-password-input"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300] font-medium"
              disabled={loading}
              data-testid="login-submit-button"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#FF7F00] hover:underline" data-testid="signup-link">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
