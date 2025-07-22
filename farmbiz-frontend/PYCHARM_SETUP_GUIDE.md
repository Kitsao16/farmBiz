# 🐍 PyCharm Setup Guide for farmBiz Full-Stack Application

This guide explains how to set up and work with the farmBiz Django + React application in PyCharm on Ubuntu Linux.

## 📁 Project Structure Overview

```
/workspace/
├── farmBiz/                    # Django backend
│   ├── farmBiz/               # Django project settings
│   ├── farming/               # Main Django app
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   └── db.sqlite3            # SQLite database
└── farmbiz-frontend/          # React frontend
    ├── src/                   # React source code
    ├── public/                # Static assets
    ├── package.json           # Node.js dependencies
    └── README.md              # Frontend documentation
```

## �� PyCharm Setup Instructions

### 1. Opening the Project in PyCharm

**Option A: Full Workspace (Recommended)**
1. Open PyCharm
2. Click "Open" and select the `/workspace` directory
3. This will load both backend and frontend as a single project

**Option B: Separate Projects**
1. Open Django backend: Select `/workspace` directory
2. For frontend: File → Open → Select `/workspace/farmbiz-frontend`

### 2. Django Backend Configuration

#### Python Interpreter Setup:
1. Go to `File → Settings → Project → Python Interpreter`
2. Click the gear icon → Add...
3. Select "Virtualenv Environment" → Existing environment
4. If no virtual environment exists, create one:
   ```bash
   cd /workspace
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
5. Point to: `/workspace/venv/bin/python`

#### Django Configuration:
1. Go to `File → Settings → Languages & Frameworks → Django`
2. Check "Enable Django Support"
3. Set Django project root: `/workspace`
4. Set Settings: `farmBiz/settings.py`
5. Set Manage script: `/workspace/manage.py`

#### Database Setup:
1. Go to `View → Tool Windows → Database`
2. Click `+` → Data Source → SQLite
3. Set Database file: `/workspace/db.sqlite3`
4. Test connection and apply

### 3. React Frontend Configuration

#### Node.js Setup:
1. Go to `File → Settings → Languages & Frameworks → Node.js`
2. Set Node interpreter: `/usr/bin/node` (or your Node.js path)
3. Package manager: npm (`/usr/bin/npm`)

#### Essential Plugins (Install from Settings → Plugins):
- **React** - React development support
- **TypeScript** - TypeScript language support
- **Tailwind CSS** - Tailwind CSS IntelliSense
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting

#### TypeScript Configuration:
1. Go to `File → Settings → Languages & Frameworks → TypeScript`
2. Check "TypeScript Language Service"
3. Use TypeScript from: `farmbiz-frontend/node_modules/typescript`

## 🚀 Running the Application

### Method 1: PyCharm Run Configurations

#### Django Backend:
1. Click "Add Configuration" (top right)
2. Click `+` → Python → Django Server
3. Configuration:
   - Name: "farmBiz Backend"
   - Host: `127.0.0.1`
   - Port: `8000`
   - Environment variables: None needed
   - Python interpreter: Your virtual environment
4. Apply and run

#### React Frontend:
1. Click "Add Configuration" (top right)
2. Click `+` → npm
3. Configuration:
   - Name: "farmBiz Frontend"
   - Package.json: `/workspace/farmbiz-frontend/package.json`
   - Command: `run`
   - Scripts: `dev`
4. Apply and run

### Method 2: Terminal Commands

#### Backend (Django):
```bash
cd /workspace
source venv/bin/activate  # If using virtual environment
python manage.py runserver
```
Access at: http://localhost:8000

#### Frontend (React):
```bash
cd /workspace/farmbiz-frontend
npm run dev
```
Access at: http://localhost:5173

## 🔨 Development Workflow

### 1. Django Development:
- **Models**: Edit in `farming/models.py`
- **Views**: Edit in `farming/views.py` and `farming/views_auth.py`
- **URLs**: Edit in `farming/urls.py`
- **Admin**: Edit in `farming/admin.py`

### 2. React Development:
- **Components**: Create in `src/components/`
- **Pages**: Create in `src/pages/`
- **Services**: API calls in `src/services/`
- **Redux**: State management in `src/redux/`
- **Types**: TypeScript types in `src/types/`

### 3. Database Migrations:
```bash
cd /workspace
python manage.py makemigrations
python manage.py migrate
```

### 4. Creating Superuser:
```bash
cd /workspace
python manage.py createsuperuser
```

## 🐛 Debugging

### Django Debugging:
1. Set breakpoints in Python files
2. Run Django server in debug mode
3. Use PyCharm's integrated debugger

### React Debugging:
1. Use browser developer tools
2. Install React Developer Tools extension
3. Use console.log() for quick debugging
4. PyCharm supports JavaScript debugging with source maps

## 📦 Package Management

### Django Dependencies:
- Add to `requirements.txt`
- Install: `pip install package_name`
- Update requirements: `pip freeze > requirements.txt`

### React Dependencies:
- Install: `cd farmbiz-frontend && npm install package_name`
- Dev dependencies: `npm install --save-dev package_name`
- Update all: `npm update`

## 🔧 PyCharm Features to Use

### Code Quality:
1. **Code Inspection**: Automatic error detection
2. **Code Formatting**: Ctrl+Alt+L to format code
3. **Import Organization**: Ctrl+Alt+O to optimize imports
4. **Refactoring**: Right-click → Refactor for safe renaming

### Version Control:
1. **Git Integration**: Built-in Git support
2. **Commit**: Ctrl+K to commit changes
3. **Push**: Ctrl+Shift+K to push
4. **Branches**: VCS → Git → Branches

### Database Tools:
1. **Query Console**: Write and execute SQL
2. **Data Editor**: Edit table data directly
3. **Schema Viewer**: Visualize database structure

## 🌐 Network Configuration

### CORS Settings:
The Django backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative React port)

### API Endpoints:
- Django Admin: http://localhost:8000/admin/
- API Base: http://localhost:8000/api/
- React App: http://localhost:5173

## 🎯 Quick Tips

1. **Dual Monitor Setup**: Open Django in one PyCharm window, React in another
2. **Terminal Integration**: Use PyCharm's integrated terminal (Alt+F12)
3. **File Watchers**: Set up automatic code formatting on save
4. **Live Templates**: Create custom code snippets for common patterns
5. **Bookmarks**: Use Ctrl+F11 to bookmark important files
6. **Search Everywhere**: Double-press Shift to search anything

## 🔍 Troubleshooting

### Common Issues:

1. **Port Already in Use**:
   ```bash
   # Kill process on port 8000
   sudo lsof -t -i tcp:8000 | xargs kill -9
   # Kill process on port 5173  
   sudo lsof -t -i tcp:5173 | xargs kill -9
   ```

2. **Python Interpreter Not Found**:
   - Verify virtual environment is activated
   - Check PyCharm interpreter settings
   - Reinstall dependencies if needed

3. **Node.js Issues**:
   - Verify Node.js installation: `node --version`
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

4. **Database Locked**:
   - Ensure no other Django process is running
   - Check database file permissions
   - Restart PyCharm if needed

---

## 📚 Additional Resources

- [PyCharm Django Documentation](https://www.jetbrains.com/help/pycharm/django.html)
- [PyCharm React Documentation](https://www.jetbrains.com/help/pycharm/react.html)
- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

Happy coding! 🚀
