import React, { useEffect, useState } from 'react';
import { getCoachInfo, updateCoachInfo } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const CoachManagement = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    achievements: '',
    image_url: ''
  });

  useEffect(() => {
    loadCoachInfo();
  }, []);

  const loadCoachInfo = async () => {
    try {
      const response = await getCoachInfo();
      setFormData({
        name: response.data.name,
        bio: response.data.bio,
        achievements: response.data.achievements,
        image_url: response.data.image_url || ''
      });
    } catch (error) {
      console.error('Failed to load coach info:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCoachInfo(formData);
      toast.success('Coach information updated successfully');
    } catch (error) {
      toast.error('Failed to update coach information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8" data-testid="coach-management-title">Coach Information Management</h1>

      <Card className="bg-[#000000] border-[#333333]">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-[#F0F0F0]">Coach Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="coach-name-input"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-[#F0F0F0]">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                rows={4}
                data-testid="coach-bio-input"
              />
            </div>

            <div>
              <Label htmlFor="achievements" className="text-[#F0F0F0]">Achievements</Label>
              <Textarea
                id="achievements"
                value={formData.achievements}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                required
                className="bg-[#1A1A1A] border-[#333333] text-white"
                rows={8}
                placeholder="List achievements (one per line or numbered)"
                data-testid="coach-achievements-input"
              />
            </div>

            <div>
              <Label htmlFor="image_url" className="text-[#F0F0F0]">Image URL (optional)</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid="coach-image-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#FF7F00] text-black hover:bg-[#E67300]"
              data-testid="save-coach-button"
            >
              <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : 'Save Coach Information'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachManagement;