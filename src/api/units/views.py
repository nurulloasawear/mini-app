from rest_framework import viewsets
from .serializers import UnitSerializer
from units.models import units
from api.permissions import IsAdmin

class UnitViewSet(viewsets.ModelViewSet):
    queryset = units.objects.all()
    serializer_class = UnitSerializer
    # permission_classes = [IsAdmin]

    # def perform_create(self, serializer):
    #     serializer.save(yaratuvchi=self.request.user)
