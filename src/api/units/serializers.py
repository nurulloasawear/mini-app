from rest_framework import serializers
from units.models import units

class UnitSerializer(serializers.ModelSerializer):
	class Meta:
		model = units
		fields = ['birlik_raqami','nomi','yaratuvchi']
