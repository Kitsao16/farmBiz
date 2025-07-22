# 🌾 farmBiz Frontend

A modern React TypeScript frontend for the farmBiz platform - a digital ecosystem that empowers smallholder farmers, supports their businesses, tracks activities, and fosters collaboration in modern agribusiness.

## 🔧 Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Heroicons
- **UI Components:** Headless UI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Django backend running on `http://localhost:8000`

### Installation

1. **Clone and navigate to frontend:**
   ```bash
   cd farmbiz-frontend
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Open Browser:**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
farmbiz-frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Auth/            # Authentication components
│   │   ├── Business/        # Business-related components
│   │   ├── Layout/          # Layout components (Header, Sidebar)
│   │   └── Common/          # Common UI elements
│   ├── pages/               # Page components
│   ├── services/            # API service layers
│   ├── redux/               # Redux store and slices
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── App.tsx              # Main App component
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## 🔐 Authentication Flow

1. **User Registration:** Users can register as either farmers or business owners
2. **JWT Authentication:** Secure token-based authentication with auto-refresh
3. **Protected Routes:** Role-based access control for different user types
4. **Persistent Login:** Automatic token management with localStorage

## 🧩 Key Features

### For Farmers
- **Dashboard:** Overview of activities, incentives, and collaborations
- **Activity Logging:** Record farming activities with photos/videos
- **Collaboration:** Join and manage collaborative farming projects
- **Incentive Tracking:** Monitor points and rewards

### For Business Owners
- **Business Management:** Create and manage business listings
- **Review System:** Monitor customer feedback and ratings
- **Analytics:** View business performance metrics
- **Product Management:** Manage products and services

### General Features
- **Business Directory:** Browse and search agricultural businesses
- **Activity Feed:** View farming activities from the community
- **Responsive Design:** Mobile-first responsive UI
- **Real-time Updates:** Live data synchronization with backend

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 API Integration

The frontend integrates with the Django backend through:

- **Authentication Endpoints:** `/api/login/`, `/api/register/`, `/api/logout/`
- **Business Endpoints:** `/api/list-businesses/`, `/api/create-business/`
- **Activity Endpoints:** `/api/activities/`, `/api/log_activity/`
- **User Management:** `/api/auth/status/`

## 🎨 UI/UX Design

- **Color Scheme:** Green primary colors representing agriculture
- **Typography:** Inter font for modern readability
- **Components:** Consistent design system with Tailwind CSS
- **Accessibility:** WCAG compliant design patterns

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```
VITE_API_URL=https://your-backend-domain.com/api
```

## 🔧 Development with PyCharm

### Setting up in PyCharm:

1. **Open Project:** Open the `farmbiz-frontend` directory in PyCharm
2. **Configure Node.js:** Go to Settings → Languages & Frameworks → Node.js
3. **Install Plugins:** Ensure React, TypeScript, and Tailwind CSS plugins are installed
4. **Run Configuration:** Create a new npm run configuration for `dev` script

### Recommended PyCharm Plugins:
- React
- TypeScript
- Tailwind CSS
- ESLint
- Prettier

## 🤝 Integration with Django Backend

The frontend is designed to work seamlessly with the farmBiz Django backend:

- **CORS Configuration:** Backend is configured to allow requests from `localhost:5173`
- **JWT Token Management:** Automatic token refresh and authentication handling
- **File Uploads:** Support for image/video uploads to Django media storage
- **Data Synchronization:** Real-time sync with Django REST API endpoints

## 📱 Responsive Design

- **Mobile First:** Optimized for mobile devices
- **Tablet Support:** Responsive layouts for tablets
- **Desktop:** Full-featured desktop experience
- **Touch Friendly:** Touch-optimized UI elements

## 🔒 Security Features

- **XSS Protection:** Input sanitization and validation
- **CSRF Protection:** Token-based request authentication
- **Secure Storage:** Secure token storage with automatic cleanup
- **Input Validation:** Client-side validation with backend verification

---

Built with ❤️ for the agricultural community using modern web technologies.
