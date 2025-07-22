import React from 'react';
import { useAppSelector } from '../hooks/redux';

const BusinessDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Business Dashboard - {user?.username}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">My Businesses</h3>
          <p className="text-gray-600">Manage your business listings and details.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Reviews & Ratings</h3>
          <p className="text-gray-600">Monitor customer feedback and ratings.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Analytics</h3>
          <p className="text-gray-600">View business performance and insights.</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
