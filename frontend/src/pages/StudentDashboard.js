import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, getUserProgress, getAnnouncements, getEvents } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { AlertCircle, BookOpen, LogOut, Calendar, Bell, ArrowRight, Clock, ChevronRight } from 'lucide-react';

const StudentDashboard = () => {
  const { user, isApproved, hasMentorshipAccess, logoutUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isApproved) loadData();
  }, [isApproved]);

  const loadData = async () => {
    try {
      const [coursesRes, progressRes, annRes, eventsRes] = await Promise.all([
        getCourses(),
        getUserProgress(),
        getAnnouncements(),
        getEvents()
      ]);
      let availableCourses = coursesRes.data;
      if (!hasMentorshipAccess) {
        availableCourses = availableCourses.filter(c => c.course_type !== 'mentorship');
      }
      setCourses(availableCourses);
      setProgress(progressRes.data);
      setAnnouncements(annRes.data.slice(0, 3));
      setEvents(eventsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
        <Card className="max-w-md bg-[#000000] border-[#333333]" data-testid="pending-approval-card">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-[#FF7F00] mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Account Pending Approval</h2>
            <p className="text-gray-400 mb-6">Your account is awaiting admin approval. You'll be able to access courses once approved.</p>
            <Button onClick={handleLogout} variant="outline" className="border-[#333333]" data-testid="logout-button">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1" data-testid="dashboard-title">Welcome, {user?.full_name}</h1>
            <p className="text-gray-500 text-sm">Continue your learning journey</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white text-sm" data-testid="back-home-button">Home</Button>
            </Link>
            <Button onClick={handleLogout} variant="outline" className="border-[#333333] text-sm" data-testid="dashboard-logout-button">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Courses */}
        <section className="mb-12" data-testid="courses-section">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#FF7F00]" /> My Courses
            </h2>
            <Link to="/courses" className="text-[#FF7F00] text-sm hover:underline flex items-center gap-1" data-testid="view-all-courses">
              All Courses <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {courses.map((course) => {
              const courseProgress = progress.filter(p => p.course_id === course.id);
              const completed = courseProgress.filter(p => p.completed).length;
              const total = course.module_count || 0;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div
                  key={course.id}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="group relative bg-[#0A0A0A] border border-[#222] rounded-xl p-5 cursor-pointer hover:border-[#FF7F00]/40 transition-all duration-200"
                  data-testid={`course-card-${course.id}`}
                >
                  {/* Progress ring top-right */}
                  <div className="absolute top-4 right-4">
                    <svg width="44" height="44" viewBox="0 0 44 44">
                      <circle cx="22" cy="22" r="18" fill="none" stroke="#222" strokeWidth="3" />
                      <circle
                        cx="22" cy="22" r="18"
                        fill="none"
                        stroke="#FF7F00"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 18}`}
                        strokeDashoffset={`${2 * Math.PI * 18 * (1 - pct / 100)}`}
                        transform="rotate(-90 22 22)"
                        className="transition-all duration-500"
                      />
                      <text x="22" y="22" textAnchor="middle" dominantBaseline="central" className="fill-white text-[10px] font-semibold">
                        {pct}%
                      </text>
                    </svg>
                  </div>

                  <div className="pr-12">
                    <h3 className="text-base font-semibold text-white mb-1 group-hover:text-[#FF7F00] transition-colors">{course.title}</h3>
                    <p className="text-gray-500 text-xs mb-4 line-clamp-2">{course.description}</p>
                  </div>

                  {/* Bottom progress bar */}
                  <div className="mt-2">
                    <div className="h-1 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF7F00] to-[#FFa040] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] text-gray-600">
                      <span>{completed}/{total} modules</span>
                      <span className="text-[#FF7F00]">{pct > 0 ? 'In Progress' : 'Not Started'}</span>
                    </div>
                  </div>

                  <ChevronRight className="absolute bottom-5 right-5 h-4 w-4 text-gray-600 group-hover:text-[#FF7F00] transition-colors" />
                </div>
              );
            })}
          </div>
        </section>

        {/* Events & Announcements row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Events */}
          <section data-testid="events-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FF7F00]" /> Events and Sessions
              </h2>
              <Link to="/events" className="text-[#FF7F00] text-sm hover:underline flex items-center gap-1" data-testid="view-all-events">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {events.length > 0 ? events.map((evt) => (
                <Link
                  to="/events"
                  key={evt.id}
                  className="block bg-[#0A0A0A] border border-[#222] rounded-lg p-4 hover:border-[#FF7F00]/30 transition-all"
                  data-testid={`event-item-${evt.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#FF7F00]/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-[#FF7F00]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{evt.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </Link>
              )) : (
                <p className="text-gray-600 text-sm py-4 text-center" data-testid="no-events">No events yet</p>
              )}
            </div>
          </section>

          {/* Announcements */}
          <section data-testid="announcements-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#FF7F00]" /> Announcements
              </h2>
              <Link to="/announcements" className="text-[#FF7F00] text-sm hover:underline flex items-center gap-1" data-testid="view-all-announcements">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {announcements.length > 0 ? announcements.map((ann) => (
                <Link
                  to="/announcements"
                  key={ann.id}
                  className="block bg-[#0A0A0A] border border-[#222] rounded-lg p-4 hover:border-[#FF7F00]/30 transition-all"
                  data-testid={`announcement-item-${ann.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#FF7F00]/10 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-[#FF7F00]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{ann.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </Link>
              )) : (
                <p className="text-gray-600 text-sm py-4 text-center" data-testid="no-announcements">No announcements yet</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
