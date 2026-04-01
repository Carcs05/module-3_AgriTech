from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmViewSet, SensorDataViewSet # Gi-import ang bag-ong view

router = DefaultRouter()
router.register(r'farms', FarmViewSet)
router.register(r'sensors', SensorDataViewSet) # Gi-register ang sensors endpoint

urlpatterns = [
    path('', include(router.urls)),
]