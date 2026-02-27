import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMembershipContent } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, UserPlus, ExternalLink } from 'lucide-react';

const BeAMemberPage = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await getMembershipContent();
      setContent(response.data);
    } catch (error) {
      console.error('Failed to load membership content:', error);
    }
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#FF7F00]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-[#FF7F00]" data-testid="back-home-button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" data-testid="member-page-title">Be a Member</h1>
          <p className="text-gray-400 text-lg">Join the BUTEX Debating Club community</p>
        </div>

        <Card className="bg-[#000000] border-[#333333] overflow-hidden">
          {content.photo_url && (
            <div className="aspect-[21/9] bg-[#252525] flex items-center justify-center overflow-hidden">
              <img src={content.photo_url} alt="Membership" className="w-full h-full object-cover" />
            </div>
          )}
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="h-8 w-8 text-[#FF7F00]" />
              <h2 className="text-3xl font-semibold text-white">Join Us Today</h2>
            </div>
            
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {content.description}
              </p>
            </div>

            {content.form_link && (
              <div className="flex justify-center">
                <a href={content.form_link} target="_blank" rel="noopener noreferrer">
                  <Button 
                    className="bg-[#FF7F00] text-white hover:bg-[#E67300] font-medium px-8 py-6 text-lg"
                    data-testid="membership-form-button"
                  >
                    Fill Membership Form <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            )}

            {!content.form_link && (
              <div className="text-center py-4">
                <p className="text-gray-500">Membership form link will be available soon</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BeAMemberPage;
