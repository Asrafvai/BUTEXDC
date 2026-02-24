import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    batch: '',
    reason: ''
  });
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signup(formData);
      loginUser(response.data.access_token, response.data.user);
      toast.success('Account created! Waiting for admin approval.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-[#000000] border-[#333333]" data-testid="signup-card">
        <CardHeader>
          <CardTitle className="text-2xl text-[#F0F0F0]">Sign Up</CardTitle>
          <CardDescription className="text-gray-400">Create your BUTEX Debating Club account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name" className="text-[#F0F0F0]">Full Name *</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="signup-full-name-input"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-[#F0F0F0]">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="signup-email-input"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-[#F0F0F0]">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="signup-password-input"
              />
            </div>
            <div>
              <Label htmlFor="batch" className="text-[#F0F0F0]">Batch / University ID</Label>
              <Input
                id="batch"
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="signup-batch-input"
              />
            </div>
            <div>
              <Label htmlFor="reason" className="text-[#F0F0F0]">Why do you want to join?</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="bg-[#1A1A1A] border-[#333333] text-white min-h-[80px]"
                data-testid="signup-reason-input"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300] font-medium"
              disabled={loading}
              data-testid="signup-submit-button"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF7F00] hover:underline" data-testid="login-link">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
