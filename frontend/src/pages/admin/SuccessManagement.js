import React, { useEffect, useState } from 'react';
import { getSuccessEvents, createSuccessEvent, updateSuccessEvent, archiveSuccessEvent } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Archive, Trophy } from 'lucide-react';

const SuccessManagement = () => {
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', image_url: '', date: '' });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await getSuccessEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateSuccessEvent(editingEvent.id, formData);
        toast.success('Success event updated');
      } else {
        await createSuccessEvent(formData);
        toast.success('Success event created');
      }
      setDialogOpen(false);
      setEditingEvent(null);
      setFormData({ title: '', description: '', image_url: '', date: '' });
      loadEvents();
    } catch (error) {
      toast.error('Failed to save success event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({ title: event.title, description: event.description, image_url: event.image_url || '', date: event.date.split('T')[0] });
    setDialogOpen(true);
  };

  const handleArchive = async (eventId) => {
    try {
      await archiveSuccessEvent(eventId);
      toast.success('Success event archived');
      loadEvents();
    } catch (error) {
      toast.error('Failed to archive event');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold" data-testid="success-management-title">Success Events Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF7F00] text-black hover:bg-[#E67300]" onClick={() => { setEditingEvent(null); setFormData({ title: '', description: '', image_url: '', date: new Date().toISOString().split('T')[0] }); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Success Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#333333] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">{editingEvent ? 'Edit' : 'Add'} Success Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-[#F0F0F0]">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="description" className="text-[#F0F0F0]">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" rows={4} />
              </div>
              <div>
                <Label htmlFor="date" className="text-[#F0F0F0]">Date</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="image_url" className="text-[#F0F0F0]">Image URL (optional)</Label>
                <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <Button type="submit" className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300]">Save Event</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="bg-[#000000] border-[#333333]" data-testid={`event-${event.id}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Trophy className="h-8 w-8 text-[#FF7F00] flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                  <p className="text-xs text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(event)} size="sm" variant="outline" data-testid={`edit-button-${event.id}`}><Edit className="h-4 w-4" /></Button>
                <Button onClick={() => handleArchive(event.id)} size="sm" variant="outline" className="border-red-600 text-red-600" data-testid={`archive-button-${event.id}`}><Archive className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuccessManagement;