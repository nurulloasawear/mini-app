from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)
from .views import *

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),     # Tokenni tekshiris\
    path('token/blok/',current_user),     # Tokenni tekshiris\
    path('token/list/',all_user_for_front),     # Tokenni tekshiris\
 path('logout/', TokenBlacklistView.as_view(), name='logout')


]
