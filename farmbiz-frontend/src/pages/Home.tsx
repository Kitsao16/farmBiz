import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

const Home: React.FC = () => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg text-white p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to farmBiz
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Empowering smallholder farmers with digital tools for modern agribusiness
          </p>
          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Get Started
              </Link>
              <Link
                to="/businesses"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
              >
                Explore Businesses
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={user?.user_type === 'farmer' ? '/farmer-dashboard' : '/business-dashboard'}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/activities"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
              >
                View Activities
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🌱</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Track Activities</h3>
          <p className="text-gray-600">
            Log and monitor your farming activities with detailed records and blockchain verification.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏪</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Manage Business</h3>
          <p className="text-gray-600">
            Create and manage your agricultural business listings with customer reviews and ratings.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Collaborate</h3>
          <p className="text-gray-600">
            Connect with other farmers for collaborative projects and shared agricultural activities.
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          Join Our Growing Community
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">500+</div>
            <div className="text-gray-600">Active Farmers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">200+</div>
            <div className="text-gray-600">Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">1000+</div>
            <div className="text-gray-600">Activities Logged</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">50+</div>
            <div className="text-gray-600">Collaborations</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isLoggedIn && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Join farmBiz today and start managing your agricultural business digitally.
          </p>
          <Link
            to="/register"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
          >
            Create Your Account
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
