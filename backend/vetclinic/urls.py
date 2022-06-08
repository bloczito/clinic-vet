from django.urls import path
from . import views


urlpatterns = [
    path('', views.frontpage_view),
    path('login/', views.login_view, name='login'),
    path('login/members/', views.loggedin_view, name='loggedin'),
    path('logout/', views.logout_view, name='logout'),
]