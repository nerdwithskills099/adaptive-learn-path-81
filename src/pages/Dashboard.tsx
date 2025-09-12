import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/components/layout/app-layout';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  const handleStartPractice = () => {
    navigate('/practice');
  };

  const handleViewReports = () => {
    navigate('/reports');
  };

  // Get student name from profile or user email
  const studentName = profile?.first_name || user?.email?.split('@')[0] || 'Student';

  return (
    <AppLayout>
      <StudentDashboard 
        studentName={studentName}
        onStartAssessment={handleStartAssessment}
        onStartPractice={handleStartPractice}
        onViewReports={handleViewReports}
      />
    </AppLayout>
  );
};

export default Dashboard;