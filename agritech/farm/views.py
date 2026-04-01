from rest_framework import viewsets
from .models import Farm, SensorData
from .serializers import FarmSerializer, SensorDataSerializer

class FarmViewSet(viewsets.ModelViewSet):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer

# Gi-add nato ni para ma-manage nimo ang sensor readings pinaagi sa API
class SensorDataViewSet(viewsets.ModelViewSet):
    queryset = SensorData.objects.all()
    serializer_class = SensorDataSerializer
