import React, { useEffect, useState } from 'react';
import { getHomepageContent, updateHomepageContent } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const HomepageEditor = () => {
  const [content, setContent] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await getHomepageContent();
      const contentMap = {};
      response.data.forEach(item => {
        contentMap[item.section] = item.content;
      });
      setContent(contentMap);
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      await updateHomepageContent({ section, content: content[section] });
      toast.success('Content updated successfully');
    } catch (error) {
      toast.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { key: 'hero_title', label: 'Hero Title', rows: 2 },
    { key: 'hero_subtitle', label: 'Hero Subtitle', rows: 2 },
    { key: 'about_university', label: 'About University', rows: 4 },
    { key: 'about_club', label: 'About Club', rows: 4 },
    { key: 'mission', label: 'Mission', rows: 3 },
    { key: 'vision', label: 'Vision', rows: 3 },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8" data-testid="homepage-editor-title">Homepage Content Editor</h1>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.key} className="bg-[#000000] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-xl">{section.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={content[section.key] || ''}
                onChange={(e) => setContent({ ...content, [section.key]: e.target.value })}
                rows={section.rows}
                className="bg-[#1A1A1A] border-[#333333] text-white"
                data-testid={`textarea-${section.key}`}
              />
              <Button 
                onClick={() => handleSave(section.key)} 
                disabled={saving}
                className="bg-[#FF7F00] text-black hover:bg-[#E67300]"
                data-testid={`save-button-${section.key}`}
              >
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomepageEditor;