import React from 'react';
import AppLayout from '@/components/layout/app-layout';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';

const Dashboard = () => {
  return (
    <AppLayout>
      <StudentDashboard />
    </AppLayout>
  );
};

export default Dashboard;