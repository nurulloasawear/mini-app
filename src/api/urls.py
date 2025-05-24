from django.urls import path ,include

urlpatterns = {
	path('',include('api.units.urls')),
	path('users/',include('api.users.urls')),
	path('api/',include('api.projects.urls')),
	path('api/flask/',include('api.units.urls')),


}
 
