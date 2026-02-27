import React, { useEffect, useState } from 'react';
import { getAlumni, createAlumni, updateAlumni, archiveAlumni } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Archive } from 'lucide-react';

const AlumniManagement = () => {
  const [alumni, setAlumni] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    designation: '', 
    batch: '', 
    current_occupation: '', 
    photo_url: '', 
    order_number: 1 
  });

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      const response = await getAlumni();
      setAlumni(response.data);
    } catch (error) {
      console.error('Failed to load alumni:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAlumni) {
        await updateAlumni(editingAlumni.id, formData);
        toast.success('Alumni updated');
      } else {
        await createAlumni(formData);
        toast.success('Alumni created');
      }
      setDialogOpen(false);
      setEditingAlumni(null);
      setFormData({ name: '', designation: '', batch: '', current_occupation: '', photo_url: '', order_number: 1 });
      loadAlumni();
    } catch (error) {
      toast.error('Failed to save alumni');
    }
  };

  const handleEdit = (alum) => {
    setEditingAlumni(alum);
    setFormData({ 
      name: alum.name, 
      designation: alum.designation, 
      batch: alum.batch, 
      current_occupation: alum.current_occupation, 
      photo_url: alum.photo_url || '', 
      order_number: alum.order_number 
    });
    setDialogOpen(true);
  };

  const handleArchive = async (alumniId) => {
    try {
      await archiveAlumni(alumniId);
      toast.success('Alumni archived');
      loadAlumni();
    } catch (error) {
      toast.error('Failed to archive alumni');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold" data-testid="alumni-management-title">Alumni Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF7F00] text-black hover:bg-[#E67300]" onClick={() => { setEditingAlumni(null); setFormData({ name: '', designation: '', batch: '', current_occupation: '', photo_url: '', order_number: alumni.length + 1 }); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Alumni
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#333333] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">{editingAlumni ? 'Edit' : 'Add'} Alumni</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-[#F0F0F0]">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="designation" className="text-[#F0F0F0]">Designation</Label>
                <Input id="designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="batch" className="text-[#F0F0F0]">Batch</Label>
                <Input id="batch" value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="occupation" className="text-[#F0F0F0]">Current Occupation</Label>
                <Input id="occupation" value={formData.current_occupation} onChange={(e) => setFormData({ ...formData, current_occupation: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="photo_url" className="text-[#F0F0F0]">Photo URL</Label>
                <Input id="photo_url" value={formData.photo_url} onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} placeholder="https://i.ibb.co/..." className="bg-[#252525] border-[#333333] text-white" />
                <p className="text-xs text-gray-500 mt-1">Use ImgBB.com for easy uploads</p>
              </div>
              <div>
                <Label htmlFor="order_number" className="text-[#F0F0F0]">Order</Label>
                <Input id="order_number" type="number" value={formData.order_number} onChange={(e) => setFormData({ ...formData, order_number: parseInt(e.target.value) })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <Button type="submit" className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300]">Save Alumni</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {alumni.map((alum) => (
          <Card key={alum.id} className="bg-[#000000] border-[#333333]">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">{alum.name}</h3>
              <p className="text-[#FF7F00] text-sm mb-1">{alum.designation}</p>
              <p className="text-gray-500 text-xs mb-2">Batch: {alum.batch}</p>
              <p className="text-gray-400 text-sm mb-4">{alum.current_occupation}</p>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(alum)} size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                <Button onClick={() => handleArchive(alum.id)} size="sm" variant="outline" className="border-red-600 text-red-600"><Archive className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlumniManagement;
