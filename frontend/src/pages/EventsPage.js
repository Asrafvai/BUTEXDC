import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Calendar, Clock, Image } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);

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

  const getDaysRemaining = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Event Passed', color: 'bg-gray-600' };
    if (diffDays === 0) return { text: 'Today!', color: 'bg-green-600' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'bg-[#FF7F00]' };
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'bg-[#FF7F00]' };
    return { text: `${diffDays} days left`, color: 'bg-blue-600' };
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-[#FF7F00]" data-testid="back-home-button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
        
        <h1 className="text-5xl font-bold mb-4" data-testid="events-page-title">Events and Sessions</h1>
        <p className="text-gray-400 mb-12">Stay updated with our latest events and activities</p>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event) => {
            const daysInfo = getDaysRemaining(event.date);
            return (
              <Card key={event.id} className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all overflow-hidden" data-testid={`event-card-${event.id}`}>
                <div className="aspect-video bg-[#252525] flex items-center justify-center relative">
                  {event.photo_url ? (
                    <img src={event.photo_url} alt={event.name} className="w-full h-full object-cover" />
                  ) : (
                    <Image className="h-24 w-24 text-gray-600" />
                  )}
                  <Badge className={`absolute top-4 right-4 ${daysInfo.color} text-white`}>
                    {daysInfo.text}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-[#FF7F00] text-sm mb-3">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">{event.name}</h3>
                  <p className="text-gray-300 leading-relaxed">{event.details}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
