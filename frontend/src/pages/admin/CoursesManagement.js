import React, { useEffect, useState } from 'react';
import { getCourses, getCourseModules, createCourse, updateCourse, archiveCourse, createModule, updateModule, archiveModule } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { toast } from 'sonner';
import { Plus, Edit, Archive, BookOpen } from 'lucide-react';

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', outline: '', course_type: 'beginner', order_number: 1 });
  const [moduleForm, setModuleForm] = useState({ title: '', duration: '', video_link: '', pdf_link: '', order_number: 1 });

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

  const loadModules = async (courseId) => {
    try {
      const response = await getCourseModules(courseId);
      setModules(response.data);
      setSelectedCourse(courseId);
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseForm);
        toast.success('Course updated');
      } else {
        await createCourse(courseForm);
        toast.success('Course created');
      }
      setCourseDialogOpen(false);
      setEditingCourse(null);
      setCourseForm({ title: '', description: '', outline: '', course_type: 'beginner', order_number: 1 });
      loadCourses();
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    try {
      const moduleData = { ...moduleForm, course_id: selectedCourse };
      if (editingModule) {
        await updateModule(editingModule.id, moduleData);
        toast.success('Module updated');
      } else {
        await createModule(moduleData);
        toast.success('Module created');
      }
      setModuleDialogOpen(false);
      setEditingModule(null);
      setModuleForm({ title: '', duration: '', video_link: '', pdf_link: '', order_number: 1 });
      loadModules(selectedCourse);
    } catch (error) {
      toast.error('Failed to save module');
    }
  };

  const handleArchiveCourse = async (courseId) => {
    try {
      await archiveCourse(courseId);
      toast.success('Course archived');
      loadCourses();
    } catch (error) {
      toast.error('Failed to archive course');
    }
  };

  const handleArchiveModule = async (moduleId) => {
    try {
      await archiveModule(moduleId);
      toast.success('Module archived');
      loadModules(selectedCourse);
    } catch (error) {
      toast.error('Failed to archive module');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold" data-testid="courses-management-title">Courses Management</h1>
        <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF7F00] text-black hover:bg-[#E67300]" onClick={() => { setEditingCourse(null); setCourseForm({ title: '', description: '', outline: '', course_type: 'beginner', order_number: courses.length + 1 }); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#333333] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">{editingCourse ? 'Edit' : 'Add'} Course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-[#F0F0F0]">Title</Label>
                <Input id="title" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="description" className="text-[#F0F0F0]">Description</Label>
                <Textarea id="description" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" rows={4} />
              </div>
              <div>
                <Label htmlFor="outline" className="text-[#F0F0F0]">Outline</Label>
                <Textarea id="outline" value={courseForm.outline} onChange={(e) => setCourseForm({ ...courseForm, outline: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" rows={3} />
              </div>
              <div>
                <Label htmlFor="course_type" className="text-[#F0F0F0]">Type</Label>
                <select id="course_type" value={courseForm.course_type} onChange={(e) => setCourseForm({ ...courseForm, course_type: e.target.value })} className="w-full bg-[#252525] border border-[#333333] text-white rounded-md p-2">
                  <option value="beginner">Beginner</option>
                  <option value="advanced">Advanced</option>
                  <option value="mentorship">Mentorship</option>
                </select>
              </div>
              <div>
                <Label htmlFor="order_number" className="text-[#F0F0F0]">Order</Label>
                <Input id="order_number" type="number" value={courseForm.order_number} onChange={(e) => setCourseForm({ ...courseForm, order_number: parseInt(e.target.value) })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <Button type="submit" className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300]">Save Course</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="bg-[#000000] border-[#333333]">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-400 mb-2">{course.description}</p>
                  <p className="text-sm text-gray-500">{course.outline}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => { setEditingCourse(course); setCourseForm({ title: course.title, description: course.description, outline: course.outline, course_type: course.course_type, order_number: course.order_number }); setCourseDialogOpen(true); }} size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                  <Button onClick={() => handleArchiveCourse(course.id)} size="sm" variant="outline" className="border-red-600 text-red-600"><Archive className="h-4 w-4" /></Button>
                  <Button onClick={() => loadModules(course.id)} size="sm" className="bg-[#FF7F00] text-black hover:bg-[#E67300]"><BookOpen className="h-4 w-4 mr-1" /> Modules</Button>
                </div>
              </div>
              
              {selectedCourse === course.id && (
                <div className="border-t border-[#333333] pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-semibold">Modules</h4>
                    <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-[#FF7F00] text-black hover:bg-[#E67300]" onClick={() => { setEditingModule(null); setModuleForm({ title: '', duration: '', video_link: '', pdf_link: '', order_number: modules.length + 1 }); }}>
                          <Plus className="mr-2 h-4 w-4" /> Add Module
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1A1A1A] border-[#333333] max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-[#F0F0F0]">{editingModule ? 'Edit' : 'Add'} Module</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveModule} className="space-y-4">
                          <div>
                            <Label htmlFor="module_title" className="text-[#F0F0F0]">Title</Label>
                            <Input id="module_title" value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
                          </div>
                          <div>
                            <Label htmlFor="duration" className="text-[#F0F0F0]">Duration</Label>
                            <Input id="duration" value={moduleForm.duration} onChange={(e) => setModuleForm({ ...moduleForm, duration: e.target.value })} placeholder="e.g., 45 min" className="bg-[#252525] border-[#333333] text-white" />
                          </div>
                          <div>
                            <Label htmlFor="video_link" className="text-[#F0F0F0]">Video Link</Label>
                            <Input id="video_link" value={moduleForm.video_link} onChange={(e) => setModuleForm({ ...moduleForm, video_link: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="bg-[#252525] border-[#333333] text-white" />
                          </div>
                          <div>
                            <Label htmlFor="pdf_link" className="text-[#F0F0F0]">PDF Link</Label>
                            <Input id="pdf_link" value={moduleForm.pdf_link} onChange={(e) => setModuleForm({ ...moduleForm, pdf_link: e.target.value })} placeholder="https://..." className="bg-[#252525] border-[#333333] text-white" />
                          </div>
                          <div>
                            <Label htmlFor="module_order" className="text-[#F0F0F0]">Order</Label>
                            <Input id="module_order" type="number" value={moduleForm.order_number} onChange={(e) => setModuleForm({ ...moduleForm, order_number: parseInt(e.target.value) })} required className="bg-[#252525] border-[#333333] text-white" />
                          </div>
                          <Button type="submit" className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300]">Save Module</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    {modules.map((module, index) => (
                      <div key={module.id} className="flex items-center justify-between bg-[#252525] p-4 rounded-lg">
                        <div>
                          <p className="font-medium">{index + 1}. {module.title}</p>
                          <p className="text-sm text-gray-500">{module.duration}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => { setEditingModule(module); setModuleForm({ title: module.title, duration: module.duration, video_link: module.video_link, pdf_link: module.pdf_link, order_number: module.order_number }); setModuleDialogOpen(true); }} size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                          <Button onClick={() => handleArchiveModule(module.id)} size="sm" variant="outline" className="border-red-600 text-red-600"><Archive className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesManagement;