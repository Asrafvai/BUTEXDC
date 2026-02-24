import React, { useEffect, useState } from 'react';
import { getLeadership, createLeadershipMember, updateLeadershipMember, archiveLeadershipMember } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Archive } from 'lucide-react';

const LeadershipManagement = () => {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ name: '', position: '', photo_url: '', order_number: 1 });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await getLeadership();
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to load leadership:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await updateLeadershipMember(editingMember.id, formData);
        toast.success('Member updated');
      } else {
        await createLeadershipMember(formData);
        toast.success('Member created');
      }
      setDialogOpen(false);
      setEditingMember(null);
      setFormData({ name: '', position: '', photo_url: '', order_number: 1 });
      loadMembers();
    } catch (error) {
      toast.error('Failed to save member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({ name: member.name, position: member.position, photo_url: member.photo_url || '', order_number: member.order_number });
    setDialogOpen(true);
  };

  const handleArchive = async (memberId) => {
    try {
      await archiveLeadershipMember(memberId);
      toast.success('Member archived');
      loadMembers();
    } catch (error) {
      toast.error('Failed to archive member');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Leadership Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF7F00] text-black hover:bg-[#E67300]" onClick={() => { setEditingMember(null); setFormData({ name: '', position: '', photo_url: '', order_number: members.length + 1 }); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#333333]">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">{editingMember ? 'Edit' : 'Add'} Leadership Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-[#F0F0F0]">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="position" className="text-[#F0F0F0]">Position</Label>
                <Input id="position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="photo_url" className="text-[#F0F0F0]">Photo URL</Label>
                <Input id="photo_url" value={formData.photo_url} onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <div>
                <Label htmlFor="order_number" className="text-[#F0F0F0]">Order</Label>
                <Input id="order_number" type="number" value={formData.order_number} onChange={(e) => setFormData({ ...formData, order_number: parseInt(e.target.value) })} required className="bg-[#252525] border-[#333333] text-white" />
              </div>
              <Button type="submit" className="w-full bg-[#FF7F00] text-black hover:bg-[#E67300]">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member.id} className="bg-[#000000] border-[#333333]">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
              <p className="text-[#FF7F00] text-sm mb-4">{member.position}</p>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(member)} size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                <Button onClick={() => handleArchive(member.id)} size="sm" variant="outline" className="border-red-600 text-red-600"><Archive className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeadershipManagement;
