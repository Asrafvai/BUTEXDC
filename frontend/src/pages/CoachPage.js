import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCoachInfo } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Award, User } from 'lucide-react';

const CoachPage = () => {
  const [coach, setCoach] = useState(null);

  useEffect(() => {
    loadCoachInfo();
  }, []);

  const loadCoachInfo = async () => {
    try {
      const response = await getCoachInfo();
      setCoach(response.data);
    } catch (error) {
      console.error('Failed to load coach info:', error);
    }
  };

  if (!coach) {
    return <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center"><div className="text-[#FF7F00]">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-[#FF7F00]" data-testid="back-dashboard-button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>

        <h1 className="text-5xl font-bold mb-12" data-testid="coach-page-title">Meet the Coach</h1>

        <Card className="bg-[#000000] border-[#333333]">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="w-48 h-48 bg-[#252525] rounded-lg flex items-center justify-center flex-shrink-0">
                {coach.image_url ? (
                  <img src={coach.image_url} alt={coach.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <User className="h-24 w-24 text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-3 text-[#FF7F00]" data-testid="coach-name">{coach.name}</h2>
                <p className="text-gray-300 text-lg leading-relaxed">{coach.bio}</p>
              </div>
            </div>

            <div className="border-t border-[#333333] pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-[#FF7F00]" />
                <h3 className="text-2xl font-semibold">Achievements</h3>
              </div>
              <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                {coach.achievements}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachPage;
