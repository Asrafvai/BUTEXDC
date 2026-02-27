import React, { useEffect, useState } from 'react';
import { getEvents, createEvent, updateEvent, archiveEvent } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Archive, Calendar, Video, FileText } from 'lucide-react';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    date: '', 
    photo_url: '', 
    details: '',
    video_link: '',
    note_link: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
        toast.success('Event updated');
      } else {
        await createEvent(formData);
        toast.success('Event created');
      }
      setDialogOpen(false);
      setEditingEvent(null);
      setFormData({ name: '', date: '', photo_url: '', details: '', video_link: '', note_link: '' });
      loadEvents();
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({ 
      name: event.name, 
      date: event.date.split('T')[0],
      photo_url: event.photo_url || '', 
      details: event.details,
      video_link: event.video_link || '',
      note_link: event.note_link || ''
    });
    setDialogOpen(true);
  };

  const handleArchive = async (eventId) => {
    try {
      await archiveEvent(eventId);
      toast.success('Event archived');
      loadEvents();
    } catch (error) {
      toast.error('Failed to archive event');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold" data-testid="events-management-title">Events and Sessions Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF7F00] text-black hover:bg-[#E67300]" onClick={() => { setEditingEvent(null); setFormData({ name: '', date: new Date().toISOString().split('T')[0], photo_url: '', details: '', video_link: '', note_link: '' }); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#333333] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">{editingEvent ? 'Edit' : 'Add'} Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-[#F0F0F0]">Event Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" data-testid="event-name-input" />
              </div>
              <div>
                <Label htmlFor="date" className="text-[#F0F0F0]">Event Date</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" data-testid="event-date-input" />
              </div>
              <div>
                <Label htmlFor="details" className="text-[#F0F0F0]">Event Details</Label>
                <Textarea id="details" value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" rows={4} data-testid="event-details-input" />
              </div>
              <div>
                <Label htmlFor="photo_url" className="text-[#F0F0F0]">Photo URL</Label>
                <Input id="photo_url" value={formData.photo_url} onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} placeholder="https://i.ibb.co/..." className="bg-[#252525] border-[#333333] text-white" data-testid="event-photo-input" />
                <p className="text-xs text-gray-500 mt-1">Use ImgBB.com for easy uploads</p>
              </div>
              <div>
                <Label htmlFor="video_link" className="text-[#F0F0F0]">Video Link (optional)</Label>
                <Input id="video_link" value={formData.video_link} onChange={(e) => setFormData({ ...formData, video_link: e.target.value })} placeholder="https://youtube.com/..." className="bg-[#252525] border-[#333333] text-white" data-testid="event-video-input" />
              </div>
              <div>
                <Label htmlFor="note_link" className="text-[#F0F0F0]">Note Link (optional)</Label>
                <Input id="note_link" value={formData.note_link} onChange={(e) => setFormData({ ...formData, note_link: e.target.value })} placeholder="https://drive.google.com/..." className="bg-[#252525] border-[#333333] text-white" data-testid="event-note-input" />
              </div>
              <Button type="submit" className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300]" data-testid="event-save-button">Save Event</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="bg-[#000000] border-[#333333]" data-testid={`event-${event.id}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-[#FF7F00] text-sm mb-2">
                <Calendar className="h-4 w-4" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{event.name}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.details}</p>
              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                {event.video_link ? (
                  <span className="flex items-center gap-1 text-green-400"><Video className="h-3 w-3" /> Video attached</span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-600"><Video className="h-3 w-3" /> No video</span>
                )}
                {event.note_link ? (
                  <span className="flex items-center gap-1 text-green-400"><FileText className="h-3 w-3" /> Note attached</span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-600"><FileText className="h-3 w-3" /> No note</span>
                )}
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

export default EventsManagement;
