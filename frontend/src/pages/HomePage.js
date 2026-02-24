import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomepageContent, getLeadership, getAnnouncements } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight, Users, Trophy, BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const HomePage = () => {
  const [content, setContent] = useState({});
  const [leadership, setLeadership] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const { isDark, toggleTheme } = useTheme();

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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-black/60 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3" data-testid="home-logo-link">
            <img src="https://customer-assets.emergentagent.com/job_ab946127-7f68-445f-8cd6-0f1a2495b5eb/artifacts/rbz8vyvc_image.png" alt="BUTEX DC Logo" className="h-16" />
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/leadership" className={`transition ${isDark ? 'text-gray-300 hover:text-[#FF7F00]' : 'text-gray-700 hover:text-[#FF7F00]'}`} data-testid="nav-leadership-link">Leadership</Link>
            <Link to="/success" className={`transition ${isDark ? 'text-gray-300 hover:text-[#FF7F00]' : 'text-gray-700 hover:text-[#FF7F00]'}`} data-testid="nav-success-link">Success</Link>
            <Link to="/announcements" className={`transition ${isDark ? 'text-gray-300 hover:text-[#FF7F00]' : 'text-gray-700 hover:text-[#FF7F00]'}`} data-testid="nav-announcements-link">Announcements</Link>
            <Link to="/courses" className={`transition ${isDark ? 'text-gray-300 hover:text-[#FF7F00]' : 'text-gray-700 hover:text-[#FF7F00]'}`} data-testid="nav-courses-link">Courses</Link>
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className={isDark ? 'border-[#333333] hover:bg-[#252525]' : 'border-gray-300 hover:bg-gray-100'}
              data-testid="theme-toggle-button"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/login">
              <Button className="bg-[#FF7F00] text-white hover:bg-[#E67300] font-medium" data-testid="nav-login-button">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[#FF7F00]/15 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className={`text-5xl md:text-6xl font-bold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`} data-testid="hero-title">
            {content.hero_title || 'Welcome to BUTEX Debating Club'}
          </h1>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`} data-testid="hero-subtitle">
            {content.hero_subtitle || 'Empowering voices, shaping leaders'}
          </p>
          <Link to="/signup">
            <Button className="bg-[#FF7F00] text-white hover:bg-[#E67300] font-medium px-8 py-6 text-lg" data-testid="hero-get-started-button">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className={`py-16 ${isDark ? 'bg-black/40' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className={`${isDark ? 'bg-[#000000] border-[#333333]' : 'bg-white border-gray-200'} hover:border-[#FF7F00]/50 transition-all`} data-testid="about-university-card">
              <CardContent className="p-8">
                <h2 className="text-3xl font-semibold mb-4 text-[#FF7F00]">About Bangladesh University of Textiles</h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{content.about_university}</p>
              </CardContent>
            </Card>
            <Card className={`${isDark ? 'bg-[#000000] border-[#333333]' : 'bg-white border-gray-200'} hover:border-[#FF7F00]/50 transition-all`} data-testid="about-club-card">
              <CardContent className="p-8">
                <h2 className="text-3xl font-semibold mb-4 text-[#FF7F00]">About BUTEX Debating Club</h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{content.about_club}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`bg-gradient-to-br from-[#FF7F00]/10 to-transparent ${isDark ? 'border-[#333333]' : 'border-gray-200'} border rounded-lg p-8`} data-testid="mission-card">
              <Trophy className="h-12 w-12 text-[#FF7F00] mb-4" />
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>Mission</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{content.mission}</p>
            </div>
            <div className={`bg-gradient-to-br from-[#FF7F00]/10 to-transparent ${isDark ? 'border-[#333333]' : 'border-gray-200'} border rounded-lg p-8`} data-testid="vision-card">
              <BookOpen className="h-12 w-12 text-[#FF7F00] mb-4" />
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>Vision</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{content.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Preview */}
      <section className={`py-16 ${isDark ? 'bg-black/40' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-4xl font-semibold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`} data-testid="leadership-section-title">Leadership</h2>
            <Link to="/leadership">
              <Button variant="ghost" className="text-[#FF7F00] hover:text-[#E67300]" data-testid="see-full-leadership-button">
                See Full Leadership Panel <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((member) => (
              <Card key={member.id} className={`${isDark ? 'bg-[#000000] border-[#333333]' : 'bg-white border-gray-200'} hover:border-[#FF7F00]/50 transition-all overflow-hidden`} data-testid={`leadership-card-${member.id}`}>
                <div className={`aspect-square ${isDark ? 'bg-[#252525]' : 'bg-gray-100'} flex items-center justify-center`}>
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className={`h-24 w-24 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  )}
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className={`text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>{member.name}</h3>
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
            <h2 className={`text-4xl font-semibold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`} data-testid="announcements-section-title">Latest Announcements</h2>
            <Link to="/announcements">
              <Button variant="ghost" className="text-[#FF7F00] hover:text-[#E67300]" data-testid="see-all-announcements-button">
                See All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {announcements.map((ann) => (
              <Card key={ann.id} className={`${isDark ? 'bg-[#000000] border-[#333333]' : 'bg-white border-gray-200'} hover:border-[#FF7F00]/50 transition-all`} data-testid={`announcement-card-${ann.id}`}>
                <CardContent className="p-6">
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>{ann.title}</h3>
                  <p className={`text-sm line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} dangerouslySetInnerHTML={{ __html: ann.content }} />
                  <p className={`text-xs mt-3 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>{new Date(ann.created_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-black border-[#333333]' : 'bg-gray-100 border-gray-200'} border-t py-8`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>© {new Date().getFullYear()} BUTEX Debating Club - Bangladesh University of Textiles</p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>contact@butexdc.edu.bd</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
