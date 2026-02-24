import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, getUserProgress } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { AlertCircle, BookOpen, LogOut, Award } from 'lucide-react';

const StudentDashboard = () => {
  const { user, isApproved, hasMentorshipAccess, logoutUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isApproved) {
      loadData();
    }
  }, [isApproved]);

  const loadData = async () => {
    try {
      const [coursesRes, progressRes] = await Promise.all([
        getCourses(),
        getUserProgress()
      ]);
      
      let availableCourses = coursesRes.data;
      if (!hasMentorshipAccess) {
        availableCourses = availableCourses.filter(c => c.course_type !== 'mentorship');
      }
      
      setCourses(availableCourses);
      setProgress(progressRes.data);
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" data-testid="dashboard-title">Welcome, {user?.full_name}</h1>
            <p className="text-gray-400">Continue your learning journey</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-[#333333]" data-testid="dashboard-logout-button">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => {
            const completedModules = progress.filter(p => p.completed).length;
            const progressPercent = 0;
            
            return (
              <Card key={course.id} className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all cursor-pointer" onClick={() => navigate(`/course/${course.id}`)} data-testid={`course-card-${course.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="h-8 w-8 text-[#FF7F00]" />
                    <h3 className="text-xl font-semibold">{course.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-[#FF7F00] font-medium">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
