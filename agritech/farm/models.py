from django.db import models

class Farm(models.Model):
    farm_name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    owner_name = models.CharField(max_length=100)
    # Manual input na kini, wala na'y fixed choices
    crop_type = models.CharField(max_length=100) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.farm_name} - {self.crop_type}"

class SensorData(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='sensors')
    soil_moisture = models.FloatField()
    soil_temperature = models.FloatField()
    soil_ph = models.FloatField()
    air_temperature = models.FloatField()
    humidity = models.FloatField()
    leaf_wetness = models.FloatField()

    threat_level = models.CharField(max_length=10, editable=False) 
    recommendation = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Classification & Regression Logic
        if self.humidity > 85 and self.leaf_wetness > 10:
            self.threat_level = 'High'
            self.recommendation = "High fungal risk detected. Apply preventive spray within 48 hours."
        elif self.humidity > 70 or self.soil_moisture < 30:
            self.threat_level = 'Medium'
            self.recommendation = "Moderate risk. Monitor soil moisture and delay irrigation for two days if possible."
        else:
            self.threat_level = 'Low'
            self.recommendation = "Condition is optimal. No immediate action required."

        super(SensorData, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.farm.farm_name} - {self.threat_level}"