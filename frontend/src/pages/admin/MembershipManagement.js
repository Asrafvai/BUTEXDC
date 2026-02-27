import React, { useEffect, useState } from 'react';
import { getMembershipContent, updateMembershipContent } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const MembershipManagement = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    photo_url: '',
    description: '',
    form_link: ''
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await getMembershipContent();
      setFormData({
        photo_url: response.data.photo_url || '',
        description: response.data.description,
        form_link: response.data.form_link
      });
    } catch (error) {
      console.error('Failed to load membership content:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMembershipContent(formData);
      toast.success('Membership content updated successfully');
    } catch (error) {
      toast.error('Failed to update membership content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8" data-testid="membership-management-title">Membership Page Management</h1>

      <Card className="bg-[#000000] border-[#333333]">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="photo_url" className="text-[#F0F0F0]">Cover Photo URL</Label>
              <Input
                id="photo_url"
                value={formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                placeholder="https://i.ibb.co/..."
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="photo-url-input"
              />
              <p className="text-xs text-gray-500 mt-1">Use ImgBB.com for easy uploads</p>
            </div>

            <div>
              <Label htmlFor="description" className="text-[#F0F0F0]">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                rows={6}
                placeholder="Tell potential members about BUTEX DC..."
                data-testid="description-input"
              />
            </div>

            <div>
              <Label htmlFor="form_link" className="text-[#F0F0F0]">Google Form Link</Label>
              <Input
                id="form_link"
                value={formData.form_link}
                onChange={(e) => setFormData({ ...formData, form_link: e.target.value })}
                required
                placeholder="https://forms.gle/..."
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="form-link-input"
              />
              <p className="text-xs text-gray-500 mt-1">Paste your Google Form shareable link here</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#FF7F00] text-black hover:bg-[#E67300]"
              data-testid="save-button"
            >
              <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : 'Save Membership Content'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipManagement;
