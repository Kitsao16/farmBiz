# farmBiz-backend/farming/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import home, create_business, list_businesses, redeem_incentives, log_activity, get_activities
from .views_auth import register, login_view, logout_view, auth_status

urlpatterns = [
    path('', home, name='home'),
    path('create-business/', create_business, name='create_business'),
    path('list-businesses/', list_businesses, name='list_businesses'),
    path('redeem-incentives/', redeem_incentives, name='redeem_incentives'),
    path('log_activity/', log_activity, name='log_activity'),
    path('activities/', get_activities, name='get_activities'),
    path('auth/status/', auth_status, name='auth_status'),
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
