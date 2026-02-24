import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { checkSetupStatus, initializeSystem } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const SetupPage = () => {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const response = await checkSetupStatus();
      if (response.data.is_setup_complete) {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to check setup status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await initializeSystem({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });
      
      loginUser(response.data.access_token, response.data.user);
      toast.success('System initialized successfully!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to initialize system');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#FF7F00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-[#000000] border-[#333333]" data-testid="setup-card">
        <CardHeader>
          <CardTitle className="text-2xl text-[#F0F0F0]">System Setup</CardTitle>
          <CardDescription className="text-gray-400">Create the first admin account to initialize the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name" className="text-[#F0F0F0]">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="setup-full-name-input"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-[#F0F0F0]">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="setup-email-input"
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
                data-testid="setup-password-input"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-[#F0F0F0]">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="setup-confirm-password-input"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300] font-medium"
              disabled={loading}
              data-testid="setup-submit-button"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Initializing...</>
              ) : (
                'Initialize System'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupPage;
