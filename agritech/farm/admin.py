from django.contrib import admin
from .models import Farm, SensorData

# I-register ang Farm model
admin.site.register(Farm)

# I-register ang SensorData model para maka-input ka og data para sa simulation
admin.site.register(SensorData)
