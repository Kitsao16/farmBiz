# 🌾 farmBiz Backend

The **farmBiz-backend** is the RESTful API server for the farmBiz platform — a digital ecosystem created to empower smallholder farmers, support their businesses, track activities, and foster collaboration in modern agribusiness.

This backend is built with **Python 3.10+** using the **Django 5+** framework and is fully integrated with Django's admin interface for managing data.

---

## 🔧 Tech Stack

- **Framework:** Django 5.1
- **Database:** SQLite (development), easily switchable to PostgreSQL/MySQL for production
- **Authentication:** Django's built-in system + Token blacklisting
- **Deployment Ready:** Yes (Docker or traditional WSGI/ASGI-based deployment)
- **Admin Panel:** Yes (`/admin/`)

---

## 🧩 Key Functionalities

- 🧑‍🌾 Farmer account and profile management
- 🧺 Business management for farmers
- 🌱 Logging of farming activities
- 🤝 Support for collaborative agricultural projects
- 🎯 Tier-based incentive system
- 🔒 Token blacklist and session handling for secure authentication

---

## 📁 Project Structure

farmBiz-backend/
├── farmBiz/ # Django project settings
├── farming/ # Core app with models, views, and APIs
├── manage.py # Django CLI script
├── db.sqlite3 # Development DB
├── requirements.txt # Dependencies
├── generate_secret_key.py # Utility script
├── templates/ # HTML templates (if any)
├── debug.log # Logs
└── venv/ # Virtual environment (excluded via .gitignore)

yaml
Copy
Edit

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/Kitsao16/farmBiz.git
cd farmBiz/farmBiz-backend
Setup a virtual environment
bash
Copy
Edit
python3 -m venv venv
source venv/bin/activate
Install dependencies
bash
Copy
Edit
pip install -r requirements.txt
Run migrations
bash
Copy
Edit
python manage.py migrate
Create superuser (optional)
bash
Copy
Edit
python manage.py createsuperuser
Start the server
bash
Copy
Edit
python manage.py runserver
Access the admin panel at http://127.0.0.1:8000/admin/

🔐 Admin Modules (via Django Admin)
Module Name	Description
Users	System authentication users (login, roles)
Groups	User grouping for permission control
Farmers	Farmer profiles, identities, contacts
Businesss	Farmer-owned business listings
Farming activitys	Records of tasks such as planting, harvesting
Collaborations	Track shared/group farming projects
Incentives	Rewards or benefits for active participation
Tiers	Tier levels based on activity/performance
Token Blacklist	Expired/blacklisted tokens for security

📌 API Overview
⚠️ Ensure that your views are properly registered with Django REST Framework if APIs are being used.
The following is an overview based on your models and expected endpoints:

🔐 Authentication
Endpoint	Method	Description
/api/auth/login/	POST	User login (returns token)
/api/auth/logout/	POST	Invalidate JWT (blacklist)
/api/auth/refresh/	POST	Refresh JWT token
/api/auth/register/	POST	User registration

👨‍🌾 Farmers
Endpoint	Method	Description
/api/farmers/	GET	List all farmers
/api/farmers/	POST	Create a new farmer
/api/farmers/<id>/	GET	Retrieve a specific farmer
/api/farmers/<id>/	PUT	Update farmer profile
/api/farmers/<id>/	DELETE	Delete farmer profile

🧺 Businesses
Endpoint	Method	Description
/api/businesses/	GET	List all businesses
/api/businesses/	POST	Create new business
/api/businesses/<id>/	GET	Retrieve specific business
/api/businesses/<id>/	PUT	Update business details
/api/businesses/<id>/	DELETE	Delete a business

🌾 Farming Activities
Endpoint	Method	Description
/api/activities/	GET	List all farming activities
/api/activities/	POST	Create a new farming activity
/api/activities/<id>/	GET	View details of an activity
/api/activities/<id>/	PUT	Update an activity
/api/activities/<id>/	DELETE	Delete a farming activity

🤝 Collaborations
Endpoint	Method	Description
/api/collaborations/	GET	List all collaborations
/api/collaborations/	POST	Initiate a collaboration
/api/collaborations/<id>/	GET	View collaboration details
/api/collaborations/<id>/	PUT	Update collaboration info
/api/collaborations/<id>/	DELETE	End a collaboration

🎁 Incentives and Tiers
Endpoint	Method	Description
/api/incentives/	GET	View all incentives
/api/tiers/	GET	View membership tier structure

📦 .gitignore
gitignore
Copy
Edit
# Bytecode
__pycache__/
*.py[cod]

# Environment
venv/
.env

# DB & logs
db.sqlite3
debug.log

# Editor config
.vscode/
.idea/
.DS_Store
💡 Future Plans
✅ Full API documentation with Swagger

🧠 Machine Learning to analyze farming trends

📱 Mobile integration

📊 Analytics dashboards for productivity

🌐 Deployment on cloud (Azure/AWS)

👨🏾‍💻 Author
Name: Nick Kitsao

GitHub: @Kitsao16

Email: nickregankitsao@gmail.com


