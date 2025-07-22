import React from 'react';
import { useAppSelector } from '../hooks/redux';

const FarmerDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Recent Activities</h3>
          <p className="text-gray-600">Track your latest farming activities and progress.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Incentive Points</h3>
          <p className="text-gray-600">View your earned points and available rewards.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Collaborations</h3>
          <p className="text-gray-600">Manage your collaborative farming projects.</p>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
