import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, CheckCircle, Clock, Award, TrendingUp } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  if (!analytics) {
    return <div className="text-[#FF7F00]">Loading analytics...</div>;
  }

  const stats = [
    { label: 'Total Users', value: analytics.total_users, icon: Users, color: 'text-blue-500' },
    { label: 'Approved Users', value: analytics.approved_users, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Pending Users', value: analytics.pending_users, icon: Clock, color: 'text-yellow-500' },
    { label: 'Active Users (30d)', value: analytics.active_users, icon: TrendingUp, color: 'text-[#FF7F00]' },
    { label: 'Mentorship Users', value: analytics.mentorship_users, icon: Award, color: 'text-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8" data-testid="analytics-title">Analytics Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-[#000000] border-[#333333]" data-testid={`stat-card-${stat.label}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-[#000000] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-2xl">Course Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.course_stats.map((course) => (
              <div key={course.course_id} className="border border-[#333333] rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">{course.course_title}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Enrolled</p>
                    <p className="text-2xl font-semibold">{course.enrolled}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-semibold">{course.completed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                    <p className="text-2xl font-semibold text-[#FF7F00]">{course.completion_rate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
