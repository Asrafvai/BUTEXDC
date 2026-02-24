import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Bell, ArrowLeft, Calendar } from 'lucide-react';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);

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

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-[#FF7F00]" data-testid="back-home-button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
        
        <h1 className="text-5xl font-bold mb-4" data-testid="announcements-page-title">Announcements</h1>
        <p className="text-gray-400 mb-12">Stay updated with the latest news and events</p>

        <div className="space-y-6">
          {announcements.map((ann) => (
            <Card key={ann.id} className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all" data-testid={`announcement-${ann.id}`}>
              <CardContent className="p-6">
                {ann.image_url && (
                  <div className="aspect-video bg-[#252525] rounded-lg mb-4 overflow-hidden">
                    <img src={ann.image_url} alt={ann.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#FF7F00] text-sm mb-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(ann.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h2 className="text-2xl font-semibold mb-3">{ann.title}</h2>
                <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: ann.content }} />
              </CardContent>
            </Card>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No announcements yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
