import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSuccessEvents } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Trophy, ArrowLeft, Calendar } from 'lucide-react';

const PreviousSuccessPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await getSuccessEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load success events:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-[#FF7F00]" data-testid="back-home-button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
        
        <h1 className="text-5xl font-bold mb-4" data-testid="success-page-title">Previous Success</h1>
        <p className="text-gray-400 mb-12">Celebrating our achievements and milestones</p>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all hover-lift overflow-hidden" data-testid={`success-event-${event.id}`}>
              <div className="aspect-video bg-[#252525] flex items-center justify-center">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <Trophy className="h-24 w-24 text-gray-600" />
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-[#FF7F00] text-sm mb-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No success events yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousSuccessPage;
