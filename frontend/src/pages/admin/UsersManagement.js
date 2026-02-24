import React, { useEffect, useState } from 'react';
import { getAllUsers, approveUser, toggleMentorship, archiveUser } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, Award, Archive } from 'lucide-react';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getAllUsers({});
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      toast.success('User approved');
      loadUsers();
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleToggleMentorship = async (userId, currentStatus) => {
    try {
      await toggleMentorship(userId, !currentStatus);
      toast.success(currentStatus ? 'Mentorship revoked' : 'Mentorship granted');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update mentorship');
    }
  };

  const handleArchive = async (userId) => {
    try {
      await archiveUser(userId);
      toast.success('User archived');
      loadUsers();
    } catch (error) {
      toast.error('Failed to archive user');
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'pending') return u.status === 'pending';
    if (filter === 'approved') return u.status === 'approved';
    return true;
  });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8" data-testid="users-management-title">Users Management</h1>

      <div className="flex gap-2 mb-6">
        <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'default' : 'outline'} className={filter === 'all' ? 'bg-[#FF7F00] text-black' : ''}>
          All
        </Button>
        <Button onClick={() => setFilter('pending')} variant={filter === 'pending' ? 'default' : 'outline'} className={filter === 'pending' ? 'bg-[#FF7F00] text-black' : ''}>
          Pending
        </Button>
        <Button onClick={() => setFilter('approved')} variant={filter === 'approved' ? 'default' : 'outline'} className={filter === 'approved' ? 'bg-[#FF7F00] text-black' : ''}>
          Approved
        </Button>
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="bg-[#000000] border-[#333333]" data-testid={`user-card-${user.id}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{user.full_name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{user.email}</p>
                  <div className="flex gap-2 mb-2">
                    <Badge variant={user.status === 'approved' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    {user.mentorship_access && <Badge className="bg-purple-600">Mentorship</Badge>}
                  </div>
                  {user.batch && <p className="text-sm text-gray-500">Batch: {user.batch}</p>}
                </div>
                <div className="flex gap-2">
                  {user.status === 'pending' && (
                    <Button onClick={() => handleApprove(user.id)} size="sm" className="bg-green-600 hover:bg-green-700" data-testid={`approve-button-${user.id}`}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  )}
                  <Button onClick={() => handleToggleMentorship(user.id, user.mentorship_access)} size="sm" variant="outline" data-testid={`mentorship-button-${user.id}`}>
                    <Award className="h-4 w-4 mr-1" /> {user.mentorship_access ? 'Revoke' : 'Grant'} Mentorship
                  </Button>
                  <Button onClick={() => handleArchive(user.id)} size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white" data-testid={`archive-button-${user.id}`}>
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersManagement;
