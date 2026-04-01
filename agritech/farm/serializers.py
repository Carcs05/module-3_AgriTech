from rest_framework import serializers
from .models import Farm, SensorData

class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = '__all__'

class FarmSerializer(serializers.ModelSerializer):
    # Kini nga line para makita nimo ang sensor readings sa sulod mismo sa farm data
    sensors = SensorDataSerializer(many=True, read_only=True)

    class Meta:
        model = Farm
        fields = [
            'id', 
            'farm_name', 
            'location', 
            'owner_name', 
            'crop_type', 
            'created_at', 
            'sensors' # Gi-add nato ang sensors diri
        ]