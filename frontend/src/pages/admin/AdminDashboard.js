import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { 
  Users, BookOpen, Bell, Trophy, Home, BarChart, LogOut, 
  UserCog, FileEdit, GraduationCap, Menu, X 
} from 'lucide-react';

// Import admin sections (we'll create simplified versions)
import UsersManagement from './UsersManagement';
import LeadershipManagement from './LeadershipManagement';
import HomepageEditor from './HomepageEditor';
import CoursesManagement from './CoursesManagement';
import AnnouncementsManagement from './AnnouncementsManagement';
import SuccessManagement from './SuccessManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import CoachManagement from './CoachManagement';

const AdminDashboard = () => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/admin', label: 'Overview', icon: BarChart },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/leadership', label: 'Leadership', icon: UserCog },
    { path: '/admin/homepage', label: 'Homepage', icon: Home },
    { path: '/admin/courses', label: 'Courses', icon: BookOpen },
    { path: '/admin/announcements', label: 'Announcements', icon: Bell },
    { path: '/admin/success', label: 'Success Events', icon: Trophy },
    { path: '/admin/coach', label: 'Coach Info', icon: GraduationCap },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-[#333333] transform transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF7F00] rounded flex items-center justify-center text-black font-bold">
              A
            </div>
            <span className="font-semibold">Admin Panel</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-[#FF7F00] text-black' 
                    : 'text-gray-400 hover:bg-[#252525] hover:text-white'
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#333333]">
          <div className="mb-3 px-2">
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="font-medium text-sm">{user?.full_name}</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="w-full justify-start text-gray-400 hover:text-white"
            data-testid="admin-logout-button"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[#333333]">
          <button onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold">Admin Panel</span>
        </div>

        <div className="p-6 md:p-8">
          <Routes>
            <Route index element={<AnalyticsDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="leadership" element={<LeadershipManagement />} />
            <Route path="homepage" element={<HomepageEditor />} />
            <Route path="courses" element={<CoursesManagement />} />
            <Route path="announcements" element={<AnnouncementsManagement />} />
            <Route path="success" element={<SuccessManagement />} />
            <Route path="coach" element={<CoachManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
