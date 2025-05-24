from rest_framework import serializers
from projects.models import Project
from users.models import CustomUser as User

class ProjectSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all()
    )

    class Meta:
        model = Project
        fields = '__all__'
