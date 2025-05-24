from django.db import models
from users.models import CustomUser
class Project(models.Model):
    company_name = models.CharField(max_length=100)
    members = models.ManyToManyField(CustomUser)  # yoki custom user modeli
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    completion = models.PositiveIntegerField(default=0)  # foizda (0-100)
    image = models.ImageField(upload_to='company-imgs/') 

    def __str__(self):
        return self.company_name
