import React, { useEffect, useState } from 'react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, archiveAnnouncement } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Archive, Calendar } from 'lucide-react';

const AnnouncementsManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', image_url: '' });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await getAnnouncements();
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, formData);
        toast.success('Announcement updated');
      } else {
        await createAnnouncement(formData);
        toast.success('Announcement created');
      }
      setDialogOpen(false);
      setEditingAnnouncement(null);
      setFormData({ title: '', content: '', image_url: '' });
      loadAnnouncements();
    } catch (error) {
      toast.error('Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({ title: announcement.title, content: announcement.content, image_url: announcement.image_url || '' });
    setDialogOpen(true);
  };

  const handleArchive = async (announcementId) => {
    try {
      await archiveAnnouncement(announcementId);
      toast.success('Announcement archived');
      loadAnnouncements();
    } catch (error) {
      toast.error('Failed to archive announcement');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold" data-testid="announcements-management-title">Announcements Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF7F00] text-black hover:bg-[#E67300]" onClick={() => { setEditingAnnouncement(null); setFormData({ title: '', content: '', image_url: '' }); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#333333] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">{editingAnnouncement ? 'Edit' : 'Add'} Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-[#F0F0F0]">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="content" className="text-[#F0F0F0]">Content</Label>
                <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" rows={6} />
              </div>
              <div>
                <Label htmlFor="image_url" className="text-[#F0F0F0]">Image URL (optional)</Label>
                <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <Button type="submit" className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300]">Save Announcement</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="bg-[#000000] border-[#333333]" data-testid={`announcement-${announcement.id}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{announcement.title}</h3>
                  <p className="text-gray-400 mb-3 line-clamp-2">{announcement.content}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(announcement)} size="sm" variant="outline" data-testid={`edit-button-${announcement.id}`}><Edit className="h-4 w-4" /></Button>
                  <Button onClick={() => handleArchive(announcement.id)} size="sm" variant="outline" className="border-red-600 text-red-600" data-testid={`archive-button-${announcement.id}`}><Archive className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsManagement;