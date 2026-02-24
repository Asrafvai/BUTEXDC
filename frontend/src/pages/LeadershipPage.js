import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeadership } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, ArrowLeft } from 'lucide-react';

const LeadershipPage = () => {
  const [leadership, setLeadership] = useState([]);

  useEffect(() => {
    loadLeadership();
  }, []);

  const loadLeadership = async () => {
    try {
      const response = await getLeadership();
      setLeadership(response.data);
    } catch (error) {
      console.error('Failed to load leadership:', error);
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
        
        <h1 className="text-5xl font-bold mb-4" data-testid="leadership-page-title">Full Leadership Panel</h1>
        <p className="text-gray-400 mb-12">Meet the team leading BUTEX Debating Club</p>

        <div className="grid md:grid-cols-3 gap-8">
          {leadership.map((member) => (
            <Card key={member.id} className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all hover-lift overflow-hidden" data-testid={`leadership-member-${member.id}`}>
              <div className="aspect-square bg-[#252525] flex items-center justify-center">
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="h-24 w-24 text-gray-600" />
                )}
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-[#FF7F00] text-sm font-medium">{member.position}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadershipPage;
