import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomepageContent, getLeadership, getAnnouncements } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight, Users, Trophy, BookOpen } from 'lucide-react';

const HomePage = () => {
  const [content, setContent] = useState({});
  const [leadership, setLeadership] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contentRes, leadershipRes, announcementsRes] = await Promise.all([
        getHomepageContent(),
        getLeadership(),
        getAnnouncements()
      ]);
      
      const contentMap = {};
      contentRes.data.forEach(item => {
        contentMap[item.section] = item.content;
      });
      setContent(contentMap);
      setLeadership(leadershipRes.data.slice(0, 3));
      setAnnouncements(announcementsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to load homepage data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3" data-testid="home-logo-link">
            <img src="https://customer-assets.emergentagent.com/job_ab946127-7f68-445f-8cd6-0f1a2495b5eb/artifacts/rbz8vyvc_image.png" alt="BUTEX DC Logo" className="h-12" />
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/leadership" className="text-gray-300 hover:text-[#FF7F00] transition" data-testid="nav-leadership-link">Leadership</Link>
            <Link to="/success" className="text-gray-300 hover:text-[#FF7F00] transition" data-testid="nav-success-link">Success</Link>
            <Link to="/announcements" className="text-gray-300 hover:text-[#FF7F00] transition" data-testid="nav-announcements-link">Announcements</Link>
            <Link to="/courses" className="text-gray-300 hover:text-[#FF7F00] transition" data-testid="nav-courses-link">Courses</Link>
            <Link to="/login">
              <Button className="bg-[#FF7F00] text-black hover:bg-[#E67300] font-medium" data-testid="nav-login-button">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[#FF7F00]/15 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6" data-testid="hero-title">
            {content.hero_title || 'Welcome to BUTEX Debating Club'}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto" data-testid="hero-subtitle">
            {content.hero_subtitle || 'Empowering voices, shaping leaders'}
          </p>
          <Link to="/signup">
            <Button className="bg-[#FF7F00] text-black hover:bg-[#E67300] font-medium px-8 py-6 text-lg" data-testid="hero-get-started-button">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-black/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all" data-testid="about-university-card">
              <CardContent className="p-8">
                <h2 className="text-3xl font-semibold mb-4 text-[#FF7F00]">About Bangladesh University of Textiles</h2>
                <p className="text-gray-300 leading-relaxed">{content.about_university}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all" data-testid="about-club-card">
              <CardContent className="p-8">
                <h2 className="text-3xl font-semibold mb-4 text-[#FF7F00]">About BUTEX Debating Club</h2>
                <p className="text-gray-300 leading-relaxed">{content.about_club}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#FF7F00]/10 to-transparent border border-[#333333] rounded-lg p-8" data-testid="mission-card">
              <Trophy className="h-12 w-12 text-[#FF7F00] mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Mission</h3>
              <p className="text-gray-300">{content.mission}</p>
            </div>
            <div className="bg-gradient-to-br from-[#FF7F00]/10 to-transparent border border-[#333333] rounded-lg p-8" data-testid="vision-card">
              <BookOpen className="h-12 w-12 text-[#FF7F00] mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Vision</h3>
              <p className="text-gray-300">{content.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Preview */}
      <section className="py-16 bg-black/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-semibold" data-testid="leadership-section-title">Leadership</h2>
            <Link to="/leadership">
              <Button variant="ghost" className="text-[#FF7F00] hover:text-[#E67300]" data-testid="see-full-leadership-button">
                See Full Leadership Panel <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((member) => (
              <Card key={member.id} className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all overflow-hidden" data-testid={`leadership-card-${member.id}`}>
                <div className="aspect-square bg-[#252525] flex items-center justify-center">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="h-24 w-24 text-gray-600" />
                  )}
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-[#FF7F00] text-sm">{member.position}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-semibold" data-testid="announcements-section-title">Latest Announcements</h2>
            <Link to="/announcements">
              <Button variant="ghost" className="text-[#FF7F00] hover:text-[#E67300]" data-testid="see-all-announcements-button">
                See All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {announcements.map((ann) => (
              <Card key={ann.id} className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all" data-testid={`announcement-card-${ann.id}`}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{ann.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: ann.content }} />
                  <p className="text-xs text-gray-600 mt-3">{new Date(ann.created_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-[#333333] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} BUTEX Debating Club - Bangladesh University of Textiles</p>
          <p className="text-gray-600 text-sm mt-2">contact@butexdc.edu.bd</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
