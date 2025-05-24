from users.models import CustomUser
from rest_framework import serializers

class UserListSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		exclude = ['password','is_staff','is_superuser']