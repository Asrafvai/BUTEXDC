import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, BookOpen, Clock, List, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const handleCourseClick = (course) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/course/${course.id}`);
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
        
        <h1 className="text-5xl font-bold mb-4" data-testid="courses-page-title">Our Courses</h1>
        <p className="text-gray-400 mb-12">Comprehensive training programs to master debate skills</p>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all hover-lift overflow-hidden cursor-pointer" onClick={() => handleCourseClick(course)} data-testid={`course-card-${course.id}`}>
              <div className="aspect-video bg-gradient-to-br from-[#FF7F00]/20 to-transparent flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-[#FF7F00]" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">{course.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{course.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <List className="h-4 w-4" />
                  <span>{course.outline}</span>
                </div>
                <Button className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300] font-medium" data-testid={`course-button-${course.id}`}>
                  View Course <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
