import React from 'react';
import { useParams } from 'react-router-dom';

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Business Detail</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Business ID: {id}</p>
        <p className="text-gray-600">This page will show detailed business information, reviews, and contact details.</p>
      </div>
    </div>
  );
};

export default BusinessDetail;
