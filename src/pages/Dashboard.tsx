import React from "react";
import { useNavigate } from "react-router-dom";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate("/assessment");
  };

  const handleStartPractice = () => {
    navigate("/practice");
  };

  const handleViewReports = () => {
    navigate("/reports");
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentDashboard
        studentName="Alex"
        onStartAssessment={handleStartAssessment}
        onStartPractice={handleStartPractice}
        onViewReports={handleViewReports}
      />
    </div>
  );
};

export default Dashboard;