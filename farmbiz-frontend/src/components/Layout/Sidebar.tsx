import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingStorefrontIcon, 
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAppSelector } from '../../hooks/redux';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Businesses', href: '/businesses', icon: BuildingStorefrontIcon },
    { name: 'Activities', href: '/activities', icon: ClipboardDocumentListIcon },
  ];

  const farmerNavigation = [
    { name: 'Dashboard', href: '/farmer-dashboard', icon: ChartBarIcon },
    { name: 'My Activities', href: '/my-activities', icon: ClipboardDocumentListIcon },
    { name: 'Log Activity', href: '/log-activity', icon: ClipboardDocumentListIcon },
    { name: 'Collaborations', href: '/collaborations', icon: UserGroupIcon },
  ];

  const businessNavigation = [
    { name: 'Dashboard', href: '/business-dashboard', icon: ChartBarIcon },
    { name: 'My Businesses', href: '/my-businesses', icon: BuildingStorefrontIcon },
    { name: 'Create Business', href: '/create-business', icon: BuildingStorefrontIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      open ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 shadow-xl">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌾</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">farmBiz</span>
          </div>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            {/* Main Navigation */}
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          isActive(item.href) ? 'text-primary-700' : 'text-gray-400 group-hover:text-primary-700'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* User-specific navigation */}
            {isLoggedIn && (
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400 uppercase">
                  {user?.user_type === 'farmer' ? 'Farmer Tools' : 'Business Tools'}
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {(user?.user_type === 'farmer' ? farmerNavigation : businessNavigation).map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                          isActive(item.href)
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            isActive(item.href) ? 'text-primary-700' : 'text-gray-400 group-hover:text-primary-700'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
