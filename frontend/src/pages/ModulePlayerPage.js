import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseModules, getUserProgress, updateProgress } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft, FileText, Video } from 'lucide-react';
import { toast } from 'sonner';

const ModulePlayerPage = () => {
  const { courseId, moduleId } = useParams();
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadModuleData();
  }, [moduleId]);

  const loadModuleData = async () => {
    try {
      const [modulesRes, progressRes] = await Promise.all([
        getCourseModules(courseId),
        getUserProgress()
      ]);
      
      setModules(modulesRes.data);
      const module = modulesRes.data.find(m => m.id === moduleId);
      setCurrentModule(module);
      
      const progressItem = progressRes.data.find(p => p.module_id === moduleId);
      setIsCompleted(progressItem?.completed || false);
    } catch (error) {
      console.error('Failed to load module:', error);
    }
  };

  const handleToggleComplete = async () => {
    try {
      await updateProgress({ module_id: moduleId, completed: !isCompleted });
      setIsCompleted(!isCompleted);
      toast.success(isCompleted ? 'Marked as incomplete' : 'Marked as complete!');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const goToNextModule = () => {
    const currentIndex = modules.findIndex(m => m.id === moduleId);
    if (currentIndex < modules.length - 1) {
      const nextModule = modules[currentIndex + 1];
      navigate(`/course/${courseId}/module/${nextModule.id}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  if (!currentModule) {
    return <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center"><div className="text-[#FF7F00]">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to={`/course/${courseId}`}>
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-[#FF7F00]" data-testid="back-course-button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" data-testid="module-title">{currentModule.title}</h1>
          {currentModule.duration && (
            <p className="text-gray-400">Duration: {currentModule.duration}</p>
          )}
        </div>

        {currentModule.video_link && (
          <Card className="bg-[#000000] border-[#333333] mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Video className="h-6 w-6 text-[#FF7F00]" />
                <h3 className="text-xl font-semibold">Video Content</h3>
              </div>
              <div className="aspect-video bg-[#252525] rounded-lg flex items-center justify-center">
                <a href={currentModule.video_link} target="_blank" rel="noopener noreferrer" className="text-[#FF7F00] hover:underline" data-testid="video-link">
                  Open Video Link
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {currentModule.pdf_link && (
          <Card className="bg-[#000000] border-[#333333] mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-[#FF7F00]" />
                <h3 className="text-xl font-semibold">PDF Materials</h3>
              </div>
              <a href={currentModule.pdf_link} target="_blank" rel="noopener noreferrer" className="text-[#FF7F00] hover:underline" data-testid="pdf-link">
                Open PDF Document
              </a>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox 
              checked={isCompleted} 
              onCheckedChange={handleToggleComplete}
              id="complete-checkbox"
              data-testid="complete-checkbox"
            />
            <label htmlFor="complete-checkbox" className="text-lg cursor-pointer">
              {isCompleted ? 'Completed' : 'Mark as complete'}
            </label>
          </div>
          <Button onClick={goToNextModule} className="bg-[#FF7F00] text-black hover:bg-[#E67300]" data-testid="next-module-button">
            Next Module
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModulePlayerPage;
