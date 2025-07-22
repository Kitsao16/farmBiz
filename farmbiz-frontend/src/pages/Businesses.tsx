import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchBusinesses } from '../redux/businessSlice';
import { Business } from '../types';
import { buildMediaUrl } from '../utils';

const Businesses: React.FC = () => {
  const dispatch = useAppDispatch();
  const { businesses, loading, error, pagination } = useAppSelector((state) => state.businesses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    dispatch(fetchBusinesses({ q: searchQuery, category: selectedCategory, page: 1 }));
  }, [dispatch, searchQuery, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchBusinesses({ q: searchQuery, category: selectedCategory, page: 1 }));
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'farm_produce', label: 'Farm Produce' },
    { value: 'agritourism', label: 'Agritourism' },
    { value: 'farm_supplies', label: 'Farm Supplies' },
    { value: 'services', label: 'Services' },
  ];

  if (loading && businesses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Businesses</h1>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/create-business"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Create Business
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {businesses.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No businesses found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.next && (
        <div className="text-center">
          <button
            onClick={() => dispatch(fetchBusinesses({ 
              q: searchQuery, 
              category: selectedCategory, 
              page: 2 
            }))}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

const BusinessCard: React.FC<{ business: Business }> = ({ business }) => {
  const imageUrl = business.image ? buildMediaUrl(business.image) : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={business.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
          {business.average_rating && (
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-sm text-gray-600">
                {business.average_rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {business.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {business.category.replace('_', ' ')}
          </span>
          <Link
            to={`/businesses/${business.id}`}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Businesses;
