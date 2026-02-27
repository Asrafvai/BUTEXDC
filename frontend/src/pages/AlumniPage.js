import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAlumni } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Users, Briefcase } from 'lucide-react';

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      const response = await getAlumni();
      setAlumni(response.data);
    } catch (error) {
      console.error('Failed to load alumni:', error);
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
        
        <h1 className="text-5xl font-bold mb-4" data-testid="alumni-page-title">Alumni of BUTEX DC</h1>
        <p className="text-gray-400 mb-12">Meet our distinguished alumni who have made their mark</p>

        <div className="grid md:grid-cols-3 gap-8">
          {alumni.map((alum) => (
            <Card key={alum.id} className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all hover-lift overflow-hidden" data-testid={`alumni-card-${alum.id}`}>
              <div className="aspect-square bg-[#252525] flex items-center justify-center">
                {alum.photo_url ? (
                  <img src={alum.photo_url} alt={alum.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="h-24 w-24 text-gray-600" />
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{alum.name}</h3>
                <p className="text-[#FF7F00] text-sm mb-1">{alum.designation}</p>
                <p className="text-gray-500 text-xs mb-3">Batch: {alum.batch}</p>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <Briefcase className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#FF7F00]" />
                  <p>{alum.current_occupation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {alumni.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No alumni profiles yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniPage;
