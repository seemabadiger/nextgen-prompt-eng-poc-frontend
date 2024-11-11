import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../Components/DashboardLayout';

const Dashboard = () => {
  return (
    <div className='container-fluid px-0'>
      <DashboardLayout />
    </div>
  );
};

export default Dashboard;